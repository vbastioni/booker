import {
    BadRequestException, Body, Controller, Delete, Get,
    InternalServerErrorException, NotFoundException, NotImplementedException,
    Param, Patch, Post, Put, Query
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { intPipe } from '../_helpers/validationPipes/intPipe';
import { Appointment } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { AppointmentCreateDTO, AppointmentUpdateDTO } from '../_domain/appointments/appointment-dto';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) { }

    @Get()
    async all(
        @Query('day') day?: Date,
        @Query('size') size?: number,
        @Query('offset') offset?: number,
    ) {
        return await this.service.all({ day, size, offset });
    }

    @Post()
    async create(
        @Body() data: AppointmentCreateDTO,
    ) {
        try {
            const { id } = await this.service.create(data);
            return { id };
        } catch (e) {
            if (e.name === "bookingError") {
                throw new BadRequestException(e.message);
            }
            throw new InternalServerErrorException(e);
        }
    }

    @Get(':id')
    async read(
        @Param('id', intPipe) id: number,
    ) {
        const value: Appointment | null = await this.service.read(id);
        if (value === null) {
            throw new NotFoundException();
        }
        return value;
    }

    @Patch(':id')
    async updatePatch(
        @Param('id', intPipe) id: number,
        @Body() data: AppointmentUpdateDTO,
    ) {
        try {
            return this.service.updatePatch(id, data);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    @Put(':id')
    async updatePut(
        @Param('id', intPipe) id: number,
        @Body() data: AppointmentCreateDTO,
    ) {
        try {
            return this.service.updatePut(id, data);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    @Delete(':id')
    async delete(
        @Param('id', intPipe) id: number,
    ): Promise<{ id: number } | null> {
        try {
            const deleted = await this.service.delete(id);
            return { id: deleted.id };
        } catch (e) {
            // code P2025 is PrismaClientKnownRequestError
            //   ```
            //   An operation failed because it depends on one or more records
            //   that were required but not found. {cause}
            //   ```
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                return null;
            }
            throw new InternalServerErrorException();
        }
    }
}
