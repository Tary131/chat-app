import {FirebaseError} from "firebase/app";
type QueryError = { status: string; message: string };

export const handleAsyncErrors = async <T>(callback: () => Promise<T>): Promise<{ data: T } | { error: QueryError }> => {
    try {
        const data = await callback();
        return { data };
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { error: { status: error.code, message: error.message } };
        } else if (error instanceof Error) {
            return { error: { status: 'CUSTOM_ERROR', message: error.message } };
        } else {
            return { error: { status: 'CUSTOM_ERROR', message: 'An unknown error occurred' } };
        }
    }
};