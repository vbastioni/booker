import { argToDate, argToInt, nullifyIfUndef } from "./transformer";

describe('argToInt', () => {
    it('should parse a string to int, as it is filtered before call', () => {
        expect(argToInt({value: "3"}))
            .toBe(3);
    })
});
describe('argToDate', () => {
    it('should parse a string to a Date, as it is filtered before call', () => {
        expect(argToDate({value: "2023-05-15"}))
            .toStrictEqual(new Date("2023-05-15"));
    })
});
describe('nullifyIfUndef', () => {
    it('should parse convert and undefined value to a null', () => {
        expect(nullifyIfUndef({value: undefined}))
            .toBe(null);
    });

    it('should do nothing if value is not undefined', () => {
        const value = 3;
        expect(nullifyIfUndef({value}))
            .toBe(value);
    })
});
