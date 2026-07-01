import type { Exercise } from "../types";

export const courseSchedule = {
    enuntziatua: "statement.md",
    izenburua: "Ikastaro egutegia",
    key: "courseSchedule",
    labelKeys: ["search", "graph"],
    specificExercises: [
        {
            erreferentzia_emaitza: "finalCode.py",
            funtzio_izena: "canFinish",
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
            ],
        },
    ],
    zailtasun_maila: "Ertaina",
} as const satisfies Exercise;
