import db from '@infra/db';

async function revokeAllRefreshTokens(erabiltzailea_id: number): Promise<void> {
    await db.freskatzeTokena.updateMany({
        data: { iraungitutako_data: new Date() },
        where: {
            erabiltzailea_id,
            iraungitutako_data: null
        },
    });
}

export default {
    revokeAllRefreshTokens
} as const;