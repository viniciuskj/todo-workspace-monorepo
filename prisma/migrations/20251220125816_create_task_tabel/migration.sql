-- CreateTable
CREATE TABLE "tasks" (
    "identifier" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userIdentifier" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
