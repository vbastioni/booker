import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { AppointmentsModule } from './appointments.module';
import { PrismaService } from 'nestjs-prisma';
import { createMock } from '@golevelup/ts-jest';
import { AppointmentsController } from './appointments.controller';

describe('AppointmentsModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [AppointmentsModule],
            providers: [
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                }
            ]
        }).compile();

        expect(module).toBeDefined();
        expect(module.get(AppointmentsController)).toBeInstanceOf(AppointmentsController);
        expect(module.get(AppointmentsService)).toBeInstanceOf(AppointmentsService);
    });
});
