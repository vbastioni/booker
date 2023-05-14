import { TransformFnParams } from "class-transformer";

export function argToInt({ value }: Pick<TransformFnParams, "value">) {
    return parseInt(value);
}

export function argToDate({ value }) {
    return new Date(value);
}

export function nullifyIfUndef<T>({ value }: { value?: T }): T | null {
    return value ?? null;
}
