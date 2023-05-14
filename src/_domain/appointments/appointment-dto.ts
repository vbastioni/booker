import { PartialType } from '@nestjs/mapped-types';
import { AppointmentType } from "@prisma/client";

import { IsDate, IsNumber, IsOptional, IsUrl, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

import { IsAppointmentType } from "../../_helpers/validators/appointmentType-validator";
import { argToDate, argToInt, nullifyIfUndef } from "../../_helpers/transformers/transformer";

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
    @Transform(argToInt)
    hostId: number;
    @IsNumber()
    @Transform(argToInt)
    buyerId: number;

    @IsDate()
    @Transform(argToDate)
    startTime: Date;
    @IsDate()
    @Transform(argToDate)
    endTime: Date;
}

export class AppointmentUpdateDTO extends PartialType(AppointmentCreateDTO) { }
