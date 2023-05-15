import { plainToInstance } from "class-transformer";
import { FindBuyerParamsDTO, buildArgs } from "./find-buyers-dto";
import { ValidationError, validate } from "class-validator";

describe('findbuyers-dto', () => {
    describe('buildArgs', () => {
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

    describe('FindBuyerParamsDTO', () => {
        async function convAndValidate(body: any): Promise<ValidationError[]> {
            const dtoObject = plainToInstance(FindBuyerParamsDTO, body);
            return await validate(dtoObject);
        }
        it('should fail if no `name` nor `company` is given', async () => {
            const bodyObject = {};
            const errors = await convAndValidate(bodyObject);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain("company should not be empty");
        });
        it('should fail if name is present but empty', async () => {
            const bodyObject = { name: "" };
            const errors = await convAndValidate(bodyObject);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain("name should not be empty");
        });

        it('should fail if company is present but empty', async () => {
            const bodyObject = { company: "" };
            const errors = await convAndValidate(bodyObject);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain("company should not be empty");
        });

        it('should fail on non-integer value for offset or size', async () => {
            const key = "size";
            const bodyObject = { name: "Georges", [key]: "e" };
            const errors = await convAndValidate(bodyObject);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain(`${key} must be a number conforming to the specified constraints`);
        });

        it('should succeed on valid minimal payload', async () => {
            const bodyObject = { name: "Georges" };
            const errors = await convAndValidate(bodyObject);
            expect(errors.length).toBe(0);
        });

        it('should succeed on full valid payload', async () => {
            const bodyObject = {name: "Georges", size: 1, offset: 0};
            const errors = await convAndValidate(bodyObject);
            expect(errors.length).toBe(0);
        })
    })
});
