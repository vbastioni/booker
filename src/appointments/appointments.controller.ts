import {
    BadRequestException, Body, Controller, Delete, Get,
    InternalServerErrorException, NotFoundException, NotImplementedException,
    Param, Patch, Post, Put, Query
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { intPipe } from '../_helpers/validationPipes/intPipe';
import { Appointment } from '@prisma/client';
import { AppointmentCreateDTO, AppointmentUpdateDTO } from '../_domain/appointments/appointment-dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) { }

    @Get()
    async all(
        @Query('day') day?: Date,
    ) {
        return await this.service.all({ day });
    }

    @Post()
    async create(
        @Body() data: AppointmentCreateDTO,
    ) {
        const v = await this.service.create(data);
        if ("_error" in v) {
            throw new BadRequestException(v);
        }
        const { id } = v;
        return { id };
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
            console.log(id, data);
            throw new NotImplementedException();
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
            console.log(id, data);
            throw new NotImplementedException();
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
