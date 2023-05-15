import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { AppointmentUpdateDTO } from "./appointment-dto";

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
    });
});