-- CreateTable
CREATE TABLE "Click" (
    "id" SERIAL NOT NULL,
    "shortenerId" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "country" TEXT,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_shortenerId_fkey" FOREIGN KEY ("shortenerId") REFERENCES "shortener"("id") ON DELETE CASCADE ON UPDATE CASCADE;
