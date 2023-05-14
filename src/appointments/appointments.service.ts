import { Injectable } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { AppointmentCreateDTO, AppointmentUpdateDTO } from '../_domain/appointments/appointment-dto';

@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) { }

    async noOverlap(
        hostId: number, buyerId: number, startTime: Date, endTime: Date,
    ): Promise<true | { _error: string; }> {
        if (startTime > endTime) {
            return { _error: "startTime > endTime" };
        }

        const timeIntervalCheck: Prisma.AppointmentWhereInput = {
            startTime: { gte: startTime },
            AND: {
                endTime: { lte: endTime, }
            }
        };

        const existing = await this.prisma.appointment.findFirst({
            where: {
                hostId,
                ...timeIntervalCheck,
                OR: {
                    buyerId,
                    ...timeIntervalCheck,
                },
            },
        });

        if (existing !== null) {
            return { _error: "overlapping session(s)" };
        }

        return true;
    }

    static prepDayQuery(day?: Date): Prisma.AppointmentWhereInput | undefined {
        if (!day) {
            return undefined;
        }

        const beginningOfDay = new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate(),
        );
        const nextDay = new Date(beginningOfDay);
        nextDay.setDate(nextDay.getDate() + 1);

        return {
            startTime: { gte: beginningOfDay },
            endTime: { lt: nextDay },
        };
    }

    async all(options?: { day?: Date, size?: number, offset?: number }) {
        const { day, size: take, offset: skip } = options ?? {};
        const where = AppointmentsService.prepDayQuery(day);
        return this.prisma.appointment.findMany({
            where,
            skip,
            take,
        });
    }

    async create(
        appointmentDTO: AppointmentCreateDTO
    ): Promise<Appointment | { _error: string; }> {
        const { hostId, buyerId, startTime, endTime } = appointmentDTO;

        const noOverlap = await this.noOverlap(hostId, buyerId, startTime, endTime);
        if (noOverlap !== true) {
            return noOverlap;
        }

        return this.prisma.appointment.create({ data: appointmentDTO });
    }

    async read(id: number) {
        return this.prisma.appointment.findUnique({ where: { id } });
    }

    async updatePatch(id: number, appointmentUpdateDTO: AppointmentUpdateDTO) {
        return this.prisma.appointment.update({
            where: { id },
            data: { ...appointmentUpdateDTO },
        });
    }

    async updatePut(id: number, appointmentCreateDTO: AppointmentCreateDTO) {
        return this.prisma.appointment.update({
            where: { id },
            data: { ...appointmentCreateDTO },
        });
    }

    async delete(id: number) {
        return this.prisma.appointment.delete({ where: { id } });
    }
}
