import type { Exercise } from "../types";

export const reverseInteger = {
    enuntziatua: "statement.md",
    izenburua: "Zenbaki osoaren alderantzizkoa",
    key: "reverseInteger",
    labelKeys: ["numberTheory"],
    specificExercises: [
        {
            erreferentzia_emaitza: "finalCode.py",
            funtzio_izena: "reverse",
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
