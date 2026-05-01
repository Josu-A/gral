import type { JSX } from "react";

import { Link } from "react-router-dom";

import type { Egoera, Zailtasuna } from "@/common/types/entities";

interface ExerciseRow {
    ariketa_id: number;
    egoera: Egoera;
    izenburua: string;
    zailtasun_maila: Zailtasuna;
}

interface ExercisesTableProps {
    exercises: ExerciseRow[];
    isLoading: boolean;
}

function ExercisesTable({
    exercises,
    isLoading,
}: ExercisesTableProps): JSX.Element {
    if (isLoading) {
        return <p>Kargatzen...</p>;
    }
    if (exercises.length === 0) {
        return <p>Ez dago ariketarik</p>;
    }
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse text-sm sm:text-base sm:[&_td]:whitespace-nowrap [&_td>a]:inline-block [&_td>a]:w-full [&_td>a]:px-4 [&_td>a]:py-2 [&_th]:px-4 [&_th]:py-2 sm:[&_th]:whitespace-nowrap">
                <colgroup>
                    <col />
                    <col className="w-1" />
                    <col className="w-1" />
                </colgroup>
                <thead>
                    <tr className="border-b-2 border-slate-300 [&>th]:text-left">
                        <th>Izenburua</th>
                        <th>Zailtasun maila</th>
                        <th>Egoera</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr
                            className="rounded-2xl hover:bg-slate-200"
                            key={exercise.ariketa_id}
                        >
                            <td>
                                <Link to={`/exercise/${exercise.ariketa_id}`}>
                                    {exercise.izenburua}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/exercise/${exercise.ariketa_id}`}>
                                    {exercise.zailtasun_maila}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/exercise/${exercise.ariketa_id}`}>
                                    {exercise.egoera}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { ExercisesTable };
export type { ExerciseRow };
