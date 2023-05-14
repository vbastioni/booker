import { AppointmentType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const reseed = Boolean(process.env.PRISMA_RESEED);
    if (reseed) {
        await prisma.vendor.deleteMany();
        await prisma.buyer.deleteMany();
        await prisma.appointment.deleteMany();
    }

    await prisma.vendor.create({
        data: {
            id: 1,
            name: "John Doe",
        },
    });
    await prisma.buyer.create({
        data: {
            id: 1,
            name: "Georges",
            company: "Vuitton",
        },
    });
    await prisma.appointment.create({
        data: {
            title: "Discussion & proposition",
            type: AppointmentType.VIRTUAL,
            link: "https://meet.google.com/rand-url-value",
            hostId: 1,
            buyerId: 1,
            startTime: new Date(2023, 5, 15, 16),
            endTime: new Date(2023, 5, 15, 16, 30),
        }
    });
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });