import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { Response } from 'express';
import { FindBuyerParams } from '../_domain/buyer/find';


@Controller('buyers')
export class BuyersController {
    constructor(private readonly service: BuyersService) { }

    @Get() async buyers() { return await this.service.all(); }

    @Get('find')
    async getBy(
        @Query() query: FindBuyerParams,
        @Res() response: Response,
    ) {
        if (!query.company && !query.name) {
            response.json({ statusCode: HttpStatus.BAD_REQUEST }).send();
            return;
        }

        const values = await this.service.findBuyersBy(query);
        response.json(values).send();
    }
}
