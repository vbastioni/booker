import { buildArgs } from "./find-buyers";

describe('build `find buyer(s)` arg(s)', () => {
    it('should return an empty object if no arg is given', () => {
        expect(buildArgs({}))
            .toStrictEqual({});
    });

    it('should return a filter on an indexed search key if one is given (either `name` or `company`', () => {
        expect(buildArgs({ name: "Yannick" }))
            .toStrictEqual({ where: { name: "Yannick" } });
    });

    it('should return a take instruction if an expected result size is given', () => {
        const size = 10;
        expect(buildArgs({ size }))
            .toStrictEqual({ take: size });
    });

    it('should return a skip instruction if an expected result offset is given', () => {
        const offset = 10;
        expect(buildArgs({ offset }))
            .toStrictEqual({ skip: offset });
    });
});
