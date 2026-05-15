import logger from "@common/constants/logger";
import {
    type LlmMessage,
    LlmRole,
    type SystemPromptData,
} from "@domain/chats/local/types/schemas";
import fs from "node:fs";
import path from "node:path";

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

const systemPromptTemplate = fs.readFileSync(
    path.join(import.meta.dirname, "prompts", "systemPrompt.md"),
    "utf8",
);

function createSystemPrompt(data: SystemPromptData) {
    return renderTemplate(systemPromptTemplate, {
        educationLevel: data.educationLevel,
        exerciseStatement: data.exerciseStatement,
        exerciseTitle: data.exerciseTitle,
        programmingLanguage: data.programmingLanguage,
        programmingLanguageVersion: data.programmingLanguageVersion,
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
    // TODO
    logger.info("LLM APIari mezua bidaltzen", { messages });
    return await new Promise((resolve) =>
        resolve({
            content: "Gezurrezko LLMaren erantzuna",
            model: "default",
            usage: { completionTokens: 0, promptTokens: 0 },
        }),
    );
}

export default {
    createSystemPrompt,
    filterMessageChain,
    sendMessage,
} as const;
