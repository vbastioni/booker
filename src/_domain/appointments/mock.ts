import { Appointment } from "@prisma/client";

export const defaultAppointment: Appointment = {
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

export const allAppointments: Appointment[] = [
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

export function mockAppointment(apt: Partial<Appointment> = {}): Appointment {
    return {
        ...defaultAppointment,
        ...apt,
    };
}
