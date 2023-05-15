import { AppointmentType } from "@prisma/client";
import { ValidationOptions, isURL, registerDecorator } from "class-validator";

export function IsAppointmentType(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isValidAppointmentType",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: (value, args) => {
                    const validValue = typeof value === "string" && AppointmentType[value];
                    if (!validValue) {
                        return false;
                    }
                    switch (AppointmentType[value]) {
                        case 'VIRTUAL': return args.object["location"] === undefined;
                        case 'PHYSICAL': return args.object["link"] === undefined;
                    }
                },
                defaultMessage: ({ property,  }) => `${property} must be a valid AppointmentType value with adequate value`,
            },
        });
    }
}
