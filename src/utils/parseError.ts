import { ErrorResponse, ErrorResponseSchema } from '@/types/schemas/response';

export const parseError = (error: Error | null): ErrorResponse | null => {
    if (!error?.message) return null;

    const fallback: ErrorResponse = { type: 'other', message: error.message };

    try {
        const parsed = JSON.parse(error.message);
        const result = ErrorResponseSchema.safeParse(parsed);
        return result.success ? result.data : fallback;
    } catch {
        return fallback;
    }
};

export const isNetworkError = (error: Error | null): boolean => {
    return parseError(error)?.type === 'network';
};
