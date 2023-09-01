import {UnknownObject} from "./types";
import set from "lodash/set";
import get from "lodash/get";

export function isPlainObject(value: unknown): value is UnknownObject {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export function setObjectKeyValue(
    key: string,
    value: unknown,
    object: UnknownObject,
): UnknownObject {
    if (key.slice(0, 2) !== '$.')
        throw new Error('"$." notation is required to reference object key');

    const dotNotationKey = key.slice(2); // "$." excluded
    return set(object, dotNotationKey, value);
}

export function getObjectKeyValue(
    key: string,
    object: UnknownObject,
    fallbackObject?: UnknownObject,
    throwObjectKeyNotFoundError: boolean = true
): unknown {
    if (key.slice(0, 2) !== '$.')
        throw new Error('"$." notation is required to reference object key');

    const dotNotationKey = key.slice(2); // "$." excluded
    const value = get(object, dotNotationKey);
    if (value || value === '') return value;

    if (throwObjectKeyNotFoundError && !fallbackObject)
        throw new Error(
            `Object has no ${key.substring(2)} key, and no fallback object was provided`,
        );

    return get(fallbackObject, dotNotationKey);
}

