import {RuleEngine} from "../src";
import {type Rule} from "../src/types";
import {Action, Operator} from "../src/enums";
import {
    loggedInUserNormal,
    loggedInUserUnderage,
    musicTrackRules,
    trackWithStrongLanguage,
    trackWithStrongLanguageAndEmptyTitle
} from "./mock/objects";

describe('Check for matching rules', () => {
    describe('when object matches all conditions in a rule', () => {
        const ruleEngine = new RuleEngine(musicTrackRules);

        it('should return number of rules matched', () => {
            const rulesMatched = ruleEngine.checkForMatchingRules(
                trackWithStrongLanguageAndEmptyTitle,
                loggedInUserUnderage,
            );

            expect(Array.isArray(rulesMatched)).toBe(true);
            expect(rulesMatched.length).toBe(2);
            expect(rulesMatched).toStrictEqual([
                'trackHasStrongLanguage',
                'trackHasEmptyTitle'
            ]);
        });
    });

    describe('when object DOES NOT match all conditions in a rule', () => {
        const ruleEngine = new RuleEngine(musicTrackRules);

        it('should should return an empty array', () => {
            const rulesMatched
                = ruleEngine.checkForMatchingRules(trackWithStrongLanguage, loggedInUserNormal);

            expect(Array.isArray(rulesMatched)).toBe(true);
            expect(rulesMatched.length).toBe(0);
        });
    });

    describe('when rule condition uses unsupported data types', () => {
        it('should throw an error if typeof RIGHT is not number or string', () => {
            const unsupportedTypes = [[], { name: 'John' }, function () { return true; }];

            unsupportedTypes.forEach(unsupported => {
                const ruleWithUnsupportedTypes = {
                    removeInappropriateTracks: {
                        conditions: [
                            ['$.tags', Operator.CONTAINS, unsupported],
                            // Operator.CONTAINS can only check for whether an array contains a string
                            // or number. So we expect an error when checking for matching rules here
                            // because of unsupported types.
                        ],
                        effect: {
                            action: Action.OMIT,
                        },
                    }
                };

                // @ts-expect-error: definitions in ruleWithUnsupportedTypes does not match type RuleEngine
                const ruleEngine = new RuleEngine(ruleWithUnsupportedTypes);

                expect(() => ruleEngine.checkForMatchingRules(trackWithStrongLanguage))
                    .toThrowError("argument 'right' should be a string or number");
            });
        });

        it('should return number of rules matched if type of RIGHT is number or string', () => {
            const ruleWithSupportedTypes: Rule = {
                removeInappropriateTracks: {
                    conditions: [
                        ["$.user.age", Operator.LESS_THAN, 16], // right (i.e. 16) is number
                        ['$.tags', Operator.CONTAINS, 'strong language'], // right (i.e. 'strong language') is string
                    ],
                    effect: {
                        action: Action.OMIT,
                    },
                }
            };

            const ruleEngine = new RuleEngine(ruleWithSupportedTypes);
            const rulesMatched = ruleEngine.checkForMatchingRules(
                trackWithStrongLanguage,
                loggedInUserUnderage
            );

            expect(rulesMatched.length).toBe(1);
            expect(rulesMatched).toStrictEqual(['removeInappropriateTracks']);
        });

        it('should throw an error if typeof LEFT is not number or string or array', () => {
            const unsupportedTypes = [{ name: 'John' }, function () { return true; }];
            const sampleRule: Rule = {
                removeInappropriateTracks: {
                    conditions: [
                        ['$.tags', Operator.CONTAINS, 'strong language'],
                    ],
                    effect: {
                        action: Action.OMIT,
                    },
                }
            };

            unsupportedTypes.forEach(unsupported => {
                const clonedTrack = { ...trackWithStrongLanguage, tags: unsupported };
                const ruleEngine = new RuleEngine(sampleRule);

                expect(() => ruleEngine.checkForMatchingRules(clonedTrack))
                    .toThrowError("argument 'left' should be a string, number or array");
            });
        });

        it('should return number of rules matched if type of LEFT is number, string or array', () => {
            const ruleWithSupportedTypes: Rule = {
                removeInappropriateTracks: {
                    conditions: [
                        ["$.user.age", Operator.LESS_THAN, 16],
                        ['$.tags', Operator.CONTAINS, 'strong language'],
                        ['$.user.settings.safeSearch', Operator.EQUALS, 'on'],
                    ],
                    effect: {
                        action: Action.OMIT,
                    },
                }
            };

            const loggedInUser = {
                user: {
                    age: 14,
                    lastLogin: '2023-08-25T16:00:45Z',
                    settings: {
                        safeSearch: 'on',
                    },
                },
            };

            const ruleEngine = new RuleEngine(ruleWithSupportedTypes);
            const rulesMatched = ruleEngine.checkForMatchingRules(trackWithStrongLanguage, loggedInUser);

            expect(rulesMatched.length).toBe(1);
            expect(rulesMatched).toStrictEqual(['removeInappropriateTracks']);
        });
    });
});