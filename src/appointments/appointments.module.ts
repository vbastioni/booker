import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService]
})
export class AppointmentsModule { }
