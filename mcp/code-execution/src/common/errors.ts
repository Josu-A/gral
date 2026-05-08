import { RunAttemptPreResult } from "../runner.js";

class PreError extends Error {
    public readonly preRun: RunAttemptPreResult;

    constructor(preRun: RunAttemptPreResult) {
        super();
        this.preRun = preRun;
        Object.setPrototypeOf(this, PreError.prototype);
    }
}

class RunnerError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, RunnerError.prototype);
    }
}

export { PreError, RunnerError };
