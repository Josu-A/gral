import HttpStatusCode from '@common/constants/HttpStatusCodes';
import logger from '@common/constants/logger';
import { RequestError } from '@common/utils/errors';
import ChatRepo from "@domain/chats/ChatRepo";
import {
    type IGetMessages,
    type ISendMessage,
    type LlmMessage,
    LlmRole,
    type SendMessageResponse,
    type SystemPromptData
} from '@domain/chats/local/types/schemas';
import llm from '@infra/llm';
import { Jabea } from '@infra/prisma/generated/enums';

async function getMessages(erabiltzailea_id: number, data: IGetMessages) {
    const messages = await ChatRepo.getMessages(data.ebazpena_id, erabiltzailea_id);
    logger.info('Mezuak lortu dira', { ebazpena_id: data.ebazpena_id, quantity: messages.length });
    return messages;
}

async function sendMessage(erabiltzailea_id: number, data: ISendMessage): Promise<SendMessageResponse> {
    const fullContext = await ChatRepo.getFullContextEbazpena(data.ebazpena_id, erabiltzailea_id);
    if (!fullContext) {
        throw new RequestError(HttpStatusCode.NOT_FOUND, "Ebazpena hori ez da existitzen");
    }

    if (!await llm.isAvailable()) {
        throw new RequestError(HttpStatusCode.SERVICE_UNAVAILABLE, "LLM APIa ez dago erabilgarri");
    }

    const promptData: SystemPromptData = {
        educationLevel: fullContext.ikaslea.ikasketa_maila,
        exerciseStatement: fullContext.ariketa_zehatza.ariketa.enuntziatua,
        exerciseTitle: fullContext.ariketa_zehatza.ariketa.izenburua,
        programmingLanguage: fullContext.ariketa_zehatza.programazio_lengoaia.izena,
        programmingLanguageVersion: fullContext.ariketa_zehatza.programazio_lengoaia.bertsioa
    }
    const systemPrompt = llm.createSystemPrompt(promptData);

    const messageChain: LlmMessage[] = [{
        content: systemPrompt,
        role: LlmRole.System
    }];

    for (const previousMessage of fullContext.mezuak) {
        messageChain.push({
            content: previousMessage.edukia,
            role: previousMessage.jabea === Jabea.AA ? LlmRole.Assistant : LlmRole.User
        });
    }

    messageChain.push({
        content: data.content,
        role: LlmRole.User
    });

    if (fullContext.kodea?.trim()) {
        messageChain.push({
            content: `Ikaslearen uneko kodea:\n\`\`\`${fullContext.ariketa_zehatza.programazio_lengoaia.izena}\n${fullContext.kodea}\n\`\`\``,
            role: LlmRole.User
        });
    }

    const llmResponse = await llm.sendMessage(messageChain);
    const llmResponseContent = llmResponse?.content;

    if (!llmResponseContent?.trim()) {
        throw new RequestError(HttpStatusCode.BAD_GATEWAY, 'LLM APIak ez du erantzun baliorik itzuli');
    }

    const userMessage = await ChatRepo.createMessage({
        content: data.content,
        ebazpena_id: data.ebazpena_id,
        jabea: Jabea.Erabiltzailea
    });

    const llmMessage = await ChatRepo.createMessage({
        content: llmResponseContent,
        ebazpena_id: data.ebazpena_id,
        jabea: Jabea.AA
    });

    const { ebazpena_id: _uEId, mezua_id: _uMId, ...userMessageWithoutIds } = userMessage;
    const { ebazpena_id: _aEId, mezua_id: _aMId, ...assistantMessageWithoutIds } = llmMessage;

    return {
        assistantMessage: assistantMessageWithoutIds,
        userMessage: userMessageWithoutIds
    };
}

export default {
    getMessages,
    sendMessage
} as const;