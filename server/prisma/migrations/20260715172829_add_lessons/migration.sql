-- CreateTable
CREATE TABLE "Lesson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lessonType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "startHour" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL
);
