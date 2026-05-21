import clsx from "clsx";
import { type JSX, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useSearchParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import type { Egoera, Zailtasuna } from "@/common/types/entities";

import apiClient from "@/common/apiClient";
import { handleApiError } from "@/common/errorHelper";
import { Button } from "@/components/ui/Button";
import GralMonacoEditor from "@/components/ui/MonacoEditor";
import { Select } from "@/components/ui/Select";
import { Chat } from "@/components/workspace/Chat";
import { useDebounce } from "@/hooks/useDebounce";

interface ExerciseDetails {
    ariketa_zehatza?: SpecificExercise;
    ariketa_zehatzak: Array<SpecificExercise>;
    enuntziatua: string;
    etiketaIzenak: string[];
    izenburua: string;
    supportedProgrammingLanguages: {
        bertsioa: string;
        izena: string;
        programazio_lengoaia_id: number;
    }[];
    zailtasun_maila: Zailtasuna;
}

interface GetAttemptResponse {
    data?: {
        saiakera_kodea: null | string;
    };
    error?: string;
    success: boolean;
}

interface GetAttemptsResponse {
    data?: Array<IAttempt>;
    error?: string;
    success: boolean;
}

interface GetExerciseResponse {
    data?: {
        ariketa: {
            ariketa_zehatzak: Array<SpecificExercise>;
            enuntziatua: string;
            etiketak: Array<{
                etiketa: {
                    izena: string;
                };
            }>;
            izenburua: string;
            zailtasun_maila: Zailtasuna;
        };
        ariketa_zehatza: null | SpecificExercise;
        ikasle_kodea: null | string;
    };
    error?: string;
    success: boolean;
}

interface GetSpecificExerciseResponse {
    data?: {
        ebazpena: null | {
            ebazpena_id: number;
            egoera: Egoera;
            kodea: null | string;
        };
        hasierako_kodea: string;
    };
    error?: string;
    success: boolean;
}

interface IAttempt {
    denbora_zigilua: string;
    nota: number;
    saiakera_id: number;
}

interface SpecificExercise {
    ariketa_zehatza_id: number;
    ebazpenak: Array<{
        ebazpena_id: number;
    }>;
    hasierako_kodea: string;
    programazio_lengoaia: {
        bertsioa: string;
        izena: string;
        programazio_lengoaia_id: number;
    };
    programazio_lengoaia_id: number;
}

type StatementTab = "attempts" | "statement" | "testresults";

interface SubmitAttemptResponse {
    data?: {
        attempt: IAttempt | null;
        isError: boolean;
        output: null | SubmittedTestResults;
    };
    error?: string;
    success: boolean;
}

interface SubmittedTestResults {
    duration: number;
    error: null | string;
    preRun: null | {
        duration: number;
        exitCode: null | number;
        stderr: string;
        stdout: string;
        success: boolean;
    };
    testResults?: {
        duration: number;
        exitCode: null | number;
        name: string;
        order: number;
        phase: null | string;
        status: string;
        stderr: string;
        stdout: string;
        testId: number;
        weight: number;
    }[];
}

const ERROR_GENERIC_FETCH = "Akats bat gertatu da ariketa eskuratzean";
const ERROR_GENERIC_ATTEMPT_FETCH = "Akats bat gertatu da saiakera eskuratzean";
const ERROR_GENERIC_ATTEMPTS_FETCH =
    "Akats bat gertatu da saiakerak eskuratzean";
const ERROR_GENERIC_SUBMIT = "Akats bat gertatu da saiakera bidaltzean";

function supportedLanguageToMonaco(language: string): string {
    const mapping: Record<string, string> = {
        C: "c",
        Java: "java",
        Python: "python",
    };
    return mapping[language] ?? "plaintext";
}

function viewingAttemptClasses(isViewing: boolean, score: number): string {
    return clsx(
        "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-slate-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
        isViewing && "border-2 border-amber-500",
        score >= 5 && "bg-emerald-200 text-green-900",
        score < 5 && "bg-rose-200 text-red-900",
    );
}

function Workspace(): JSX.Element {
    const { ariketaId } = useParams<{ ariketaId: string }>();
    const [searchParams] = useSearchParams();
    const saiakeraParamId = searchParams.get("attempt");
    const ariketaIdNumber = Number(ariketaId);
    const [code, setCode] = useState<string>("");
    const [editingCode, setEditingCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);
    const [exerciseDetails, setExerciseDetails] =
        useState<ExerciseDetails | null>(null);
    const debouncedCode = useDebounce(editingCode, 500);
    const hasUnsavedChanges = useRef<boolean>(false);
    const [activeTab, setActiveTab] = useState<StatementTab>("statement");
    const [attempts, setAttempts] = useState<IAttempt[]>([]);
    const [isAttemptsLoading, setIsAttemptsLoading] = useState<boolean>(false);
    const [attemptsError, setAttemptsError] = useState<null | string>(null);
    const isViewingPreviousAttemptRef = useRef<boolean>(false);
    const [isViewingPreviousAttempt, setIsViewingPreviousAttempt] =
        useState<boolean>(false);
    const [viewedAttemptId, setViewedAttemptId] = useState<null | number>(null);
    const [selectedLanguageId, setSelectedLanguageId] = useState<string>("");
    const [isSwitchingLanguage, setIsSwitchingLanguage] =
        useState<boolean>(false);
    const isSwitchingLanguageRef = useRef<boolean>(false);
    const userRequestedLanguageChangeRef = useRef<boolean>(false);
    const languageChangeTokenRef = useRef<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [attemptTestResults, setAttemptTestResults] =
        useState<null | SubmittedTestResults>(null);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const ebazpenaId =
        exerciseDetails?.ariketa_zehatza?.ebazpenak[0]?.ebazpena_id;

    useEffect(() => {
        const controller = new AbortController();
        const loadExercise = async () => {
            setIsLoading(true);
            try {
                const exerRes = await apiClient.get<GetExerciseResponse>(
                    `/exercises/${ariketaIdNumber}`,
                    { signal: controller.signal },
                );

                if (!exerRes.data.success || !exerRes.data.data) {
                    setError(exerRes.data.error || ERROR_GENERIC_FETCH);
                } else {
                    const exerData = exerRes.data.data;
                    const ariketaZehatzak = exerData.ariketa.ariketa_zehatzak;
                    const initialZehatza =
                        exerData.ariketa_zehatza ?? ariketaZehatzak[0];
                    setExerciseDetails({
                        ariketa_zehatza: initialZehatza ?? undefined,
                        ariketa_zehatzak: ariketaZehatzak,
                        enuntziatua: exerData.ariketa.enuntziatua,
                        etiketaIzenak: exerData.ariketa.etiketak.map(
                            (e) => e.etiketa.izena,
                        ),
                        izenburua: exerData.ariketa.izenburua,
                        supportedProgrammingLanguages: ariketaZehatzak.map(
                            (az) => az.programazio_lengoaia,
                        ),
                        zailtasun_maila: exerData.ariketa.zailtasun_maila,
                    });

                    let initialCode =
                        exerData.ikasle_kodea ||
                        initialZehatza?.hasierako_kodea ||
                        "";

                    if (initialZehatza) {
                        setSelectedLanguageId(
                            String(initialZehatza.programazio_lengoaia_id),
                        );
                    }

                    if (saiakeraParamId) {
                        const attRes = await apiClient.get<GetAttemptResponse>(
                            `/attempts/${saiakeraParamId}`,
                            { signal: controller.signal },
                        );

                        if (!attRes.data.success || !attRes.data.data) {
                            setError(attRes.data.error || ERROR_GENERIC_FETCH);
                        } else {
                            const attData = attRes.data.data;
                            initialCode = attData.saiakera_kodea ?? initialCode;
                        }
                    }

                    setCode(initialCode);
                    setEditingCode(initialCode);
                }
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                setError(handleApiError(err, ERROR_GENERIC_FETCH).general);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadExercise();

        return () => controller.abort();
    }, [ariketaIdNumber, saiakeraParamId]);

    useEffect(() => {
        const ariketaZehatza = exerciseDetails?.ariketa_zehatza;
        if (
            !hasUnsavedChanges.current ||
            !ariketaZehatza ||
            isViewingPreviousAttempt ||
            isSwitchingLanguageRef.current
        ) {
            return;
        }

        const controller = new AbortController();
        const saveAttempt = async (): Promise<void> => {
            try {
                await apiClient.post(
                    "/attempts/save",
                    {
                        ariketa_zehatza_id: ariketaZehatza.ariketa_zehatza_id,
                        kodea: debouncedCode,
                    },
                    { signal: controller.signal },
                );
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                const saveError = handleApiError(
                    err,
                    "Akats bat gertatu da kodea gordetzean",
                );
                toast.warning(saveError.general);
            } finally {
                hasUnsavedChanges.current = false;
            }
        };

        saveAttempt();

        return () => controller.abort();
    }, [
        ariketaIdNumber,
        debouncedCode,
        exerciseDetails,
        isViewingPreviousAttempt,
    ]);

    useEffect(() => {
        if (activeTab !== "attempts" || attempts.length > 0) {
            return;
        }
        const controller = new AbortController();
        const loadAttempts = async (): Promise<void> => {
            setIsAttemptsLoading(true);
            setAttemptsError(null);
            try {
                const res = await apiClient.get<GetAttemptsResponse>(
                    "/attempts",
                    {
                        params: { ariketa_id: ariketaIdNumber },
                        signal: controller.signal,
                    },
                );

                if (!res.data.success || !res.data.data) {
                    setAttemptsError(
                        res.data.error || ERROR_GENERIC_ATTEMPTS_FETCH,
                    );
                    return;
                }

                setAttempts(res.data.data);
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                setAttemptsError(
                    handleApiError(err, ERROR_GENERIC_ATTEMPTS_FETCH).general,
                );
            } finally {
                setIsAttemptsLoading(false);
            }
        };

        loadAttempts();

        return () => controller.abort();
    }, [activeTab, ariketaIdNumber, attempts.length]);

    const viewPreviousAttempt = async (saiakeraId: number): Promise<void> => {
        try {
            const attRes = await apiClient.get<GetAttemptResponse>(
                `/attempts/${saiakeraId}`,
            );

            if (!attRes.data.success || !attRes.data.data) {
                toast.warning(attRes.data.error || ERROR_GENERIC_ATTEMPT_FETCH);
            } else {
                const attData = attRes.data.data;
                setIsViewingPreviousAttempt(true);
                isViewingPreviousAttemptRef.current = true;
                setViewedAttemptId(saiakeraId);
                setCode(attData.saiakera_kodea ?? "");
            }
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                (err.name === "CanceledError" || err.name === "AbortError")
            ) {
                return;
            }
            toast.warning(
                handleApiError(err, ERROR_GENERIC_ATTEMPTS_FETCH).general,
            );
        }
    };

    const returnToEditing = (): void => {
        setIsViewingPreviousAttempt(false);
        isViewingPreviousAttemptRef.current = false;
        setViewedAttemptId(null);
        setCode(editingCode);
    };

    const handleProgrammingLanguageChange = async (
        value: string,
    ): Promise<void> => {
        if (!exerciseDetails) {
            return;
        }

        const selectedZehatza = exerciseDetails.ariketa_zehatzak.find(
            (az) => az.programazio_lengoaia_id === Number(value),
        );

        if (
            !selectedZehatza ||
            selectedZehatza.programazio_lengoaia_id ===
                exerciseDetails.ariketa_zehatza?.programazio_lengoaia_id
        ) {
            return;
        }

        userRequestedLanguageChangeRef.current = true;
        isSwitchingLanguageRef.current = true;
        hasUnsavedChanges.current = false;
        languageChangeTokenRef.current += 1;
        const changeToken = languageChangeTokenRef.current;

        setSelectedLanguageId(value);
        setExerciseDetails((currentExerciseDetails) => {
            if (!currentExerciseDetails) {
                return currentExerciseDetails;
            }

            return {
                ...currentExerciseDetails,
                ariketa_zehatza: selectedZehatza,
            };
        });

        setIsSwitchingLanguage(true);

        try {
            const res = await apiClient.get<GetSpecificExerciseResponse>(
                `/exercises/${ariketaIdNumber}/language`,
                {
                    params: {
                        programazio_lengoaia_id:
                            selectedZehatza.programazio_lengoaia_id,
                    },
                },
            );

            if (!res.data.success || !res.data.data) {
                toast.warning(res.data.error || ERROR_GENERIC_FETCH);
                return;
            }

            if (changeToken !== languageChangeTokenRef.current) {
                return;
            }

            const exerData = res.data.data;

            const newCode =
                exerData.ebazpena?.kodea ||
                selectedZehatza.hasierako_kodea ||
                "";
            setCode(newCode);
            setEditingCode(newCode);
            setExerciseDetails((currentExerciseDetails) => {
                if (
                    !currentExerciseDetails?.ariketa_zehatza ||
                    !exerData.ebazpena ||
                    currentExerciseDetails.ariketa_zehatza.ebazpenak.length > 0
                ) {
                    return currentExerciseDetails;
                }

                const newEbazpenaId = exerData.ebazpena.ebazpena_id;

                return {
                    ...currentExerciseDetails,
                    ariketa_zehatza: {
                        ...currentExerciseDetails.ariketa_zehatza,
                        ebazpenak: [
                            {
                                ebazpena_id: newEbazpenaId,
                            },
                        ],
                    },
                    ariketa_zehatzak:
                        currentExerciseDetails.ariketa_zehatzak.map((az) => {
                            if (
                                az.programazio_lengoaia_id ===
                                selectedZehatza.programazio_lengoaia_id
                            ) {
                                return {
                                    ...az,
                                    ebazpenak: [
                                        {
                                            ebazpena_id: newEbazpenaId,
                                        },
                                    ],
                                };
                            }
                            return az;
                        }),
                };
            });
            hasUnsavedChanges.current = false;
        } catch (err: unknown) {
            if (changeToken !== languageChangeTokenRef.current) {
                return;
            }
            if (
                err instanceof Error &&
                (err.name === "CanceledError" || err.name === "AbortError")
            ) {
                return;
            }

            toast.warning(handleApiError(err, ERROR_GENERIC_FETCH).general);
        } finally {
            if (changeToken === languageChangeTokenRef.current) {
                isSwitchingLanguageRef.current = false;
                setIsSwitchingLanguage(false);
            }
        }
    };

    const handleSubmitAttempt = async (): Promise<void> => {
        const ariketaZehatza = exerciseDetails?.ariketa_zehatza;
        if (!ariketaZehatza || isSubmitting) {
            return;
        }

        if (!editingCode.trim()) {
            toast.warning("Kodea ezin da hutsik egon");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await apiClient.post<SubmitAttemptResponse>(
                `/attempts/solution`,
                {
                    ariketa_zehatza_id: ariketaZehatza.ariketa_zehatza_id,
                    kodea: editingCode,
                },
            );

            if (!res.data.success || !res.data.data) {
                toast.warning(res.data.error || ERROR_GENERIC_SUBMIT);
                return;
            }

            const { attempt, isError, output } = res.data.data;

            if (isError) {
                toast.error("Saiakera bidaltzean errore bat gertatu da!");
            }

            setAttemptTestResults(output);
            setActiveTab("testresults");
            if (attempts.length > 0 && attempt) {
                setAttempts((prev) => [attempt, ...prev]);
            }
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                (err.name === "CanceledError" || err.name === "AbortError")
            ) {
                return;
            }

            toast.warning(handleApiError(err, ERROR_GENERIC_SUBMIT).general);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isSwitchingLanguage && userRequestedLanguageChangeRef.current) {
            userRequestedLanguageChangeRef.current = false;
        }
    }, [code, isSwitchingLanguage]);

    if (isLoading) {
        return <div>Ariketa kargatzen...</div>;
    }

    if (!exerciseDetails) {
        return <div>Errorea: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-4 px-6 py-8 sm:h-full sm:min-h-0 sm:flex-row">
            <section
                className={clsx(
                    "w-full sm:flex sm:min-h-0 sm:min-w-0 sm:flex-col",
                    isChatOpen ? "sm:w-1/3" : "sm:w-1/2",
                )}
            >
                <div className="flex w-full gap-2 overflow-x-auto [&_button]:flex-1">
                    {(
                        [
                            { id: "statement", label: "Enuntziatua" },
                            { id: "testresults", label: "Testen emaitzak" },
                            { id: "attempts", label: "Saiakerak" },
                        ] as const
                    ).map(({ id, label }) => (
                        <Button
                            className="rounded-b-none"
                            isLoading={false}
                            key={id}
                            onClick={() => setActiveTab(id)}
                            variant={
                                activeTab === id ? "activeTab" : "inactiveTab"
                            }
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-col rounded-tl-none rounded-b-md bg-slate-200 p-3 sm:min-h-0 sm:flex-1">
                    {activeTab === "statement" && (
                        <>
                            <h1 className="mb-3 border-b border-slate-400 pb-1 text-2xl font-bold tracking-tight">
                                {exerciseDetails.izenburua}
                            </h1>
                            <div className="[&_pre]:tab-4 mb-4 max-w-none sm:min-h-0 sm:flex-1 sm:overflow-y-auto [&_pre]:overflow-x-auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {exerciseDetails.enuntziatua}
                                </ReactMarkdown>
                            </div>
                            <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-slate-400 pt-1">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        Etiketak:
                                    </span>{" "}
                                    {exerciseDetails.etiketaIzenak.join(", ")}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        Zailtasun maila:
                                    </span>{" "}
                                    {exerciseDetails.zailtasun_maila}
                                </p>
                            </div>
                        </>
                    )}
                    {activeTab === "testresults" && (
                        <div className="sm:min-h-0 sm:flex-1 sm:overflow-y-auto">
                            {!attemptTestResults ? (
                                <p className="text-sm text-gray-700">
                                    Ez dago test emaitzarik erakusteko.
                                </p>
                            ) : (
                                <>
                                    <h1 className="mb-3 border-b border-slate-400 pb-1 text-2xl font-bold tracking-tight">
                                        Exekuzioaren testen emaitzak
                                    </h1>
                                    <div className="mb-4 max-w-none sm:min-h-0 sm:flex-1 sm:overflow-y-auto">
                                        {attemptTestResults.error && (
                                            <p className="text-sm text-red-700">
                                                <span className="font-medium text-red-800">
                                                    Errorea gertatu da
                                                    exekuzioan:
                                                </span>{" "}
                                                {attemptTestResults.error}
                                            </p>
                                        )}
                                        <p>
                                            Exekuzioaren iraupena:{" "}
                                            {attemptTestResults.duration} ms
                                        </p>
                                        {attemptTestResults.preRun && (
                                            <>
                                                <h2 className="mt-4 mb-2 text-xl font-semibold">
                                                    Exekuzio aurreko fasea (
                                                    {
                                                        attemptTestResults
                                                            .preRun.duration
                                                    }{" "}
                                                    ms)
                                                </h2>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">
                                                        Arrakasta:{" "}
                                                        {attemptTestResults
                                                            .preRun.success
                                                            ? "Bai"
                                                            : "Ez"}
                                                    </span>
                                                    <span>
                                                        Irteera kodea:{" "}
                                                        {
                                                            attemptTestResults
                                                                .preRun.exitCode
                                                        }
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="mt-2 mb-1 font-medium">
                                                        Stdout:
                                                    </h3>
                                                    <pre className="rounded bg-gray-100 p-2 text-sm whitespace-pre-wrap text-gray-800">
                                                        {attemptTestResults
                                                            .preRun.stdout ||
                                                            "Ezer ez"}
                                                    </pre>
                                                </div>
                                                <div>
                                                    <h3 className="mt-2 mb-1 font-medium">
                                                        Stderr:
                                                    </h3>
                                                    <pre className="rounded bg-gray-100 p-2 text-sm whitespace-pre-wrap text-gray-800">
                                                        {attemptTestResults
                                                            .preRun.stderr ||
                                                            "Ezer ez"}
                                                    </pre>
                                                </div>
                                            </>
                                        )}
                                        {attemptTestResults.testResults &&
                                            attemptTestResults.testResults
                                                .length > 0 && (
                                                <>
                                                    <h2 className="mt-4 mb-2 text-xl font-semibold">
                                                        Testen emaitzak:{" "}
                                                        {
                                                            attemptTestResults.testResults.filter(
                                                                (t) =>
                                                                    t.status ===
                                                                    "passed",
                                                            ).length
                                                        }{" "}
                                                        /{" "}
                                                        {
                                                            attemptTestResults
                                                                .testResults
                                                                .length
                                                        }
                                                    </h2>
                                                    <ul className="flex flex-col gap-4">
                                                        {attemptTestResults.testResults.map(
                                                            (test) => (
                                                                <li
                                                                    className="rounded-md border bg-slate-300 p-3"
                                                                    key={
                                                                        test.testId
                                                                    }
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-semibold">
                                                                            {
                                                                                test.name
                                                                            }{" "}
                                                                            (
                                                                            {
                                                                                test.duration
                                                                            }{" "}
                                                                            ms)
                                                                        </span>
                                                                        {test.phase && (
                                                                            <span>
                                                                                Fasea:{" "}
                                                                                {
                                                                                    test.phase
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span>
                                                                            Egoera:{" "}
                                                                            {
                                                                                test.status
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            Irteera
                                                                            kodea:{" "}
                                                                            {
                                                                                test.exitCode
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="mt-2 mb-1 font-medium">
                                                                            Stdout:
                                                                        </h3>
                                                                        <pre className="rounded bg-slate-200 p-2 text-sm whitespace-pre-wrap text-gray-800">
                                                                            {test.stdout ||
                                                                                "Ezer ez"}
                                                                        </pre>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="mt-2 mb-1 font-medium">
                                                                            Stderr:
                                                                        </h3>
                                                                        <pre className="rounded bg-slate-200 p-2 text-sm whitespace-pre-wrap text-gray-800">
                                                                            {test.stderr ||
                                                                                "Ezer ez"}
                                                                        </pre>
                                                                    </div>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </>
                                            )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {activeTab === "attempts" && (
                        <div className="sm:min-h-0 sm:flex-1 sm:overflow-y-auto">
                            {isAttemptsLoading && (
                                <p className="text-sm text-gray-700">
                                    Saiakerak kargatzen...
                                </p>
                            )}
                            {!isAttemptsLoading && attemptsError && (
                                <p className="text-sm text-red-700">
                                    {attemptsError}
                                </p>
                            )}
                            {!isAttemptsLoading &&
                                !attemptsError &&
                                attempts.length === 0 && (
                                    <p className="text-sm text-gray-700">
                                        Ez dago saiakerarik eginda.
                                    </p>
                                )}
                            {!isAttemptsLoading &&
                                !attemptsError &&
                                attempts.length > 0 && (
                                    <ul className="flex flex-col gap-2">
                                        {attempts.map((attempt) => (
                                            <li key={attempt.saiakera_id}>
                                                <button
                                                    className={viewingAttemptClasses(
                                                        viewedAttemptId ===
                                                            attempt.saiakera_id,
                                                        attempt.nota,
                                                    )}
                                                    onClick={() =>
                                                        viewPreviousAttempt(
                                                            attempt.saiakera_id,
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    <span className="text-sm">
                                                        {new Date(
                                                            attempt.denbora_zigilua,
                                                        ).toLocaleString()}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {attempt.nota.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </div>
                    )}
                </div>
            </section>
            <section
                className={clsx(
                    "w-full sm:flex sm:min-h-0 sm:min-w-0 sm:flex-col",
                    isChatOpen ? "sm:w-1/3" : "sm:w-1/2",
                )}
            >
                {isViewingPreviousAttempt && (
                    <div className="mb-2 flex items-center justify-center gap-4 rounded-md border border-amber-300 bg-amber-200 px-2 py-1">
                        <span className="text-sm text-gray-700">
                            Saiakera zahar bat ikusten ari zara (ezin da
                            editatu)
                        </span>
                        <Button
                            isLoading={false}
                            onClick={returnToEditing}
                            variant="secondary"
                        >
                            Itzuli editatzera
                        </Button>
                    </div>
                )}
                {!isViewingPreviousAttempt && (
                    <div className="mb-2 flex items-center justify-between gap-4 rounded-md border border-slate-300 bg-slate-200 px-2 py-1">
                        <Select
                            className="mt-0! px-4!"
                            disabled={
                                isLoading || isSwitchingLanguage || isSubmitting
                            }
                            onChange={(value) =>
                                handleProgrammingLanguageChange(value)
                            }
                            options={exerciseDetails.supportedProgrammingLanguages.map(
                                (lang) => ({
                                    label: `${lang.izena} ${lang.bertsioa}`,
                                    value: String(lang.programazio_lengoaia_id),
                                }),
                            )}
                            value={selectedLanguageId}
                        />
                        {!isChatOpen && (
                            <Button
                                disabled={!ebazpenaId}
                                isLoading={false}
                                onClick={() => setIsChatOpen((prev) => !prev)}
                                variant="secondary"
                            >
                                Ireki AA
                            </Button>
                        )}
                        <Button
                            disabled={
                                isLoading ||
                                isSwitchingLanguage ||
                                isSubmitting ||
                                !editingCode.trim()
                            }
                            isLoading={isSubmitting}
                            onClick={handleSubmitAttempt}
                            variant="primary"
                        >
                            Bidali
                        </Button>
                    </div>
                )}
                <GralMonacoEditor
                    language={supportedLanguageToMonaco(
                        exerciseDetails.supportedProgrammingLanguages.find(
                            (pL) =>
                                pL.programazio_lengoaia_id ===
                                exerciseDetails.ariketa_zehatza
                                    ?.programazio_lengoaia_id,
                        )?.izena ?? "",
                    )}
                    onChange={(value) => {
                        if (
                            !isViewingPreviousAttemptRef.current &&
                            !userRequestedLanguageChangeRef.current &&
                            !isSwitchingLanguage
                        ) {
                            const updatedValue = value ?? "";
                            hasUnsavedChanges.current = true;
                            setCode(updatedValue);
                            setEditingCode(updatedValue);
                        }
                    }}
                    options={{
                        readOnly:
                            isViewingPreviousAttempt || isSwitchingLanguage,
                    }}
                    value={code}
                />
            </section>
            {isChatOpen && ebazpenaId !== undefined && (
                <section className="fixed inset-x-8 top-12 bottom-8 z-5 sm:static sm:inset-auto sm:flex sm:min-h-0 sm:w-1/3 sm:min-w-0 sm:flex-col">
                    <div
                        className="fixed inset-0 z-4 bg-black/60 sm:hidden"
                        onClick={() => setIsChatOpen(false)}
                    />
                    <div className="relative z-5 h-full shadow-lg shadow-slate-800/70 sm:shadow-none">
                        <Chat
                            ebazpenaId={ebazpenaId}
                            onChatClose={() => setIsChatOpen(false)}
                        />
                    </div>
                </section>
            )}
        </div>
    );
}

export default Workspace;
