import { ErrorDetail } from "./ErrorDetail";

interface BadRequestError extends Error {
    errors: ErrorDetail[];
    formatErrorsIntoReadableStr: () => string;
}

export const createBadRequestError = (errors: ErrorDetail[]): BadRequestError => {
    const errorObj: BadRequestError = Object.assign(new Error('Something was wrong with your Request Body'), {
        name: 'BadRequestError',
        errors: errors,
        formatErrorsIntoReadableStr() {
            let str = 'There are formatting issues with';
            this.errors.forEach((error) => {
                str += ` ${error.param},`;
            });
            return str.slice(0, -1); // To remove the trailing comma
        }
    });

    return errorObj;
};

// Usage Example:
const errorInstance = createBadRequestError([
    {
        location: 'body',
        msg: 'Invalid value',
        param: 'username'
    },
    {
        location: 'body',
        msg: 'Invalid value',
        param: 'email'
    }
]);

console.log(errorInstance.formatErrorsIntoReadableStr());
