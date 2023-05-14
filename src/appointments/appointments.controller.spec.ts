import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from 'nestjs-prisma';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { allAppointments, defaultAppointment, mockAppointment } from '../_domain/appointments/mock';

describe('AppointmentsController', () => {
    let controller: AppointmentsController;
    let service: AppointmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                AppointmentsController,
            ],
            providers: [
                AppointmentsService,
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                }
            ],
        })
            .compile();

        controller = module.get<AppointmentsController>(AppointmentsController);
        service = module.get<AppointmentsService>(AppointmentsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('all', () => {
        it('should return the element returned by the service', async () => {
            const result = allAppointments;
            jest.spyOn(service, 'all').mockImplementation(async () => result);
            expect(await controller.all()).toBe(result);
        });
    });

    describe('create', () => {
        const appointment = mockAppointment({ id: 12 });
        const { id, ...payload } = appointment;
        it('should return the id of created element', async () => {
            const result = { id };
            jest
                .spyOn(service, 'create')
                .mockImplementation(async () => appointment);
            expect(await controller.create(payload))
                .toStrictEqual(result);
        });

        it('should throw an error on service error return', async () => {
            const error = { _error: "overlapping session(s)" };
            const thrown = new BadRequestException(error);
            jest
                .spyOn(service, 'create')
                .mockImplementation(async () => error);
            expect(controller.create(payload))
                .rejects
                .toEqual(thrown);
        });
    });

    describe('read', () => {
        it('should return element if ID exists', async () => {
            const result = defaultAppointment;
            jest
                .spyOn(service, 'read')
                .mockImplementation(async () => result);
            expect(await controller.read(1))
                .toBe(result);
        });

        it('should return an error if ID is absent', async () => {
            jest
                .spyOn(service, 'read')
                .mockImplementation(async () => null);
            expect(controller.read(10))
                .rejects
                .toEqual(new NotFoundException());
        })
    });

    describe('update-patch', () => {
        test.todo('should return the id of the element modified on success');
        test.todo('should return a 400 Bad Request with info on bad requestion');
        it('should throw an error other ', () => {
            expect(controller.updatePatch(Number.MAX_SAFE_INTEGER, {}))
                .rejects
                .toEqual(new InternalServerErrorException());
        });
    });

    describe('update-put', () => {
        const { id: _, ...data } = defaultAppointment;

        test.todo('should return the id of the element modified on success');
        test.todo('should return a 400 Bad Request with info on bad requestion');
        it('should throw an error other ', () => {
            expect(controller.updatePut(Number.MAX_SAFE_INTEGER, data))
                .rejects
                .toEqual(new InternalServerErrorException());
        });
    });

    describe('delete', () => {
        it('should return an ID if an element had been deleted', async () => {
            const apt = mockAppointment({ id: 9 });
            const result = { ...apt };
            Object.keys(result).forEach(k => k === 'id' || delete result[k]);
            jest.spyOn(service, 'delete').mockImplementation(async () => apt);
            expect(await controller.delete(9))
                .toStrictEqual(result);
        });

        it('should return an empty body if no element has been deleted', async () => {
            jest.spyOn(service, 'delete').mockImplementation(async () => {
                throw new PrismaClientKnownRequestError(
                    "",
                    { code: "P2025", clientVersion: "0" },
                );
            });
            expect(await controller.delete(4))
                .toBe(null);
        });

        it('should throw an INTERNAL_SERVER_ERROR on unhandled error', async () => {
            jest.spyOn(service, 'delete').mockImplementation(async () => {
                throw new Error("test error");
            });
            expect(controller.delete(123))
                .rejects
                .toStrictEqual<InternalServerErrorException>(new InternalServerErrorException);
        });

    });
});
