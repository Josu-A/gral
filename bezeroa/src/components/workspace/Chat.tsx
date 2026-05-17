import { Jabea } from "@gral/datu-basea";
import clsx from "clsx";
import { type JSX, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import apiClient from "@/common/apiClient";
import { handleApiError } from "@/common/errorHelper";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
    denbora_zigilua: string;
    edukia: string;
    jabea: Jabea;
}

interface ChatProps {
    ebazpenaId: number;
    onChatClose: () => void;
}

interface GetMessagesResponse {
    data?: {
        messages: ChatMessage[];
    };
    error?: string;
    success: boolean;
}

interface SendMessageResponse {
    data?: {
        message: {
            assistantMessage: ChatMessage;
            userMessage: ChatMessage;
        };
    };
    error?: string;
    success: boolean;
}

const ERROR_GENERIC_SEND = "Akats bat gertatu da mezua bidaltzean";
const ERROR_GENERIC_LOAD = "Akats bat gertatu da mezuak eskuratzean";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TEXTAREA_HEIGHT = 128;

function Chat({ ebazpenaId, onChatClose }: ChatProps): JSX.Element {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [loadingError, setLoadingError] = useState<null | string>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = async (): Promise<void> => {
        const message = inputValue.trim();
        if (!message || isSending) {
            return;
        }

        const newUserMessage: ChatMessage = {
            denbora_zigilua: new Date().toISOString(),
            edukia: message,
            jabea: Jabea.Erabiltzailea,
        };

        setIsSending(true);
        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue("");

        try {
            const res = await apiClient.post<SendMessageResponse>(
                `/chat/send`,
                {
                    content: message,
                    ebazpena_id: ebazpenaId,
                },
            );

            if (!res.data.success || !res.data.data) {
                throw new Error(res.data.error || ERROR_GENERIC_SEND);
            }

            const resData = res.data.data;
            const { assistantMessage, userMessage } = resData.message;

            setMessages((prev) => [
                ...prev.slice(0, -1),
                userMessage,
                assistantMessage,
            ]);
        } catch (err: unknown) {
            setMessages((prev) => prev.slice(0, -1));
            setInputValue(message);
            toast.warning(handleApiError(err, ERROR_GENERIC_SEND).general);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>,
    ): void => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const loadMessages = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get<GetMessagesResponse>(`/chat`, {
                    params: { ebazpena_id: ebazpenaId },
                    signal: controller.signal,
                });

                if (!res.data.success || !res.data.data) {
                    setLoadingError(res.data.error || ERROR_GENERIC_LOAD);
                    return;
                }

                const conversationData = res.data.data;
                setMessages(conversationData.messages);
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                setLoadingError(
                    handleApiError(err, ERROR_GENERIC_LOAD).general,
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadMessages();

        return () => controller.abort();
    }, [ebazpenaId]);

    useEffect(() => {
        if (!isSending && !loadingError && !isLoading) {
            textareaRef.current?.focus();
        }
    }, [isSending, loadingError, isLoading]);

    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            const borderHeight = textarea.offsetHeight - textarea.clientHeight;
            const scrollHeight = textarea.scrollHeight + borderHeight;
            const desiredHeight = Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT);
            textarea.style.height = `${desiredHeight}px`;
        }
    }, [inputValue]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            return;
        }
        container.scrollTop = container.scrollHeight;
    }, [messages, isSending]);

    return (
        <div className="flex h-full min-h-0 flex-col rounded-md bg-slate-200">
            <div className="flex items-center justify-between border-b border-slate-400 px-4 py-2">
                <h1 className="text-lg font-semibold">AAren txata</h1>
                <Button onClick={onChatClose} variant="secondary">
                    Itxi
                </Button>
            </div>
            <div
                className="flex flex-1 flex-col gap-4 overflow-y-auto p-3"
                ref={scrollContainerRef}
            >
                {isLoading && (
                    <div className="text-center text-sm text-slate-500">
                        Mezuak kargatzen...
                    </div>
                )}
                {loadingError && (
                    <div className="text-center text-sm text-red-500">
                        {loadingError}
                    </div>
                )}
                {!isLoading && !loadingError && messages.length === 0 && (
                    <div className="text-center text-sm text-slate-500">
                        Mezu bat bidali AArekin elkarrizketan hasteko!
                    </div>
                )}
                {!isLoading &&
                    !loadingError &&
                    messages.map((message, index) => (
                        <div
                            className={conversationMessageClasses(
                                message.jabea,
                            )}
                            key={`${message.denbora_zigilua}-${index}`}
                        >
                            {message.jabea === Jabea.Erabiltzailea ? (
                                <p className="text-sm">{message.edukia}</p>
                            ) : (
                                <div className="text-base [&_pre]:overflow-x-auto">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.edukia}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    ))}
                {isSending && (
                    <div className={conversationMessageClasses(Jabea.AA)}>
                        <div className="flex gap-x-2 px-1 py-1 [&>span]:h-2 [&>span]:w-2 [&>span]:animate-pulse [&>span]:rounded-full [&>span]:bg-slate-400">
                            <span className="[animation-delay:0ms]!"></span>
                            <span className="[animation-delay:300ms]!"></span>
                            <span className="[animation-delay:600ms]!"></span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex space-x-2 border-t border-slate-400 p-4">
                <textarea
                    className="max-h-32 min-h-10 flex-1 resize-none rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    disabled={isSending || isLoading || !!loadingError}
                    maxLength={MAX_MESSAGE_LENGTH}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Galdetu zerbait..."
                    ref={textareaRef}
                    rows={1}
                    value={inputValue}
                />
                <Button
                    disabled={
                        isSending ||
                        isLoading ||
                        !!loadingError ||
                        !inputValue.trim()
                    }
                    isLoading={isSending}
                    onClick={handleSendMessage}
                    variant="primary"
                >
                    Bidali
                </Button>
            </div>
        </div>
    );
}

function conversationMessageClasses(owner: Jabea): string {
    return clsx(
        "max-w-[90%] rounded-md px-2 py-1",
        "[&_p]:break-words [&_p]:whitespace-pre-wrap",
        "[&_li]:break-words [&_li]:whitespace-pre-wrap",
        owner === Jabea.Erabiltzailea
            ? "self-end bg-slate-300"
            : "self-start bg-slate-100",
    );
}

export { Chat };
