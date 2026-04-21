import { IkasketaMaila } from "@infra/prisma/generated/enums";
import { z } from "zod";

const UpdateEducationSchema = z.object({
    gogoko_lengoaia: z.number().int().positive().nullable().optional(),
    ikasketa_maila: z.enum(IkasketaMaila).optional()
});

type IUpdateEducation = z.infer<typeof UpdateEducationSchema>;

const PasswordSchema = z.string()
    .min(8, "Gutxienez 8 karaktere izan behar ditu")
    .regex(/[A-Z]/, "Gutxienez letra larri bat izan behar du")
    .regex(/[a-z]/, "Gutxienez letra xehe bat izan behar du")
    .regex(/[0-9]/, "Gutxienez zenbaki bat izan behar du")
    .regex(/[^A-Za-z0-9]/, "Gutxienez karaktere berezi bat izan behar du");

const UpdatePasswordSchema = z.object({
    pasahitza_berria: PasswordSchema,
    pasahitza_errepikatu: z.string().min(1),
    pasahitza_zaharra: z.string().min(1)
}).refine(data => data.pasahitza_berria === data.pasahitza_errepikatu, {
    error: "Pasahitzak ez dira berdinak",
    path: ['pasahitza_errepikatu']
});

type IUpdatePassword = z.infer<typeof UpdatePasswordSchema>;

const UpdatePersonalDataSchema = z.object({
    izena: z.string().min(1).max(255).optional()
});

type IUpdatePersonalData = z.infer<typeof UpdatePersonalDataSchema>;

interface UserProfile {
	helbide_elektronikoa: string;
	ikaslea: null | {
		gogoko_lengoaia: null | {
			bertsioa: string;
			izena: string;
			programazio_lengoaia_id: number;
		};
		ikasketa_maila: (typeof IkasketaMaila)[keyof typeof IkasketaMaila];
	};
	izena: string;
}

export {
    UpdateEducationSchema,
    UpdatePasswordSchema,
    UpdatePersonalDataSchema
};

export type {
    IUpdateEducation,
    IUpdatePassword,
    IUpdatePersonalData,
	UserProfile
};
