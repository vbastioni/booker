import { AppointmentType } from "@prisma/client";
import { IsDate, IsNumber, IsOptional, IsUrl, MaxLength, MinLength } from "class-validator";
import { IsAppointmentType } from "../../_helpers/validators/appointmentType-validator";
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from "class-transformer";

function nullifyIfUndef<T>({value}: {value?: T}): T | null {
    return value ?? null;
}

export class AppointmentCreateDTO {
    @MinLength(3)
    @MaxLength(64)
    title: string


    @IsOptional()
    // Transform the undefined value of the inbound payload to a null value
    // for the prisma definition
    @Transform(nullifyIfUndef)
    location: string | null;

    @IsOptional()
    @IsUrl()
    // Transform the undefined value of the inbound payload to a null value
    // for the prisma definition
    @Transform(nullifyIfUndef)
    link: string | null;

    @IsAppointmentType()
    type: AppointmentType;

    @IsNumber()
    @Transform(({value}) => Number(value))
    hostId: number;
    @IsNumber()
    @Transform(({value}) => Number(value))
    buyerId: number;

    @IsDate()
    @Transform(({value}) => new Date(value))
    startTime: Date;
    @IsDate()
    @Transform(({value}) => new Date(value))
    endTime: Date;
}

export class AppointmentUpdateDTO extends PartialType(AppointmentCreateDTO) { }
