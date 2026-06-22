import type { Exercise } from "../types";

export const medianOfTwoSortedArrays = {
    enuntziatua: "statement.md",
    izenburua: "Bi array ordenatuen mediana",
    key: "medianOfTwoSortedArrays",
    labelKeys: ["array", "binarySearch"],
    specificExercises: [
        {
            erreferentzia_emaitza: "finalCode.py",
            funtzio_izena: "findMedianSortedArrays",
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
        {
            erreferentzia_emaitza: "finalCode.java",
            funtzio_izena: "findMedianSortedArrays",
            hasierako_kodea: "initialCode.java",
            programmingLanguageKey: "java",
            tests: [
                {
                    izena: "Oinarrizko kasua",
                    ordena: 1,
                    pisua: 1,
                    testa_kodea: "BasicCaseTest.java",
                    timeout: 10000,
                },
            ],
        },
        {
            buru_fitxategia: "solution.h",
            erreferentzia_emaitza: "finalCode.c",
            funtzio_izena: "findMedianSortedArrays",
            hasierako_kodea: "initialCode.c",
            programmingLanguageKey: "c",
            tests: [
                {
                    izena: "Oinarrizko kasua",
                    ordena: 1,
                    pisua: 1,
                    testa_kodea: "basicCase.c",
                    timeout: 2000,
                },
            ],
        },
    ],
    zailtasun_maila: "Zaila",
} as const satisfies Exercise;
