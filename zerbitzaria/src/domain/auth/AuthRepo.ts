import type { Erabiltzailea, FreskatzeTokena, IkasketaMaila } from '@infra/prisma/generated/client';

import db from '@infra/db';

async function createRefreshToken(data: {
    erabiltzailea_id: number,
    expiresAt: Date,
    ip: string,
    jti: string,
    refreshToken: string,
    userAgent: string
}): Promise<void> {
    await db.freskatzeTokena.create({
        data: {
            erabiltzailea_id: data.erabiltzailea_id,
            gailu_mota: data.userAgent,
            ip_helbidea: data.ip,
            iraungipen_data: data.expiresAt,
            tokena: data.refreshToken,
            tokena_id: data.jti
        }
    });
}

async function createStudent(data: {
    educationLevel: IkasketaMaila,
    email: string,
    name: string,
    password: string
}): Promise<void> {
    await db.erabiltzailea.create({
        data: {
            aktibatuta: true, // TODO: change to false when email verification is implemented
            helbide_elektronikoa: data.email,
            ikaslea: {
                create: {
                    ikasketa_maila: data.educationLevel
                }
            },
            izena: data.name,
            pasahitza: data.password
        }
    });
}

async function findRefreshToken(
    refreshToken: string
): Promise<FreskatzeTokena | null>;
async function findRefreshToken(
    refreshTokenHash: string,
    jti: string
): Promise<FreskatzeTokena & { erabiltzailea: Erabiltzailea | null } | null>;
async function findRefreshToken(
    arg1: string,
    arg2?: string
): Promise<FreskatzeTokena | null> {
    if (arg2 === undefined) {
        return await db.freskatzeTokena.findUnique({
            where: { tokena: arg1 }
        });
    }
    return await db.freskatzeTokena.findFirst({
        include: { erabiltzailea: true },
        where: { tokena: arg1, tokena_id: arg2 }
    });
}

async function findUser(helbide_elektronikoa: string): Promise<Erabiltzailea | null> {
    return await db.erabiltzailea.findUnique({
        where: { helbide_elektronikoa }
    });
}

async function replaceRefreshToken(
    refreshTokenHash: string,
    data: { ordezkapena: string, revokedAt: Date }
): Promise<void> {
    await db.freskatzeTokena.update({
        data: { iraungitutako_data: data.revokedAt, ordezkapena: data.ordezkapena },
        where: { tokena: refreshTokenHash }
    });
}

async function revokeAllRefreshTokens(erabiltzailea_id: number): Promise<void> {
    await db.freskatzeTokena.updateMany({
        data: { iraungitutako_data: new Date() },
        where: {
            erabiltzailea_id,
            iraungitutako_data: null
        },
    });
}

async function revokeRefreshToken(token_id: number): Promise<void> {
    await db.freskatzeTokena.update({
        data: { iraungitutako_data: new Date() },
        where: { id: token_id }
    });
}

export default {
    createRefreshToken,
    createStudent,
    findRefreshToken,
    findUser,
    replaceRefreshToken,
    revokeAllRefreshTokens,
    revokeRefreshToken
} as const;