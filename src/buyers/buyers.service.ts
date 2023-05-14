import { Injectable } from '@nestjs/common';
import { Prisma } from '.prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { FindBuyerParams, buildArgs } from '../_domain/buyer/find';


@Injectable()
export class BuyersService {
    constructor(private readonly prisma: PrismaService) { }

    async all() {
        return this.prisma.buyer.findMany();
    }

    async findBuyersBy(params: FindBuyerParams) {
        return this.prisma.buyer.findMany(buildArgs(params));
    }
}
