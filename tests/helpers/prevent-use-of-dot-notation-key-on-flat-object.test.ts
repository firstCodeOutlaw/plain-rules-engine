import {preventUseOfDotNotationKeyOnFlatObject} from "../../src/helpers";
import {flatObject, nestedAlbumObject} from "../mock/objects";

describe('Prevent use of dot notation key on flat object', () => {
    describe('dot notation key is used', () => {
        it('should throw an error if object is flat', () => {
            expect(
                () => preventUseOfDotNotationKeyOnFlatObject('name.firstName', flatObject)
            ).toThrowError();
        });

        it('should not throw an error if object is nested', () => {
            expect(
                () => preventUseOfDotNotationKeyOnFlatObject(
                    'meta.tags',
                    nestedAlbumObject,
                )
            ).not.toThrowError();
        });
    });

    describe('dot notation key is NOT used', () => {
        it('should not throw an error if object is flat', () => {
            expect(
                () => preventUseOfDotNotationKeyOnFlatObject(
                    'firstName',
                    flatObject,
                )
            ).not.toThrowError();
        });

        it('should not throw an error if object is nested', () => {
            expect(
                () => preventUseOfDotNotationKeyOnFlatObject(
                    'meta',
                    nestedAlbumObject,
                )
            ).not.toThrowError();
        });
    });
});