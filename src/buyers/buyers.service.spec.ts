import { createMock } from "@golevelup/ts-jest";
import { BuyersService } from "./buyers.service";
import { PrismaService } from "nestjs-prisma";
import { Test, TestingModule } from "@nestjs/testing";
import { FindBuyerParamsDTO, buildArgs } from "../_domain/buyers/find-buyers-dto";
import { Prisma } from "@prisma/client";

describe('BuyersService', () => {
    let service: BuyersService;
    let prisma = createMock<PrismaService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: prisma,
                },
                BuyersService,
            ],
        }).compile();

        service = module.get<BuyersService>(BuyersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        it("should query with arguments formatted by `buildArgs`", async () => {
            for (const params of [{
                name: "Georges",
            }, {
                name: "Georges",
                company: "Vuitton",
                offset: 0,
                size: 1,
            }] as FindBuyerParamsDTO[]) {
                const args: Prisma.BuyerFindManyArgs = buildArgs(params);
                prisma.buyer.findMany = jest.fn().mockReturnValue({
                    name: "Georges",
                    company: "Vuitton",
                    id: 1,
                });
                await service.find(params);
                expect(prisma.buyer.findMany).toBeCalledWith(args);
            }
        });
    });
});
