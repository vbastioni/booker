import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { createMock } from "@golevelup/ts-jest";

import { BuyersController } from "./buyers.controller";
import { BuyersService } from "./buyers.service";

describe('BuyersController', () => {
    let controller: BuyersController;
    let service: BuyersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                BuyersController,
            ],
            providers: [
                BuyersService,
                {
                    provide: PrismaService,
                    useValue: createMock<PrismaService>(),
                }
            ],
        })
            .compile();

        controller = module.get<BuyersController>(BuyersController);
        service = module.get<BuyersService>(BuyersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('find', () => {
        it('should throw a BadRequest is neither the name nor the company is given', () => {
            expect(controller.find({}))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it('should be call with unformatted args', async () => {
            const params = { name: "Yannick", size: 1 };
            service.find = jest.fn().mockImplementation(() => { });
            await controller.find(params);
            expect(service.find).toBeCalledWith(params);
        })
    })
});
