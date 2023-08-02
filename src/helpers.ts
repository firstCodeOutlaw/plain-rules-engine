import {UnknownObject} from "./types";
import set from "lodash/set";
import get from "lodash/get";

export function isPlainObject(value: unknown): value is UnknownObject {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export function objectIsFlat(object: UnknownObject): boolean {
    let isFlat = true;
    const keys = Object.keys(object);

    keys.forEach((key) => {
        if (isPlainObject(object[key])) {
            isFlat = false;
            return;
        }
    });

    return isFlat;
}

// TODO: rename to setObjectKeyValue
export function setObjectProperty(
    key: string,
    value: unknown,
    object: UnknownObject,
): UnknownObject {
    const firstTwoCharacters = key.slice(0, 2);

    if (firstTwoCharacters === '$.') {
        const dotNotationString = key.slice(2); // with "$." excluded
        preventUseOfDotNotationKeyOnFlatObject(dotNotationString, object);
        return set(object, dotNotationString, value);
    }

    return set(object, key, value);
}

export function getObjectKeyValue(
    key: string,
    object: UnknownObject,
    throwDotNotationError: boolean = true,
): unknown {
    const firstTwoCharacters = key.slice(0, 2);

    if (firstTwoCharacters === '$.') {
        const dotNotationString = key.slice(2); // with "$." excluded

        if (throwDotNotationError)
            preventUseOfDotNotationKeyOnFlatObject(dotNotationString, object);
        return get(object, dotNotationString);
    }

    return get(object, key);
}

export function preventUseOfDotNotationKeyOnFlatObject(
    dotNotation: string,
    object: UnknownObject
): void {
    const targetsNestedObject = dotNotation.split('.').length > 1;

    if (targetsNestedObject && objectIsFlat(object))
        throw new Error('Cannot use dot notation on flat object');
}