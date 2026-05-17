export const programmingLanguageData = [
    {
        bertsioa: "3.14",
        izena: "Python",
        key: "python",
    },
    {
        bertsioa: "25",
        izena: "Java",
        key: "java",
    },
    {
        bertsioa: "C23",
        izena: "C",
        key: "c",
    },
] as const satisfies ReadonlyArray<{
    bertsioa: string;
    izena: string;
    key: string;
}>;

export type ProgrammingLanguageKey =
    (typeof programmingLanguageData)[number]["key"];
