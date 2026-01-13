-- CreateTable
CREATE TABLE "comments" (
    "identifier" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorIdentifier" TEXT NOT NULL,
    "taskIdentifier" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorIdentifier_fkey" FOREIGN KEY ("authorIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_taskIdentifier_fkey" FOREIGN KEY ("taskIdentifier") REFERENCES "tasks"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
