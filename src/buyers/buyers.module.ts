import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';

@Module({
  imports: [PrismaModule],
  controllers: [BuyersController],
  providers: [BuyersService]
})
export class BuyersModule {}
