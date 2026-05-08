import { z } from "zod";

const RESERVED_FILENAMES = ["Solution.java"];

const testInputSchema = z
    .object({
        code: z
            .string()
            .min(1, "Test case source code is required")
            .meta({ description: "Test case source code." }),
        fileName: z
            .string()
            .min(1, "Test case file name is required")
            .refine((val) => !RESERVED_FILENAMES.includes(val), {
                message: "Filename is reserved.",
            })
            .meta({
                description: "Name of the file containing the test case code.",
            }),
        name: z
            .string()
            .min(1, "Test case name is required")
            .meta({ description: "Name of the test case." }),
        order: z
            .number()
            .int("Order must be an integer")
            .positive("Order must be a positive integer")
            .meta({
                description:
                    "Execution order of the test case relative to other test cases.",
            }),
        timeout: z
            .number()
            .int("Timeout must be an integer")
            .positive("Timeout must be a positive integer")
            .min(100, "Timeout must be at least 100 milliseconds")
            .max(60_000, "Timeout must be at most 60 seconds")
            .meta({
                description: "Timeout for the test case in milliseconds.",
            }),
        weight: z
            .number()
            .positive("Weight must be a positive number")
            .meta({
                description: "Weight of the test case for scoring purposes.",
            }),
    })
    .meta({
        description:
            "Object representing a single test case to run against the student's attempt.",
    });

type TestCase = z.infer<typeof testInputSchema>;

const testCasesInputSchema = z
    .array(testInputSchema)
    .min(1, "At least one test case is required")
    .meta({
        description:
            "Array of test case code snippets to run against the student's attempt.",
    });

const attemptInputSchema = z
    .string()
    .min(1, "Attempt code is required")
    .meta({ description: "Source code for the student's attempt." });

const cAttemptInputSchema = z
    .object({
        header: z
            .string()
            .optional()
            .meta({
                description:
                    "Optional header code to include if the test cases don't declare prototypes themselves.",
            }),
        source: attemptInputSchema,
    })
    .meta({
        description:
            "Student's code attempt for the C language, including optional header code.",
    });

export {
    attemptInputSchema,
    cAttemptInputSchema,
    testCasesInputSchema,
    testInputSchema,
};

export type { TestCase };
