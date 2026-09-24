-- CreateTable
CREATE TABLE "ConnectionProbe" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionProbe_pkey" PRIMARY KEY ("id")
);
