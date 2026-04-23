import type { FullContextEbazpena, ISendMessageAnyone } from '@domain/chats/local/types/schemas';
import type { Mezua } from '@infra/prisma/generated/client';

import db from '@infra/db';

async function createMessage(data: ISendMessageAnyone): Promise<Mezua> {
    const message = await db.mezua.create({
        data: {
            ebazpena_id: data.ebazpena_id,
            edukia: data.content,
            jabea: data.jabea,
        }
    });
    return message;
}

async function getFullContextEbazpena(ebazpena_id: number, erabiltzailea_id: number): Promise<FullContextEbazpena | null> {
    const ebazpena = await db.ebazpena.findFirst({
        include: {
            ariketa_zehatza: {
                include: {
                    ariketa: true,
                    programazio_lengoaia: true,
                    testak: true
                }
            },
            ikaslea: true,
            mezuak: {
                orderBy: {
                    denbora_zigilua: 'asc'
                }
            }
        },
        where: {
            ebazpena_id,
            erabiltzailea_id
        }
    });
    return ebazpena;
}

async function getMessages(ebazpena_id: number, erabiltzailea_id: number): Promise<Mezua[]> {
    const messages = await db.mezua.findMany({
        orderBy: { denbora_zigilua: 'asc' },
        where: {
            ebazpena: {
                erabiltzailea_id
            },
            ebazpena_id
        }
    });
    return messages;
}

export default {
    createMessage,
    getFullContextEbazpena,
    getMessages
} as const;