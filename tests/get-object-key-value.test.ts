import {getObjectKeyValue} from "../src/helpers";
import {flatObject, nestedAlbumObject} from "./mock/objects";
import * as Helpers from "../src/helpers";

const preventUseOfDotNotationKeyOnFlatObjectMock = jest
    .spyOn(Helpers, 'preventUseOfDotNotationKeyOnFlatObject')
    .mockImplementation();

describe('Get object key value', () => {
    describe('flat object', () => {
        const object = {
            title: 'Heal the World',
            year: 1991,
            tags: ["pop", "society"],
        };

        it('should fetch an object key whose value is a string', () => {
            const result = getObjectKeyValue('title', object);

            expect(typeof result).toBe('string');
            expect(result).toBe('Heal the World');
        });

        it('should fetch an object key whose value is a number', () => {
            const result = getObjectKeyValue('year', object);

            expect(typeof result).toBe('number');
            expect(result).toBe(1991);
        });

        it('should fetch an object key whose value is an array', () => {
            const result = getObjectKeyValue('tags', object);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toStrictEqual(["pop", "society"]);
        });

        it('should return undefined if object key does not exist', () => {
            const nonExistentKey = 'category';
            const result = getObjectKeyValue(nonExistentKey, object);

            expect(result).toBe(undefined);
        });
    });

    describe('nested object', () => {
        describe('using dot notation', () => {
            it('should fetch an object key from a nested object', () => {
                const result = getObjectKeyValue('album.title', nestedAlbumObject);

                expect(typeof result).toBe('string');
                expect(result).toBe('Bamboo Flute');
            });

            it('should fetch an object key from a deeply nested object', () => {
                const result = getObjectKeyValue('album.meta.streams.total', nestedAlbumObject);

                expect(typeof result).toBe('number');
                expect(result).toBe(2_300_000);
            });

            it('should return undefined if object key does not exist', () => {
                const nonExistentKey = 'album.meta.category';
                const result = getObjectKeyValue(nonExistentKey, nestedAlbumObject);

                expect(result).toBe(undefined);
            });
        });
    });

    // describe('throwDotNotation is set to false', () => {
    //     afterAll(() => {
    //         preventUseOfDotNotationKeyOnFlatObjectMock.mockClear();
    //     });
    //
    //     it('should NOT call preventUseOfDotNotationKeyOnFlatObject', () => {
    //         getObjectKeyValue('name.firstName', flatObject, false);
    //
    //         expect(preventUseOfDotNotationKeyOnFlatObjectMock)
    //             .not.toHaveBeenCalled();
    //     });
    // });
    //
    // describe('throwDotNotation is set to true', () => {
    //     afterAll(() => {
    //         preventUseOfDotNotationKeyOnFlatObjectMock.mockClear();
    //     });
    //
    //     it('should call preventUseOfDotNotationKeyOnFlatObject', () => {
    //         getObjectKeyValue('album.meta', nestedAlbumObject);
    //
    //         expect(preventUseOfDotNotationKeyOnFlatObjectMock)
    //             .toHaveBeenCalledTimes(1);
    //     });
    // });
});