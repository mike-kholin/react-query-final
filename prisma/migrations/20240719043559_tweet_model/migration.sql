-- CreateTable
CREATE TABLE "Tweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL
);
