type Egoera = "Gaindituta" | "Hasita" | "Hutsik";
type IkasketaMaila = "Aurreratua" | "Ertaina" | "Hasiberria";
type Zailtasuna = "Erraza" | "Ertaina" | "Zaila";

const MAILAK: {
    label: string;
    value: IkasketaMaila;
}[] = [
    { label: "Hasiberria", value: "Hasiberria" },
    { label: "Ertaina", value: "Ertaina" },
    { label: "Aurreratua", value: "Aurreratua" },
];

const EGOERAK: {
    label: string;
    value: Egoera;
}[] = [
    { label: "Hutsik", value: "Hutsik" },
    { label: "Hasita", value: "Hasita" },
    { label: "Gaindituta", value: "Gaindituta" },
];

const ZAILTASUNAK: {
    label: string;
    value: Zailtasuna;
}[] = [
    { label: "Erraza", value: "Erraza" },
    { label: "Ertaina", value: "Ertaina" },
    { label: "Zaila", value: "Zaila" },
];

export type { Egoera, IkasketaMaila, Zailtasuna };
export { EGOERAK, MAILAK, ZAILTASUNAK };
