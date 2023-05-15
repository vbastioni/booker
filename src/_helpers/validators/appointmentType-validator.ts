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
                        case 'VIRTUAL': {
                            if (args.object["location"] !== undefined) {
                                return false;
                            }
                            const link = args.object["link"];
                            if (link !== undefined) {
                                return isURL(link);
                            }
                        }
                        case 'PHYSICAL': return args.object["link"] === undefined;
                    }
                    return true;
                },
                defaultMessage: ({ property,  }) => `${property} must be a valid AppointmentType value with adequate value`,
            },
        });
    }
}
