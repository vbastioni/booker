import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { FindBuyerParams, buildArgs } from '../_domain/buyers/find-buyers';


@Injectable()
export class BuyersService {
    constructor(private readonly prisma: PrismaService) { }

    async find(params: FindBuyerParams) {
        return this.prisma.buyer.findMany(buildArgs(params));
    }
}
