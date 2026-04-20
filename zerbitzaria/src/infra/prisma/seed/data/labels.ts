import type { CategoryKey } from "@infra/prisma/seed/data/categories";

export const labelData = [
    {
        categoryKey: 'dataStructure',
        deskribapena: "Zerrendekin erlazionatutako ariketak",
        izena: 'Array',
        key: 'array',
    },
    {
        categoryKey: 'dataStructure',
        deskribapena: "Hash taulekin erlazionatutako ariketak",
        izena: 'HashMap',
        key: 'hashMap',
    },
    {
        categoryKey: 'algorithm',
        deskribapena: "Ordenazio algoritmoekin erlazionatutako ariketak",
        izena: 'Ordenazioa',
        key: 'sorting',
    },
    {
        categoryKey: 'algorithm',
        deskribapena: "Bilaketa algoritmoekin erlazionatutako ariketak",
        izena: 'Bilaketa',
        key: 'search',

    },
    {
        categoryKey: 'algorithm',
        deskribapena: "Bilaketa bitarra algoritmoarekin erlazionatutako ariketak",
        izena: 'Bilaketa bitarra',
        key: 'binarySearch',
    },
    {
        categoryKey: 'math',
        deskribapena: "Zenbaki osoen propietateak eta oinarri matematikoetan oinarritutako ariketak",
        izena: 'Zenbakien teoria',
        key: 'numberTheory',
    },
] as const satisfies ReadonlyArray<{
    categoryKey: CategoryKey;
    deskribapena: string;
    izena: string;
    key: string;
}>;

export type LabelKey = typeof labelData[number]['key'];
