import type { IkasketaMaila } from "@infra/prisma/generated/enums";
import type { ProgrammingLanguageKey } from "@infra/prisma/seed/data/programmingLanguages";

interface Student {
    aktibatuta: boolean;
    gogoko_lengoaia_id: ProgrammingLanguageKey;
    helbide_elektronikoa: string;
    ikasketa_maila: IkasketaMaila;
    izena: string;
    key: string;
    pasahitza: string;
}

type Students = ReadonlyArray<Student>;

export type {
    Student,
    Students
};
