import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { FindBuyerParamsDTO, buildArgs } from '../_domain/buyers/find-buyers-dto';


@Injectable()
export class BuyersService {
    constructor(private readonly prisma: PrismaService) { }

    async find(params: FindBuyerParamsDTO) {
        return this.prisma.buyer.findMany(buildArgs(params));
    }
}
