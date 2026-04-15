export function isErrno(error:  Error): error is NodeJS.ErrnoException {
    return 'code' in error;
}
