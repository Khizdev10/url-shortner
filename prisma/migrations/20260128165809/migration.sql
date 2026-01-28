-- CreateTable
CREATE TABLE "shortener" (
    "id" SERIAL NOT NULL,
    "longUrl" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,

    CONSTRAINT "shortener_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shortener_alias_key" ON "shortener"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "shortener_shortUrl_key" ON "shortener"("shortUrl");
