import type {
    ILogin,
    IRegister,
    IRequestPasswordRestore,
    IRestorePassword,
    LoginResult
} from '@domain/auth/local/types/schemas';

import { environment } from '@common/constants/env';
import HttpStatusCode from '@common/constants/HttpStatusCodes';
import logger from '@common/constants/logger';
import { RequestError } from '@common/utils/errors';
import AuthRepo from '@domain/auth/AuthRepo';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import ms from 'ms';

function createJti(): string {
    return crypto.randomBytes(16).toString('hex');
}

function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

async function login(
    data: ILogin,
    ip?: string,
    userAgent?: string
): Promise<LoginResult> {
    const user = await AuthRepo.findUser(data.helbide_elektronikoa);
    if (!user) {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Erabiltzaile edo pasahitz okerra");
    }
    const passwordsMatch = await bcrypt.compare(data.pasahitza, user.pasahitza);
    if (!passwordsMatch) {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Erabiltzaile edo pasahitz okerra");
    }
    if (!user.aktibatuta) {
        throw new RequestError(HttpStatusCode.FORBIDDEN, "Erabiltzaile hau ez dago aktibatuta");
    }
    const accessToken = signAccessToken(user.erabiltzailea_id, user.helbide_elektronikoa);
    const jti = createJti();
    const refreshToken = signRefreshToken(user.erabiltzailea_id, jti);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + ms(environment.JWT_REFRESH_EXPIRATION));

    await AuthRepo.createRefreshToken({
        erabiltzailea_id: user.erabiltzailea_id,
        expiresAt,
        ip: ip ?? '',
        jti,
        refreshToken: refreshTokenHash,
        userAgent: userAgent ?? ''
    });

    logger.info('Erabiltzaileak saioa hasi du', { erabiltzailea_id: user.erabiltzailea_id, ip, userAgent });
    return {
        accessToken,
        erabiltzailea: {
            helbide_elektronikoa: user.helbide_elektronikoa,
            izena: user.izena
        },
        refreshToken
    };
}

async function logout(refreshToken: string): Promise<void> {
    const refreshTokenHash = hashToken(refreshToken);
    const token = await AuthRepo.findRefreshToken(refreshTokenHash);
    if (token && !token.iraungitutako_data) {
        await AuthRepo.revokeRefreshToken(token.id);
        logger.info('Erabiltzaileak saioa amaitu du', { erabiltzailea_id: token.erabiltzailea_id });
    }
}

async function refreshToken(
    refreshToken: string,
    ip?: string,
    userAgent?: string
): Promise<LoginResult> {
    let decoded: JwtPayload | string;
    try {
        decoded = jwt.verify(refreshToken, environment.JWT_REFRESH_SECRET);
    }
    catch {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena baliogabea da");
    }

    if (typeof decoded === "string" || typeof decoded.jti !== "string") {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena baliogabea da");
    }

    const refreshTokenHash = hashToken(refreshToken);
    const token = await AuthRepo.findRefreshToken(refreshTokenHash, decoded.jti);

    if (!token) {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena baliogabea da");
    }
    if (token.iraungitutako_data) {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena iraungituta dago");
    }
    if (token.iraungipen_data < new Date()) {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena iraungituta dago");
    }
    if (!token.erabiltzailea) {
        throw new RequestError(HttpStatusCode.UNAUTHORIZED, "Erabiltzailea ez da aurkitu");
    }

    const newJti = createJti();
    await AuthRepo.replaceRefreshToken(refreshTokenHash, {
        ordezkapena: newJti,
        revokedAt: new Date()
    });
    const accessToken = signAccessToken(token.erabiltzailea_id, token.erabiltzailea.helbide_elektronikoa);
    const newRefreshTolem = signRefreshToken(token.erabiltzailea_id, newJti);
    const newRefreshTokenHash = hashToken(newRefreshTolem);
    const expiresAt = new Date(Date.now() + ms(environment.JWT_REFRESH_EXPIRATION));

    await AuthRepo.createRefreshToken({
        erabiltzailea_id: token.erabiltzailea_id,
        expiresAt,
        ip: ip ?? '',
        jti: newJti,
        refreshToken: newRefreshTokenHash,
        userAgent: userAgent ?? ''
    });

    logger.info('Erabiltzaileak tokena freskatu du', { erabiltzailea_id: token.erabiltzailea_id, ip, userAgent });
    return {
        accessToken,
        erabiltzailea: {
            helbide_elektronikoa: token.erabiltzailea.helbide_elektronikoa,
            izena: token.erabiltzailea.izena
        },
        refreshToken
    };
}

async function register(data: IRegister): Promise<void> {
    const existingUser = await AuthRepo.findUser(data.helbide_elektronikoa);
    if (existingUser) {
        throw new RequestError(HttpStatusCode.OK, "Erabiltzailea badago dagoeneko");
    }
    const hashedPassword = await bcrypt.hash(data.pasahitza, environment.SALT_ROUNDS);
    await AuthRepo.createStudent({
        educationLevel: data.ikasketa_maila,
        email: data.helbide_elektronikoa,
        name: data.izena,
        password: hashedPassword
    });
}

async function requestPasswordRestore(data: IRequestPasswordRestore): Promise<void> {
    const user = await AuthRepo.findUser(data.helbide_elektronikoa);
    if (user) {
        // TODO: Implement password restore request logic
        logger.info('Pasahitza berrezartzeko eskaera jaso da', { erabiltzailea_id: user.erabiltzailea_id });
    }
}

async function restorePassword(_data: IRestorePassword): Promise<void> {
    // TODO: implement password restore logic
    // validate token, find user, hash new password, update user password, invalidate existing refresh tokens, etc.
}

function signAccessToken(erabiltzailea_id: number, helbide_elektronikoa: string): string {
    const payload = {
        email: helbide_elektronikoa,
        id: erabiltzailea_id
    };
    return jwt.sign(payload, environment.JWT_ACCESS_SECRET, {
        expiresIn: environment.JWT_ACCESS_EXPIRATION
    } as SignOptions);
}

function signRefreshToken(erabiltzailea_id: number, jti: string): string {
    const payload = {
        id: erabiltzailea_id,
        jti
    };
    return jwt.sign(payload, environment.JWT_REFRESH_SECRET, {
        expiresIn: environment.JWT_REFRESH_EXPIRATION
    } as SignOptions);
}

async function verify(): Promise<void> {
    // TODO
    logger.info('TODO: implement verify function');
}

export default {
    login,
    logout,
    refreshToken,
    register,
    requestPasswordRestore,
    restorePassword,
    verify
} as const;