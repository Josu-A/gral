import {
    type Language,
    Phase,
    type ProcessedAttempt,
    type ProcessedTest,
} from "./common/types.js";

const javaLanguage: Language<string> = {
    id: "java",
    image: "code-execution-java:latest",
    name: "Java",
    processAttempt(attempt: string): ProcessedAttempt {
        return {
            files: [
                {
                    content: attempt,
                    name: "Solution.java",
                },
            ],
            pre: {
                args: [
                    "sh",
                    "-c",
                    `javac -d /opt/code-execution/out --class-path "$JUNIT_JAR" /opt/code-execution/src/*.java /opt/code-execution/tests/*.java`,
                ],
            },
        };
    },
    processTest(test: string, fileName: string): ProcessedTest {
        return {
            files: [
                {
                    content: test,
                    name: fileName,
                },
            ],
            steps: [
                {
                    args: [
                        "sh",
                        "-c",
                        `java -jar "$JUNIT_JAR" execute --class-path /opt/code-execution/out --select-class=${fileName.replace(".java", "")}`,
                    ],
                    phase: Phase.Run,
                },
            ],
        };
    },
};

export { javaLanguage };
