import { AppointmentType } from "@prisma/client";
import { ValidationOptions, registerDecorator } from "class-validator";

export function IsAppointmentType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidAppointmentType",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: (value) => typeof value === "string" && AppointmentType[value],
                defaultMessage: ({ property }) => `${property} must be a valid AppointmentType value`,
            },
        });
    }
}
