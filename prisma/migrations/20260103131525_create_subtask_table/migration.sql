-- CreateTable
CREATE TABLE "subtasks" (
    "identifier" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskIdentifier" TEXT NOT NULL,
    "userIdentifier" TEXT NOT NULL,

    CONSTRAINT "subtasks_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_taskIdentifier_fkey" FOREIGN KEY ("taskIdentifier") REFERENCES "tasks"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
