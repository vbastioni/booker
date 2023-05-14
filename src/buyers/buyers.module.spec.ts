import { Test } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { createMock } from '@golevelup/ts-jest';

import { BuyersModule } from './buyers.module';
import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';

describe('AppointmentsModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [BuyersModule],
            providers: [
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                }
            ]
        }).compile();

        expect(module).toBeDefined();
        expect(module.get(BuyersController))
            .toBeInstanceOf(BuyersController);
        expect(module.get(BuyersService))
            .toBeInstanceOf(BuyersService);
    });
});
