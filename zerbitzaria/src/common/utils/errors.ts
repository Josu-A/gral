class RequestError extends Error {
    public readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

function isErrno(error:  Error): error is NodeJS.ErrnoException {
    return 'code' in error;
}

export {
    isErrno,
    RequestError
};
