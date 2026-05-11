import {
    type Language,
    Phase,
    type ProcessedAttempt,
    type ProcessedTest,
} from "./common/types.js";

const pythonLanguage: Language<string> = {
    id: "python",
    image: "code-execution-python:latest",
    name: "Python",
    processAttempt(attempt: string): ProcessedAttempt {
        return {
            files: [
                {
                    content: attempt,
                    name: "attempt.py",
                },
            ],
        };
    },
    processTest(test: string, fileName: string): ProcessedTest {
        const fileNameWithTestPrefix = `test_${fileName}`;
        return {
            files: [
                {
                    content: test,
                    name: fileNameWithTestPrefix,
                },
            ],
            steps: [
                {
                    args: [
                        "sh",
                        "-c",
                        "PYTHONDONTWRITEBYTECODE=1" +
                            " PYTHONPATH=/opt/code-execution/src" +
                            ` python -m pytest /opt/code-execution/tests/${fileNameWithTestPrefix} -p no:cacheprovider --tb=short`,
                    ],
                    phase: Phase.Run,
                },
            ],
        };
    },
};

export { pythonLanguage };
