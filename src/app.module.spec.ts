import { PrismaService } from 'nestjs-prisma';
import { createMock } from '@golevelup/ts-jest';
import { AppModule } from './app.module';
import { Test } from '@nestjs/testing';

describe('AppointmentsModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
            providers: [
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                }
            ]
        }).compile();

        expect(module).toBeDefined();
    });
});
