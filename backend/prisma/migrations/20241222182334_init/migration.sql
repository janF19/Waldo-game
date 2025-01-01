-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "x_position_start" DOUBLE PRECISION NOT NULL,
    "x_position_end" DOUBLE PRECISION NOT NULL,
    "y_position_start" DOUBLE PRECISION NOT NULL,
    "y_position_end" DOUBLE PRECISION NOT NULL,
    "game_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" SERIAL NOT NULL,
    "player_name" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterFind" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "game_session_id" INTEGER NOT NULL,
    "foundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterFind_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Character_game_id_idx" ON "Character"("game_id");

-- CreateIndex
CREATE INDEX "GameSession_game_id_idx" ON "GameSession"("game_id");

-- CreateIndex
CREATE INDEX "CharacterFind_character_id_idx" ON "CharacterFind"("character_id");

-- CreateIndex
CREATE INDEX "CharacterFind_game_session_id_idx" ON "CharacterFind"("game_session_id");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterFind" ADD CONSTRAINT "CharacterFind_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterFind" ADD CONSTRAINT "CharacterFind_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "GameSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
