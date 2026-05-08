const Phase = {
    Compile: "compile",
    Run: "run",
} as const;

interface Commands {
    args: Array<string>;
}

interface Language<TAttempt> {
    id: string;
    image: string;
    name: string;
    processAttempt(attempt: TAttempt): ProcessedAttempt;
    processTest(test: string, fileName: string): ProcessedTest;
}

interface ProcessedAttempt {
    files: Array<SourceFile>;
    pre?: Commands;
}

interface ProcessedTest {
    files: Array<SourceFile>;
    steps: Array<TestCommands>;
}

interface SourceFile {
    content: string;
    name: string;
}

type StepPhase = (typeof Phase)[keyof typeof Phase];

interface TestCommands extends Commands {
    phase: StepPhase;
}

export { Phase };

export type { Language, ProcessedAttempt, ProcessedTest };
