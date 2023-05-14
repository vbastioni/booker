// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

// Test format based on https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { PrismaModule } from 'nestjs-prisma';
import { AppointmentsModule } from './../src/appointments/appointments.module';
import { AppointmentsService } from './../src/appointments/appointments.service';

const defaultAppointment: Appointment = {
  buyerId: 1,
  hostId: 1,
  id: 1,
  link: "https://meet.google.com/ocd-grus-hze?hs=224",
  location: null,
  title: "Discussion modaresa",
  type: "VIRTUAL",
  startTime: new Date("2023-06-15T14:00:00.000Z"),
  endTime: new Date("2023-06-15T14:30:00.000Z"),
};

const allAppointments: Appointment[] = [
  defaultAppointment,
  mockAppointment({
    id: 2,
    startTime: new Date("2023-06-15T15:00:00.000Z"),
    endTime: new Date("2023-06-15T15:30:00.000Z"),
  }),
  mockAppointment({
    id: 3,
    startTime: new Date("2023-06-15T15:30:00.000Z"),
    endTime: new Date("2023-06-15T16:00:00.000Z"),
  }),
];

function mockAppointment(apt: Partial<Appointment>): Appointment {
  return {
    ...defaultAppointment,
    ...apt,
  };
}

describe('appointments', () => {
  let app: INestApplication;
  let service = {
    all: async (day?: Date) => {
      if (typeof day === "string") {
        day = new Date(day);
      }
      if (day === undefined) {
        day = new Date("2023-06-15");
      }
      const beg = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const end = new Date(beg);
      end.setDate(beg.getDate() + 1);

      return allAppointments
        .filter(({ startTime, endTime }) => (endTime >= beg && startTime < end));
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppointmentsModule],
    })
      .overrideProvider(AppointmentsService)
      .useValue(service)
      .compile();

    app = moduleRef.createNestApplication();
    app.init();
  });

  it(`/GET appointments - no param`, () => {
    return request(app.getHttpServer())
      .get('/appointments')
      .expect(200)
      .expect(JSON.stringify(allAppointments));
  });

  it(`/GET appointments - no appointment this date`, () => {
    return request(app.getHttpServer())
      .get('/appointments?day=2023-06-16')
      .expect(200)
      .expect(JSON.stringify([]));
  });

  it(`/GET appointments - all appointment this date`, () => {
    return request(app.getHttpServer())
      .get('/appointments?day=2023-06-15')
      .expect(200)
      .expect(JSON.stringify(allAppointments));
  });

  afterAll(async () => {
    await app.close();
  });
});