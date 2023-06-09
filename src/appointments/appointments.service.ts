import { BadRequestException, Injectable } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { AppointmentCreateDTO, AppointmentUpdateDTO } from '../_domain/appointments/appointment-dto';
import { time } from 'console';

export function error(name: string, message: string): Error {
    const e = new Error(message);
    e.name = name;
    return e;
}

@Injectable()
export class AppointmentsService {
    constructor(private readonly prisma: PrismaService) { }

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
    ): Promise<Appointment> {
        // Other option would have been
        //  1) a BEFORE trigger function, to check and prevent if already present
        //  2) a raw query to find if appointment exists (to be tested)
        //      SELECT true
        //      WHERE
        //          (hostId = ${hostId} OR buyerId = ${buyerId})
        //        AND
        //          (startTime >= ${startTime} AND endTime < ${endTime})
        //      FROM
        //          prisma.appointments

        const { hostId, buyerId, startTime, endTime } = appointmentDTO;
        return await this.prisma.$transaction(async (tx) => {
            if (startTime > endTime) {
                throw error("bookingError", "startTime > endTime");
            }

            const existings = await tx.$queryRaw<{ id: number }[]>(
                Prisma.sql`SELECT "public"."Appointment"."id" FROM "public"."Appointment" WHERE ("public"."Appointment"."startTime" >= ${startTime} AND "public"."Appointment"."endTime" <= ${endTime} AND ("public"."Appointment"."hostId" = ${hostId} OR "public"."Appointment"."buyerId" = ${buyerId})) LIMIT 1`
            );
            if (existings.length > 0) {
                throw error("bookingError", "overlapping session(s)");
            }

            const apt = await tx.appointment.create({
                data: appointmentDTO
            });
            return apt;
        });
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
