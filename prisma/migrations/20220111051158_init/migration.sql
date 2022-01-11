-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "SolutionGradingStatus" AS ENUM ('IN_QUEUE', 'PROCESSING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT E'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "gradingStatus" "SolutionGradingStatus" NOT NULL DEFAULT E'IN_QUEUE',
    "gradingResult" TEXT,
    "authorUsername" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_authorUsername_fkey" FOREIGN KEY ("authorUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
