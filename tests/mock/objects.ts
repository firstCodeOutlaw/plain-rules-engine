import {type Rule} from "../../src/types";
import {Action, Operator} from "../../src/enums";

export type RandomProduct =  { product: string, price: number, isTaxable: number };
export type RandomCart = {
    customerType: 'student' | 'general',
    purchase: {
        items: RandomProduct[],
        amountTotal: number,
        amountTotalDiscounted: number
    }
};

export const salesRules: Rule = {
    addValueAddedTax: {
        conditions: [
            ['$.price', Operator.GREATER_THAN, 120],
            // TODO: consider ['$.taxable', 'equals', true] boolean. Requires updating getFieldValue and conditionIsTruthy
            // to take boolean value. Note that update to any method means test must be added
            ['$.isTaxable', Operator.EQUALS, 1],
        ],
        effect: {
            action: Action.INCREMENT,
            property: '$.price',
            value: 8
        }
    },
    applyStudentDiscount: {
        conditions: [
            ['$.customerType', Operator.EQUALS, 'student'],
        ],
        effect: {
            action: Action.DECREMENT,
            property: '$.purchase.amountTotalDiscounted',
            value: 5,
        },
    },
};

export const musicTrackRules: Rule = {
    trackHasStrongLanguage: {
        conditions: [
            ["$.user.age", Operator.LESS_THAN, 13],
            ["$.tags", Operator.CONTAINS, "strong language"],
        ],
        effect: {
            action: Action.OMIT,
        },
    },
    trackHasEmptyTitle: {
        conditions: [
            ["$.title", Operator.EQUALS, ""],
        ],
        effect: {
            action: Action.OMIT,
        },
    },
};

export const ruleWithUnknownAction: Rule = {
    applyStudentDiscount: {
        conditions: [
            ['$.customerType', Operator.EQUALS, 'student'],
        ],
        effect: {
            // @ts-expect-error: The value below is not a valid Action enum
            action: 'action not defined Action enum',
            property: '$.purchase.amountTotalDiscounted',
            value: 5,
        },
    }
};

export const productWithPriceGreaterThan120: RandomProduct = {
    product: 'banana 3kg',
    price: 128,
    isTaxable: 1,
};

export const productWithPriceLessThan120: RandomProduct = {
    product: 'apple 3kg',
    price: 88,
    isTaxable: 1,
};

export const cart: RandomCart = {
    customerType: 'student',
    purchase: {
        items: [
            productWithPriceLessThan120,
            productWithPriceLessThan120,
        ],
        amountTotal: 216,
        amountTotalDiscounted: 216,
    },
};

export const nestedObject = {
    customerType: 'student',
    purchase: {
        items: [
            productWithPriceLessThan120,
            productWithPriceLessThan120,
        ],
        amountTotal: 216,
        amountTotalDiscounted: 216,
    }
};

export const flatObject = {
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
};

export const nestedAlbumObject = {
    album: {
        title: 'Bamboo Flute',
        year: 2022,
        meta: {
            streams: {
                total: 2_300_000,
                dailyAverage: 3_400,
            },
            albumArt: 'https://abc.xyz/123abc',
            tags: ["pop", "society"],
        },
    },
};

export const safeTrack = {
    title: "Heal the World",
    artist: "Michael Jackson",
    year: 1991,
    album: "Dangerous",
    tags: ["pop", "society"],
};

export const anotherSafeTrack = {
    title: "Around the World",
    artist: "Fray Doe",
    year: 2019,
    album: "Multiverse",
    tags: ["pop"],
};

export const trackWithStrongLanguage = {
    title: "The Girl From Last Night",
    artist: "Jackson Pepper",
    year: 2017,
    album: "Slot Machine",
    tags: ["rap", "strong language"],
};

export const trackWithStrongLanguageAndEmptyTitle = {
    ...trackWithStrongLanguage,
    title: '',
};

export const trackWithEmptyTitle = {
    title: "",
    artist: "John Doe",
    year: 2001,
    album: "Wild West",
    tags: ["country"],
};

export const loggedInUserNormal = {
    user: {
        age: 19,
        lastLogin: '2023-08-26T16:00:45Z',
    }
};

export const loggedInUserUnderage = {
    user: {
        ...loggedInUserNormal.user,
        age: 12
    },
};