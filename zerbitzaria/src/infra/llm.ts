import { environment } from "@common/constants/env";
import logger from "@common/constants/logger";
import {
    type LlmMessage,
    LlmRole,
    type SystemPromptData,
} from "@domain/chats/local/types/schemas";
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

interface ContextOptions {
    lastMessagesToKeep?: number;
}

interface LlmResponse {
    content: string;
    model: string;
    usage: {
        completionTokens: number;
        promptTokens: number;
    };
}

const MAX_MESSAGE_CHAIN_LENGTH = 20;
const MAX_COMPLETION_TOKENS = 2048;
const TEMPERATURE = 0.4;
const MAX_RETRIES = 3;

const systemPromptTemplate = fs.readFileSync(
    path.join(import.meta.dirname, "prompts", "systemPrompt.md"),
    "utf8",
);

const client = new OpenAI({
    apiKey: environment.API_KEY_LATXA,
    baseURL: environment.API_URL_LATXA,
    maxRetries: MAX_RETRIES,
});

function createSystemPrompt(data: SystemPromptData) {
    return renderTemplate(systemPromptTemplate, {
        educationLevel: data.educationLevel,
        exerciseStatement: data.exerciseStatement,
        exerciseTitle: data.exerciseTitle,
        programmingLanguage: data.programmingLanguage,
        programmingLanguageVersion: data.programmingLanguageVersion,
        recentAttempts: data.recentAttempts,
    });
}

function filterMessageChain(
    messages: LlmMessage[],
    options: ContextOptions = {},
): LlmMessage[] {
    const lastMessagesToKeep =
        options.lastMessagesToKeep ?? MAX_MESSAGE_CHAIN_LENGTH;

    if (messages.length === 0) {
        return messages;
    }

    const isFirstMessageSystem = messages[0].role === LlmRole.System;
    const systemMessage = isFirstMessageSystem ? [messages[0]] : [];
    const conversationMessages = isFirstMessageSystem
        ? messages.slice(1)
        : messages;

    if (conversationMessages.length <= lastMessagesToKeep) {
        return messages;
    }

    const recentConversationMessages =
        conversationMessages.slice(-lastMessagesToKeep);

    while (
        recentConversationMessages.length > 0 &&
        recentConversationMessages[0].role === LlmRole.Assistant
    ) {
        recentConversationMessages.shift();
    }

    return [...systemMessage, ...recentConversationMessages];
}

function renderTemplate(
    template: string,
    variables: Record<string, string>,
): string {
    const pattern = /\\(.)|\{\{(\w+)\}\}/g;
    return template.replace(
        pattern,
        (_match, escapedChar: string | undefined, key: string | undefined) => {
            if (escapedChar !== undefined) {
                return escapedChar;
            }
            return variables[key ?? ""] ?? "";
        },
    );
}

async function sendMessage(
    messages: LlmMessage[],
): Promise<LlmResponse | null> {
    logger.info("LLM APIari mezua bidaltzen", {
        messages: JSON.stringify(messages),
    });
    try {
        const completion = await client.chat.completions.create({
            max_tokens: MAX_COMPLETION_TOKENS,
            messages,
            model: environment.API_MODEL_LATXA,
            temperature: TEMPERATURE,
        });

        const choice = completion.choices[0];

        if (!choice?.message.content) {
            logger.warn("LLM APIak ez du edukirik itzuli", { completion });
            return null;
        }

        return {
            content: choice.message.content,
            model: completion.model,
            usage: {
                completionTokens: completion.usage?.completion_tokens ?? 0,
                promptTokens: completion.usage?.prompt_tokens ?? 0,
            },
        };
    } catch (error) {
        logger.error("Errorea LLM APIarekin komunikatzean:", {
            error: error instanceof Error ? error.message : String(error),
        });
        return null;
    }
}

export default {
    createSystemPrompt,
    filterMessageChain,
    sendMessage,
} as const;
