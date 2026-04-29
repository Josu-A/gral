type IkasketaMaila = "Aurreratua" | "Ertaina" | "Hasiberria";

const MAILAK: {
    label: string;
    value: IkasketaMaila;
}[] = [
    { label: "Hasiberria", value: "Hasiberria" },
    { label: "Ertaina", value: "Ertaina" },
    { label: "Aurreratua", value: "Aurreratua" },
];

export type { IkasketaMaila };
export { MAILAK };
