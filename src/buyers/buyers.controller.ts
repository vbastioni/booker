import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { BuyersService } from './buyers.service';
import { FindBuyerParamsDTO } from '../_domain/buyers/find-buyers-dto';

@Controller('buyers')
export class BuyersController {
    constructor(private readonly service: BuyersService) { }

    @Get('find')
    async find(
        @Query() query: FindBuyerParamsDTO,
    ) {
        const requireOne: (keyof FindBuyerParamsDTO)[] = ["company", 'name'];
        if (!requireOne.some((k) => query[k] !== undefined)) {
            throw new BadRequestException();
        }

        return await this.service.find(query);
    }
}
