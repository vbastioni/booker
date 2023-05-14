import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { BuyersModule } from './buyers/buyers.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot(), AppointmentsModule, BuyersModule],
})
export class AppModule {}
