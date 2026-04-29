import type {
    IUpdateEducation,
    IUpdatePersonalData,
    UserProfile,
} from "@domain/users/local/types/schemas";

import db from "@infra/db";
import { IkasketaMaila } from "@infra/prisma/generated/enums";

async function deleteAccount(erabiltzailea_id: number): Promise<void> {
    await db.erabiltzailea.delete({
        where: { erabiltzailea_id },
    });
}

async function deleteAttempts(erabiltzailea_id: number): Promise<number> {
    const result = await db.ebazpena.deleteMany({
        where: { erabiltzailea_id },
    });
    return result.count;
}

async function deleteMessages(erabiltzailea_id: number): Promise<number> {
    const result = await db.mezua.deleteMany({
        where: { ebazpena: { erabiltzailea_id } },
    });
    return result.count;
}

async function getEducationLevel(
    erabiltzailea_id: number,
): Promise<IkasketaMaila | null> {
    const ikaslea = await db.ikaslea.findUnique({
        select: { ikasketa_maila: true },
        where: { erabiltzailea_id },
    });
    return ikaslea?.ikasketa_maila ?? null;
}

async function getPassword(erabiltzailea_id: number): Promise<null | string> {
    const user = await db.erabiltzailea.findUnique({
        select: { pasahitza: true },
        where: { erabiltzailea_id },
    });
    return user?.pasahitza ?? null;
}

async function getProfile(
    erabiltzailea_id: number,
): Promise<null | UserProfile> {
    const profile = await db.erabiltzailea.findUnique({
        select: {
            helbide_elektronikoa: true,
            ikaslea: {
                select: {
                    gogoko_lengoaia: true,
                    ikasketa_maila: true,
                    nire_mailakoak_ikusi: true,
                },
            },
            izena: true,
        },
        where: { erabiltzailea_id },
    });
    return profile;
}

async function getViewOnlyMyLevel(erabiltzailea_id: number): Promise<boolean> {
    const user = await db.erabiltzailea.findUnique({
        select: { ikaslea: { select: { nire_mailakoak_ikusi: true } } },
        where: { erabiltzailea_id },
    });
    return user?.ikaslea?.nire_mailakoak_ikusi ?? false;
}

async function updateEducation(
    erabiltzailea_id: number,
    data: IUpdateEducation,
): Promise<IUpdateEducation> {
    const updatedData = db.ikaslea.update({
        data: {
            gogoko_lengoaia_id: data.gogoko_lengoaia,
            ikasketa_maila: data.ikasketa_maila,
            nire_mailakoak_ikusi: data.nire_mailakoak_ikusi,
        },
        where: { erabiltzailea_id },
    });
    return updatedData;
}

async function updatePassword(
    erabiltzailea_id: number,
    pasahitza: string,
): Promise<void> {
    await db.erabiltzailea.update({
        data: { pasahitza },
        where: { erabiltzailea_id },
    });
}

async function updatePersonalData(
    erabiltzailea_id: number,
    data: IUpdatePersonalData,
): Promise<IUpdatePersonalData> {
    const updatedData = await db.erabiltzailea.update({
        data: { izena: data.izena },
        where: { erabiltzailea_id },
    });
    return updatedData;
}

export default {
    deleteAccount,
    deleteAttempts,
    deleteMessages,
    getEducationLevel,
    getPassword,
    getProfile,
    getViewOnlyMyLevel,
    updateEducation,
    updatePassword,
    updatePersonalData,
} as const;
