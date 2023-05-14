import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { createMock } from '@golevelup/ts-jest';

import { AppointmentsService } from './appointments.service';
import { defaultAppointment, mockAppointment } from '../_domain/appointments/mock';

describe('AppointmentsService', () => {
    let service: AppointmentsService;
    let prisma = createMock<PrismaService>();
    const { findFirst } = prisma.appointment;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: prisma,
                },
                AppointmentsService,
            ],
        }).compile();

        service = module.get<AppointmentsService>(AppointmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('prepDayQuery', () => {
        it('should return an empty object if no day is undefined', () => {
            expect(AppointmentsService.prepDayQuery()).toBe(undefined);
        });

        it('should return the beginning of the day and one day after beginning', () => {
            const day = new Date("2023-06-15T14:00:00.000Z");
            const beg = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
            expect(AppointmentsService.prepDayQuery(day))
                .toStrictEqual({
                    startTime: { gte: beg },
                    endTime: { lt: end },
                });
        });
    });

    describe('noOverlap', () => {
        const beg = new Date("2023-06-15T13:00:00.000Z");
        const end = new Date("2023-06-15T14:00:00.000Z");
        it('should return an error if startTime > endTime', async () => {
            expect(await service.noOverlap(1, 1, end, beg))
                .toStrictEqual({ _error: "startTime > endTime" });
        });

        it('should return an error if overlapping appointments exist', async () => {
            prisma.appointment.findFirst = jest.fn().mockReturnValue(defaultAppointment);
            expect(await service.noOverlap(1, 1, beg, end))
                .toStrictEqual({ _error: "overlapping session(s)" });
            prisma.appointment.findFirst = findFirst;
        });

        it('should return true if no overlapping appointments was found', async () => {
            prisma.appointment.findFirst = jest.fn().mockReturnValue(null);
            expect(await service.noOverlap(1, 1, beg, end))
                .toBe(true);
            prisma.appointment.findFirst = findFirst;
        })
    })

    describe('all', () => {
        it("should use every param given", () => {
            const day = new Date("2023-06-15T13:00:00.000Z");
            const beginningOfDay = new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
            );
            const nextDay = new Date(beginningOfDay);
            nextDay.setDate(nextDay.getDate() + 1);
            const offset = 0;
            const size = 10;
            prisma.appointment.findMany = jest.fn().mockReturnValue([]);
            service.all({
                day,
                size,
                offset,
            });
            expect(prisma.appointment.findMany).toBeCalledWith({
                where: {
                    startTime: { gte: beginningOfDay },
                    endTime: { lt: nextDay },
                },
                skip: offset,
                take: size,
            });

            service.all()
            expect(prisma.appointment.findMany).toBeCalledWith({});
        })
    });

    describe('create', () => {
        const beg = new Date("2023-06-15T13:00:00.000Z");
        const end = new Date("2023-06-15T14:00:00.000Z");

        it('should return the overlap error found', async () => {
            expect(await service.create(mockAppointment({ startTime: end, endTime: beg })))
                .toStrictEqual({ _error: "startTime > endTime" });
        });

        it('should return the created object on success', async () => {
            const apt = mockAppointment();
            prisma.appointment.create = jest.fn().mockReturnValue(apt);
            prisma.appointment.findFirst = jest.fn().mockReturnValue(null);
            expect(await service.create(apt))
                .toStrictEqual(apt);
        })
        //
    });

    describe('read', () => {
        it('should pass request to db with given ID', async () => {
            const apt = mockAppointment();
            prisma.appointment.findUnique = jest.fn().mockReturnValue(apt);
            service.read(apt.id);
            expect(prisma.appointment.findUnique)
                .toBeCalledWith({ where: { id: apt.id } });
        });
    });

    describe('update-patch', () => {
        //
    });

    describe('update-put', () => {
        //
    });

    describe('delete', () => {
        it('should pass request to db with given ID', async () => {
            const apt = mockAppointment();
            prisma.appointment.delete = jest.fn().mockReturnValue(apt);
            service.delete(apt.id);
            expect(prisma.appointment.delete)
                .toBeCalledWith({ where: { id: apt.id } });
        });
    });
});
