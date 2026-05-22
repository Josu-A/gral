import { IkasketaMaila, Zailtasuna } from "@gral/datu-basea/browser";
import clsx from "clsx";
import { type JSX, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import apiClient from "@/common/apiClient";
import { handleApiError } from "@/common/errorHelper";
import { Button } from "@/components/ui/Button";

interface GetDashboardResponse {
    data?: {
        averageGrade: number;
        educationLevel: IkasketaMaila;
        lastAttempts: LastAttempts;
        maxGrade: number;
        solvedSolutions: SolvedSolutions;
        totalSolvedSolutions: number;
    };
    error?: string;
    success: boolean;
}

type LastAttempts = Array<{
    ariketa_id: number;
    denbora_zigilua: Date;
    izenburua: string;
    nota: number;
    programazio_lengoaia_izena: string;
    saiakera_id: number;
}>;

type SolvedSolutions = Record<Lowercase<Zailtasuna>, number>;

const MAX_ATTEMPTS_PER_PAGE = 5;
const ERROR_GENERIC_FETCH = "Ezin izan da aurrerapen daturik jaso.";

function Dashboard(): JSX.Element {
    const [currentPage, setCurrentPage] = useState(1);
    const [dashboardData, setDashboardData] =
        useState<GetDashboardResponse["data"]>();
    const [isLoading, setIsLoading] = useState(false);
    const totalPages = useMemo(() => {
        const attemptsCount = dashboardData?.lastAttempts.length || 0;
        return Math.max(1, Math.ceil(attemptsCount / MAX_ATTEMPTS_PER_PAGE));
    }, [dashboardData]);

    useEffect(() => {
        const controller = new AbortController();
        const loadDashboardData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const res = await apiClient.get<GetDashboardResponse>(
                    "/dashboard",
                    {
                        params: {
                            attempts_to_fetch: 40,
                        },
                        signal: controller.signal,
                    },
                );

                if (!res.data.success) {
                    toast.error(
                        res.data.error ||
                            "Ezin izan da dashboard-aren daturik jaso.",
                    );
                    return;
                }

                setDashboardData(res.data.data);
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                toast.error(handleApiError(err, ERROR_GENERIC_FETCH).general);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboardData();

        return () => controller.abort();
    }, []);

    const paginatedAttempts = useMemo(() => {
        const startIndex = (currentPage - 1) * MAX_ATTEMPTS_PER_PAGE;
        return (
            dashboardData?.lastAttempts.slice(
                startIndex,
                startIndex + MAX_ATTEMPTS_PER_PAGE,
            ) ?? []
        );
    }, [currentPage, dashboardData]);

    if (isLoading) {
        return (
            <div className="mx-auto h-full max-w-7xl">
                <div className="mx-6 px-6 py-8 sm:mx-12">
                    <p className="text-center text-gray-500">
                        Aurrerapena kargatzen...
                    </p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="mx-auto h-full max-w-7xl">
                <div className="mx-6 px-6 py-8 sm:mx-12">
                    <p className="text-center text-gray-500">
                        Ezin izan da aurrerapen daturik jaso.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto h-full max-w-7xl">
            <div className="mx-6 px-6 py-8 sm:mx-12">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1fr_0.8fr_1.5fr] [&_section]:rounded-md [&_section]:border [&_section]:border-slate-300 [&_section]:bg-slate-100 [&_section]:p-6 [&_section]:shadow-sm">
                    <section className="sm:h-auto lg:h-max">
                        <div className="mb-2 border-b border-slate-300 pb-2">
                            <div className="flex items-center justify-between gap-5">
                                <h2 className="text-lg font-medium">
                                    Ebazpen kopuruak
                                </h2>
                                <p className="text-lg font-bold text-amber-500">
                                    {dashboardData.totalSolvedSolutions}
                                </p>
                            </div>
                            <p className="pt-1 text-sm text-gray-500">
                                Ondo egindako ariketa ezberdinak
                            </p>
                        </div>
                        {[
                            {
                                label: Zailtasuna.Erraza,
                                value: dashboardData.solvedSolutions.erraza,
                            },
                            {
                                label: Zailtasuna.Ertaina,
                                value: dashboardData.solvedSolutions.ertaina,
                            },
                            {
                                label: Zailtasuna.Zaila,
                                value: dashboardData.solvedSolutions.zaila,
                            },
                        ].map((row) => (
                            <div
                                className="flex items-center justify-between rounded-md px-2 py-1"
                                key={row.label}
                            >
                                <span className="text-sm text-gray-700">
                                    {" "}
                                    {row.label}
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </section>
                    <div className="flex flex-col gap-5">
                        <section>
                            <h2 className="mb-2 text-lg font-medium">Maila</h2>
                            <p className="text-lg font-bold text-gray-900">
                                {dashboardData.educationLevel}
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-2 text-lg font-medium">
                                Batez besteko nota
                            </h2>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboardData.averageGrade.toFixed(2)} /{" "}
                                {dashboardData.maxGrade}
                            </p>
                        </section>
                    </div>
                    <section className="md:col-span-2 lg:col-span-1">
                        <div className="mb-2">
                            <h2 className="text-lg font-medium">
                                Egindako saiakerak
                            </h2>
                            <p className="pt-1 text-sm text-gray-500">
                                Azken saiakerak eta haien notak
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse text-sm sm:text-base [&_td>a]:inline-block [&_td>a]:w-full [&_td>a]:px-4 [&_td>a]:py-2 [&_th]:px-4 [&_th]:py-2 sm:[&_th]:whitespace-nowrap">
                                <colgroup>
                                    <col />
                                    <col className="w-1" />
                                    <col className="w-1" />
                                    <col className="w-1" />
                                </colgroup>
                                <thead className="mb-1">
                                    <tr className="border-b-2 border-slate-300 [&>th]:text-left">
                                        <th>Ariketa</th>
                                        <th>Nota</th>
                                        <th>Lengoaia</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAttempts.map((attempt, index) => (
                                        <tr
                                            className={clsx(
                                                index % 2 === 1 &&
                                                    "[&>td]:bg-slate-200 [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl",
                                            )}
                                            key={attempt.saiakera_id}
                                        >
                                            <td>
                                                <Link
                                                    to={`/workspace/${attempt.ariketa_id}?attempt=${attempt.saiakera_id}`}
                                                >
                                                    {attempt.izenburua}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/workspace/${attempt.ariketa_id}?attempt=${attempt.saiakera_id}`}
                                                >
                                                    {attempt.nota.toFixed(2)}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/workspace/${attempt.ariketa_id}?attempt=${attempt.saiakera_id}`}
                                                >
                                                    {
                                                        attempt.programazio_lengoaia_izena
                                                    }
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/workspace/${attempt.ariketa_id}?attempt=${attempt.saiakera_id}`}
                                                >
                                                    {new Date(
                                                        attempt.denbora_zigilua,
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            month: "2-digit",
                                                            year: "2-digit",
                                                        },
                                                    )}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-4">
                            <Button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1),
                                    )
                                }
                                variant="secondary"
                            >
                                &lt;
                            </Button>
                            <span className="text-sm text-gray-700">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1),
                                    )
                                }
                                variant="secondary"
                            >
                                &gt;
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
