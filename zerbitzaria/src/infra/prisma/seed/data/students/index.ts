import type { Students } from "@infra/prisma/seed/data/students/types"

export const testingStudentData = [
    {
        aktibatuta: true,
        gogoko_lengoaia_id: 'python',
        helbide_elektronikoa: 'test@student.com',
        ikasketa_maila: 'Hasiberria',
        izena: 'Test Student',
        key: 'testStudent',
        pasahitza: '$2b$10$PjL3jz/Bn6qScbWRkEyTzO.NB.LRk/plXn3DlDYB14CwPSjKYu4te' // "test"
    }
] as const satisfies Students;

export const studentData = [] as const satisfies Students;

export type StudentKey = typeof studentData[number]['key'];
export type TestingStudentKey = typeof testingStudentData[number]['key'];
