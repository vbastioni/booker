-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('VIRTUAL', 'PHYSICAL');

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "location" TEXT,
    "link" TEXT,
    "hostId" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_id_key" ON "Vendor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_id_key" ON "Buyer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
