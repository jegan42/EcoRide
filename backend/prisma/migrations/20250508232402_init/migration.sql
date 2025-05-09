-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "id_google" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "token_jwt" TEXT NOT NULL,
    "token_google_access" TEXT,
    "token_google_refresh" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_google_key" ON "users"("id_google");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
