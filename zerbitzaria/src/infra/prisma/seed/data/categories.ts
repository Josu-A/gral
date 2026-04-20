export const categoryData = [
    {
        deskribapena: "Datuak gordetzeko erabiltzen diren egitura mota ezberdinak",
        izena: 'Datu-egitura',
        key: 'dataStructure'
    },
    {
        deskribapena: "Arazoak ebazteko algoritmo ezberdinak",
        izena: 'Algoritmoa',
        key: 'algorithm'
    },
    {
        deskribapena: "Matematika kontzeptuak barneratzen dituzten ariketak",
        izena: 'Matematika',
        key: 'math'
    }
] as const satisfies ReadonlyArray<{
    deskribapena: string;
    izena: string;
    key: string;
}>;

export type CategoryKey = typeof categoryData[number]['key'];
