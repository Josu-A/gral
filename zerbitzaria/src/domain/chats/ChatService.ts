import type { Mezua } from "@gral/datu-basea";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import logger from "@common/constants/logger";
import { RequestError } from "@common/utils/errors";
import AttemptRepo from "@domain/attempts/AttemptRepo";
import ChatRepo from "@domain/chats/ChatRepo";
import {
    type IGetMessages,
    type ISendMessage,
    type LlmMessage,
    LlmRole,
    type SendMessageResponse,
    type SystemPromptData,
} from "@domain/chats/local/types/schemas";
import db from "@gral/datu-basea";
import { Jabea } from "@gral/datu-basea";
import llm from "@infra/llm";

async function getMessages(erabiltzailea_id: number, data: IGetMessages) {
    const messages = await ChatRepo.getMessages(
        data.ebazpena_id,
        erabiltzailea_id,
    );
    logger.info("Mezuak lortu dira", {
        ebazpena_id: data.ebazpena_id,
        quantity: messages.length,
    });
    return messages;
}

async function sendMessage(
    erabiltzailea_id: number,
    data: ISendMessage,
): Promise<SendMessageResponse> {
    const [fullContext, recentAttempts] = await Promise.all([
        ChatRepo.getFullContextEbazpena(data.ebazpena_id, erabiltzailea_id),
        AttemptRepo.listSpecificAttempts(erabiltzailea_id, data.ebazpena_id),
    ]);
    if (!fullContext) {
        throw new RequestError(
            HttpStatusCode.NOT_FOUND,
            "Ebazpena hori ez da existitzen",
        );
    }

    let formattedAttempts = "Ikasleak ez du oraindik saiakerarik egin.";
    if (recentAttempts.length > 0) {
        formattedAttempts = recentAttempts
            .map(
                (attempt) =>
                    `- Data: ${attempt.denbora_zigilua.toISOString()}, Nota: ${attempt.nota}`,
            )
            .join("\n");
    }

    const promptData: SystemPromptData = {
        educationLevel: fullContext.ikaslea.ikasketa_maila,
        exerciseStatement: fullContext.ariketa_zehatza.ariketa.enuntziatua,
        exerciseTitle: fullContext.ariketa_zehatza.ariketa.izenburua,
        programmingLanguage:
            fullContext.ariketa_zehatza.programazio_lengoaia.izena,
        programmingLanguageVersion:
            fullContext.ariketa_zehatza.programazio_lengoaia.bertsioa,
        recentAttempts: formattedAttempts,
    };
    const systemPrompt = llm.createSystemPrompt(promptData);

    const messageChain: LlmMessage[] = [
        {
            content: systemPrompt,
            role: LlmRole.System,
        },
    ];

    for (const previousMessage of fullContext.mezuak) {
        messageChain.push({
            content: previousMessage.edukia,
            role:
                previousMessage.jabea === Jabea.AA
                    ? LlmRole.Assistant
                    : LlmRole.User,
        });
    }

    let userContent = data.content;

    if (fullContext.kodea?.trim()) {
        userContent += `\n\nIkaslearen uneko kodea:\n\`\`\`${fullContext.ariketa_zehatza.programazio_lengoaia.izena}\n${fullContext.kodea}\n\`\`\``;
    }

    messageChain.push({
        content: userContent,
        role: LlmRole.User,
    });

    const filteredMessageChain = llm.filterMessageChain(messageChain);
    const llmResponse = await llm.sendMessage(filteredMessageChain);
    const llmResponseContent = llmResponse?.content;

    if (!llmResponseContent?.trim()) {
        throw new RequestError(
            HttpStatusCode.BAD_GATEWAY,
            "LLM APIak ez du erantzun baliorik itzuli",
        );
    }

    let userMessage!: Mezua;
    let llmMessage!: Mezua;

    await db.$transaction(async (tx) => {
        userMessage = await ChatRepo.createMessage(
            {
                content: data.content,
                ebazpena_id: data.ebazpena_id,
                jabea: Jabea.Erabiltzailea,
            },
            tx,
        );
        llmMessage = await ChatRepo.createMessage(
            {
                content: llmResponseContent,
                ebazpena_id: data.ebazpena_id,
                jabea: Jabea.AA,
            },
            tx,
        );
    });

    const {
        ebazpena_id: _uEId,
        mezua_id: _uMId,
        ...userMessageWithoutIds
    } = userMessage;
    const {
        ebazpena_id: _aEId,
        mezua_id: _aMId,
        ...assistantMessageWithoutIds
    } = llmMessage;

    return {
        assistantMessage: assistantMessageWithoutIds,
        userMessage: userMessageWithoutIds,
    };
}

export default {
    getMessages,
    sendMessage,
} as const;
