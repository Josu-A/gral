import type {
    IUpdateEducation,
    IUpdatePassword,
    IUpdatePersonalData,
    UserProfile
} from '@domain/users/local/types/schemas';

import { environment } from '@common/constants/env';
import HttpStatusCode from '@common/constants/HttpStatusCodes';
import logger from '@common/constants/logger';
import { RequestError } from '@common/utils/errors';
import AuthRepo from '@domain/auth/AuthRepo';
import UserRepo from "@domain/users/UserRepo";
import bcrypt from 'bcryptjs';

async function deleteAccount(erabiltzailea_id: number): Promise<void> {
    await UserRepo.deleteAccount(erabiltzailea_id);
    logger.info('Kontua ezabatu da', { erabiltzailea_id });
}

async function deleteAttempts(erabiltzailea_id: number): Promise<void> {
    const quantity = await UserRepo.deleteAttempts(erabiltzailea_id);
    logger.info('Saiakerak ezabatu dira', { erabiltzailea_id, quantity });
}

async function deleteMessages(erabiltzailea_id: number): Promise<void> {
    const quantity = await UserRepo.deleteMessages(erabiltzailea_id);
    logger.info('Mezu guztiak ezabatu dira', { erabiltzailea_id, quantity });
}

async function getProfile(erabiltzailea_id: number): Promise<UserProfile> {
    const profile = await UserRepo.getProfile(erabiltzailea_id);
    if (!profile) {
        throw new RequestError(HttpStatusCode.NOT_FOUND, "Erabiltzaile hori ez da existitzen");
    }
    return profile;
}

async function updateEducation(
    erabiltzailea_id: number,
    data: IUpdateEducation
): Promise<IUpdateEducation> {
    const updatedData = await UserRepo.updateEducation(erabiltzailea_id, data);
    logger.info("Hezkuntza ezarpenak eguneratu dira", { erabiltzailea_id, ...data });
    return updatedData;
}

async function updatePassword(
    erabiltzailea_id: number,
    data: IUpdatePassword
): Promise<void> {
    const oldPassword = await UserRepo.getPassword(erabiltzailea_id);
    if (!oldPassword) {
        throw new RequestError(HttpStatusCode.NOT_FOUND, "Erabiltzaile hori ez da existitzen");
    }
    const passwordsMatch = await bcrypt.compare(data.pasahitza_zaharra, oldPassword);
    if (!passwordsMatch) {
        throw new RequestError(HttpStatusCode.BAD_REQUEST, "Pasahitz zaharra ez da zuzena");
    }
    const newPassword = await bcrypt.hash(data.pasahitza_berria, environment.SALT_ROUNDS);
    await UserRepo.updatePassword(erabiltzailea_id, newPassword);
    await AuthRepo.revokeAllRefreshTokens(erabiltzailea_id);
    logger.info("Pasahitza eguneratu da", { erabiltzailea_id });
}

async function updatePersonalData(
    erabiltzailea_id: number,
    data: IUpdatePersonalData
): Promise<IUpdatePersonalData> {
    const updatedData = await UserRepo.updatePersonalData(erabiltzailea_id, data);
    logger.info("Datu pertsonalak eguneratu dira", { erabiltzailea_id, ...data });
    return updatedData;
}

export default {
    deleteAccount,
    deleteAttempts,
    deleteMessages,
    getProfile,
    updateEducation,
    updatePassword,
    updatePersonalData
} as const;