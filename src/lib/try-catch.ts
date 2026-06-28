// Theo's preferred way of handling try/catch in TypeScript
// https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
// YouTube: https://www.youtube.com/watch?v=Y6jT-IkV0VM&t=1799s

// Types for the result object with discriminated union
type Success<T> = {
    data: T;
    error: null;
};

type Failure<E> = {
    data: null;
    error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatchAsync<T, E = Error>(
    promise: Promise<T>,
): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}

// (GJ): Synchronous version of the wrapper function
export function tryCatchSync<T, E = Error>(
    fn: () => T,
): Result<T, E> {
    try {
        const data = fn();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}
