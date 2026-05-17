import type { Zailtasuna } from "../../../generated/enums";
import type { LabelKey } from "../labels";
import type { ProgrammingLanguageKey } from "../programmingLanguages";

interface Exercise {
    readonly enuntziatua: string;
    readonly izenburua: string;
    readonly key: string;
    readonly labelKeys: ReadonlyArray<LabelKey>;
    readonly specificExercises: ReadonlyArray<SpecificExercise>;
    readonly zailtasun_maila: Zailtasuna;
}

interface SpecificExercise {
    readonly buru_fitxategia?: string;
    readonly erreferentzia_emaitza: string;
    readonly funtzio_izena: string;
    readonly hasierako_kodea: string;
    readonly programmingLanguageKey: ProgrammingLanguageKey;
    readonly saiakera_fitxategia: string;
    readonly tests: ReadonlyArray<Test>;
}

interface Test {
    readonly izena: string;
    readonly ordena: number;
    readonly pisua: number;
    readonly testa_kodea: string;
    readonly timeout: number;
}

export type { Exercise };
