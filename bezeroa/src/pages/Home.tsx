import type { JSX } from "react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";

function Home(): JSX.Element {
    return (
        <main className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
            <header className="max-w-3xl space-y-8">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
                    Kodetzen ikasi AAren laguntza pedagogikoa erabiliz
                </h1>
                <p className="text-lg leading-relaxed text-gray-600">
                    Hainbat motatako ariketak egin, arakatzailean bertan
                    exekutatu eta emaitzak ikusi. Zure aurrerapena jarraitu eta
                    ikaskuntza maila egokitu. Zalantzak arazo batekin? AAk
                    laguntza pedagogikoa eskainiko dizu eta erantzuna aurki
                    dezazun bideratuko zaitu.
                </p>
            </header>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-16">
                <Link className="w-full sm:w-auto" to="/login">
                    <Button
                        className="w-full px-10 py-5 text-lg sm:px-14 sm:py-4"
                        variant="primary"
                    >
                        Saioa hasi
                    </Button>
                </Link>
                <Link className="w-full sm:w-auto" to="/signup">
                    <Button
                        className="w-full px-10 py-5 text-lg sm:px-14 sm:py-4"
                        variant="secondary"
                    >
                        Erregistratu
                    </Button>
                </Link>
            </div>

            <footer className="mt-16 border-t border-amber-200 pt-8">
                <p className="text-xs text-gray-500">
                    Josu Aguinagak sortutako GrALa (2026)
                </p>
            </footer>
        </main>
    );
}

export default Home;
