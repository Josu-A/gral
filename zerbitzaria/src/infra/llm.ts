import type { LlmMessage, SystemPromptData } from "@domain/chats/local/types/schemas";

import logger from '@common/constants/logger';
import fs from 'node:fs';
import path from 'node:path';

interface LlmResponse {
    content: string;
    model: string;
    usage: {
        completionTokens: number;
        promptTokens: number;
    }
};

const systemPromptTemplate = fs.readFileSync(
    path.join(import.meta.dirname, 'prompts', 'systemPrompt.md'),
    'utf8'
);

function createSystemPrompt(data: SystemPromptData) {
    return renderTemplate(systemPromptTemplate, {
        educationLevel: data.educationLevel,
        exerciseStatement: data.exerciseStatement,
        exerciseTitle: data.exerciseTitle,
        programmingLanguage: data.programmingLanguage,
        programmingLanguageVersion: data.programmingLanguageVersion
    });
}

async function isAvailable(): Promise<boolean> {
    // TODO
    logger.info('LLMaren APIa eskuragarri dagoen egiaztatzen');
    return await new Promise(resolve => resolve(true));
}

function renderTemplate(template: string, variables: Record<string, string>): string {
    const pattern = /\\\{\{|\{\{(\w+)\}\}/g;
    return template.replace(pattern, (match, key: string | undefined) => {
        if (match === '\\{{') {
            return '{{';
        }
        return variables[key ?? ''] ?? '';
    });
}

async function sendMessage(messages: LlmMessage[]): Promise<LlmResponse | null> {
    // TODO
    logger.info('LLM APIari mezua bidaltzen', { messages });
    return await new Promise(resolve => resolve({
        content: 'Gezurrezko LLMaren erantzuna',
        model: 'default',
        usage: { completionTokens: 0, promptTokens: 0 }
    }));
}

export default {
    createSystemPrompt,
    isAvailable,
    sendMessage
} as const;