import axios from 'axios';

export interface ErrorResponse {
    message: string;
    errorData: unknown;
    code: number;
    data: unknown;
}
const errorHandler = (error: unknown): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const { data, status } = error.response;

            return {
                message: data?.message || 'Request failed with status code ' + status,
                errorData: data?.errorData || null,
                code: data?.code || status,
                data: data?.data || null,
            };
        }

        else if (error.request) {
            return {
                message: 'No response received from the server.',
                errorData: null,
                data: null,
                code: 0,
            };
        }

        else {
            return {
                message: 'Error setting up the request.',
                errorData: null,
                data: null,
                code: 0,
            };
        }
    } else {
        return {
            message: 'An unexpected error occurred.',
            errorData: null,
            data: null,
            code: 0,
        };
    }
};

export default errorHandler;
