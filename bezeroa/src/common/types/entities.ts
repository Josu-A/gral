import { Egoera, IkasketaMaila, Zailtasuna } from "@gral/datu-basea";

const MAILAK: {
    label: string;
    value: IkasketaMaila;
}[] = [
    { label: "Hasiberria", value: IkasketaMaila.Hasiberria },
    { label: "Ertaina", value: IkasketaMaila.Ertaina },
    { label: "Aurreratua", value: IkasketaMaila.Aurreratua },
];

const EGOERAK: {
    label: string;
    value: Egoera;
}[] = [
    { label: "Hutsik", value: Egoera.Hutsik },
    { label: "Hasita", value: Egoera.Hasita },
    { label: "Gaindituta", value: Egoera.Gaindituta },
];

const ZAILTASUNAK: {
    label: string;
    value: Zailtasuna;
}[] = [
    { label: "Erraza", value: Zailtasuna.Erraza },
    { label: "Ertaina", value: Zailtasuna.Ertaina },
    { label: "Zaila", value: Zailtasuna.Zaila },
];

export type { Egoera, IkasketaMaila, Zailtasuna };
export { EGOERAK, MAILAK, ZAILTASUNAK };
