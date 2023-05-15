import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { AppointmentCreateDTO, AppointmentUpdateDTO } from "./appointment-dto";

describe('appointment-dto', () => {
    describe('AppointmentCreateDTO', () => {
        async function convAndValidate(body: any): Promise<ValidationError[]> {
            const dtoObject = plainToInstance(AppointmentUpdateDTO, body);
            return await validate(dtoObject);
        }

        it('should fail if appointmentType is not a valid value', async () => {
            const payload = { type: "NOT_EXISTANT" };
            const errors = await convAndValidate(payload);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain("type must be a valid AppointmentType value with adequate value");
        });

        it('should fail if appointmentType is VIRTUAL and location is set', async () => {
            const payload = { type: "VIRTUAL", location: "here" };
            const errors = await convAndValidate(payload);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain("type must be a valid AppointmentType value with adequate value");
        });

        it('should fail if appointmentType is PHYSICAL and link is set', async () => {
            const payload = { type: "PHYSICAL", link: "http://www.google.com" };
            const errors = await convAndValidate(payload);
            expect(errors.length).not.toBe(0);
            expect(JSON.stringify(errors))
                .toContain("type must be a valid AppointmentType value with adequate value");
        });

        it('should succeed on valid appointmentType value', async () => {
            const payload = { type: "VIRTUAL" };
            const errors = await convAndValidate(payload);
            expect(errors.length).toBe(0);
        });

        it('should returns a set of errors on missing fields', async () => {
            const payload = { type: "VIRTUAL" };
            const body = plainToInstance(AppointmentCreateDTO, payload);
            const errors = await validate(body);
            expect(errors.length).toBe(5);
            const strErrors = JSON.stringify(errors);
            [
                'title must be shorter than or equal to 64 characters',,
                'title must be longer than or equal to 3 characters',
                'hostId must be a number conforming to the specified constraints',
                'buyerId must be a number conforming to the specified constraints',
                'startTime must be a Date instance',
                'endTime must be a Date instance',
            ].every((err) => strErrors.includes(err));
        });
    });
});
