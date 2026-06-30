import type { Exercise } from "../types";

export const numberOfAtoms = {
    enuntziatua: "statement.md",
    izenburua: "Atomo kopurua",
    key: "numberOfAtoms",
    labelKeys: ["string", "stack", "sorting", "hashMap"],
    specificExercises: [
        {
            erreferentzia_emaitza: "finalCode.py",
            funtzio_izena: "countOfAtoms",
            hasierako_kodea: "initialCode.py",
            programmingLanguageKey: "python",
            tests: [
                {
                    izena: "Oinarrizko kasua",
                    ordena: 1,
                    pisua: 1,
                    testa_kodea: "basicCase.py",
                    timeout: 2000,
                },
                {
                    izena: "Muturreko kasua",
                    ordena: 2,
                    pisua: 1,
                    testa_kodea: "edgeCase.py",
                    timeout: 2000,
                },
            ],
        },
    ],
    zailtasun_maila: "Zaila",
} as const satisfies Exercise;
