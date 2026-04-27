import { z } from "zod";

const LoginSchema = z.object({
    helbide_elektronikoa: z.email("Helbide elektroniko ez da baliozkoa"),
    pasahitza: z.string().min(1, "Pasahitza beharrezkoa da"),
});

type ILogin = z.infer<typeof LoginSchema>;

const PasswordSchema = z
    .string()
    .min(8, "Gutxienez 8 karaktere izan behar ditu")
    .regex(/[A-Z]/, "Gutxienez letra larri bat izan behar du")
    .regex(/[a-z]/, "Gutxienez letra xehe bat izan behar du")
    .regex(/[0-9]/, "Gutxienez zenbaki bat izan behar du")
    .regex(/[^A-Za-z0-9]/, "Gutxienez karaktere berezi bat izan behar du");

const RegisterSchema = z
    .object({
        helbide_elektronikoa: z
            .email("Helbide elektroniko ez da baliozkoa")
            .max(255, "Helbide elektronikoa luzeegia da"),
        ikasketa_maila: z.enum(["Hasiberria", "Ertaina", "Aurreratua"], {
            error: "Aukeratu baliozko maila bat",
        }),
        izena: z
            .string()
            .min(1, "Izena beharrezkoa da")
            .max(255, "Izena luzeegia da"),
        pasahitza: PasswordSchema,
        pasahitza_errepikatu: z
            .string()
            .min(1, "Pasahitza errepikatu behar da"),
    })
    .refine((data) => data.pasahitza === data.pasahitza_errepikatu, {
        error: "Pasahitzak ez dira berdinak",
        path: ["pasahitza_errepikatu"],
    });

type IRegister = z.infer<typeof RegisterSchema>;

const RequestPasswordRestoreSchema = z.object({
    helbide_elektronikoa: z.email("Helbide elektroniko ez da baliozkoa"),
});

type IRequestPasswordRestore = z.infer<typeof RequestPasswordRestoreSchema>;

const RestorePasswordSchema = z
    .object({
        pasahitza: PasswordSchema,
        pasahitza_errepikatu: z
            .string()
            .min(1, "Pasahitza errepikatu behar da"),
        token: z.string().min(1, "Tokena beharrezkoa da"),
    })
    .refine((data) => data.pasahitza === data.pasahitza_errepikatu, {
        error: "Pasahitzak ez dira berdinak",
        path: ["pasahitza_errepikatu"],
    });

type IRestorePassword = z.infer<typeof RestorePasswordSchema>;

const VerifySchema = z.object({
    token: z.string().min(6, "Tokenak sei karaktere behar ditu"),
});

type IVerify = z.infer<typeof VerifySchema>;

interface LoginResult {
    accessToken: string;
    erabiltzailea: {
        helbide_elektronikoa: string;
        izena: string;
    };
    refreshToken: string;
}

export {
    LoginSchema,
    RegisterSchema,
    RequestPasswordRestoreSchema,
    RestorePasswordSchema,
    VerifySchema,
};

export type {
    ILogin,
    IRegister,
    IRequestPasswordRestore,
    IRestorePassword,
    IVerify,
    LoginResult,
};
