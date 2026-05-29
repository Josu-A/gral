import type {
    Ariketa,
    IkasketaMaila,
    Ikaslea,
    Mezua,
    ProgramazioLengoaia,
    Testa,
} from "@gral/datu-basea";
import type { OpenAI } from "openai";

import { Jabea } from "@gral/datu-basea";
import { z } from "zod";

const SendMessageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Mezua ezin da hutsik egon")
        .max(1000, "Mezua luzeegia da"),
    ebazpena_id: z.coerce.number<number>().int().positive(),
});

type ISendMessage = z.infer<typeof SendMessageSchema>;

const SendMessageAnyoneSchema = SendMessageSchema.extend({
    jabea: z.enum(Jabea),
});

type ISendMessageAnyone = z.infer<typeof SendMessageAnyoneSchema>;

const GetMessagesSchema = z.object({
    ebazpena_id: z.coerce.number<number>().int().positive(),
});

interface FullContextEbazpena {
    ariketa_zehatza: {
        ariketa: Ariketa;
        erreferentzia_emaitza: string;
        programazio_lengoaia: ProgramazioLengoaia;
        testak: Testa[];
    };
    ikaslea: Ikaslea;
    kodea: null | string;
    mezuak: Mezua[];
}

type IGetMessages = z.infer<typeof GetMessagesSchema>;

const LlmRole = {
    Assistant: "assistant",
    System: "system",
    Tool: "tool",
    User: "user",
} as const;

type LlmMessage =
    | {
          content: string;
          name?: string;
          role: typeof LlmRole.Tool;
          tool_call_id: string;
      }
    | {
          content: string;
          role: typeof LlmRole.Assistant;
          tool_calls?: Array<OpenAI.ChatCompletionMessageToolCall>;
      }
    | {
          content: string;
          role: typeof LlmRole.System | typeof LlmRole.User;
      };

type MezuaWithoutIds = Omit<Mezua, "ebazpena_id" | "mezua_id">;

interface SendMessageResponse {
    assistantMessage: MezuaWithoutIds;
    userMessage: MezuaWithoutIds;
}

interface SystemPromptData {
    educationLevel: IkasketaMaila;
    exerciseStatement: string;
    exerciseTitle: string;
    programmingLanguage: string;
    programmingLanguageVersion: string;
    recentAttempts: string;
    referenceSolution: string;
}

export {
    GetMessagesSchema,
    LlmRole,
    SendMessageAnyoneSchema,
    SendMessageSchema,
};

export type {
    FullContextEbazpena,
    IGetMessages,
    ISendMessage,
    ISendMessageAnyone,
    LlmMessage,
    SendMessageResponse,
    SystemPromptData,
};
