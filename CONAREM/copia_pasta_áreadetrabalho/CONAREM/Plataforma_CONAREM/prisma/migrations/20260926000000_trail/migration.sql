-- CreateTable
CREATE TABLE "QuestionProgress" (
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "wrong" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastCorrect" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionProgress_pkey" PRIMARY KEY ("userId","questionId")
);

-- CreateTable
CREATE TABLE "TrailState" (
    "userId" TEXT NOT NULL,
    "completed" JSONB NOT NULL DEFAULT '{}',
    "active" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrailState_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "QuestionProgress_userId_dueAt_idx" ON "QuestionProgress"("userId", "dueAt");

-- AddForeignKey
ALTER TABLE "QuestionProgress" ADD CONSTRAINT "QuestionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailState" ADD CONSTRAINT "TrailState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
