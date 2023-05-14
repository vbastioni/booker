import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { BuyersService } from './buyers.service';
import { FindBuyerParams } from '../_domain/buyers/find-buyers';


@Controller('buyers')
export class BuyersController {
    constructor(private readonly service: BuyersService) { }

    @Get('find')
    async find(
        @Query() query: FindBuyerParams,
    ) {
        if (!query.company && !query.name) {
            throw new BadRequestException();
        }

        return await this.service.find(query);
    }
}
