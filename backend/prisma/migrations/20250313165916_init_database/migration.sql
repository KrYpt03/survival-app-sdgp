-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('OUT_OF_RANGE', 'HELP_REQUEST');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "clerkID" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLatitude" DOUBLE PRECISION,
    "lastLongitude" DOUBLE PRECISION,
    "teamID" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Team" (
    "teamID" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "teamCode" TEXT NOT NULL,
    "range" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "leaderID" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamID")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "locationID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("locationID")
);

-- CreateTable
CREATE TABLE "Alert" (
    "alertID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "teamID" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "lastLatitude" DOUBLE PRECISION NOT NULL,
    "lastLongitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("alertID")
);

-- CreateTable
CREATE TABLE "EmergencyAlert" (
    "alertID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "teamID" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyAlert_pkey" PRIMARY KEY ("alertID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkID_key" ON "User"("clerkID");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamCode_key" ON "Team"("teamCode");

-- CreateIndex
CREATE UNIQUE INDEX "Team_leaderID_key" ON "Team"("leaderID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("teamID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leaderID_fkey" FOREIGN KEY ("leaderID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("teamID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAlert" ADD CONSTRAINT "EmergencyAlert_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAlert" ADD CONSTRAINT "EmergencyAlert_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("teamID") ON DELETE RESTRICT ON UPDATE CASCADE;
