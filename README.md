# Where's Waldo (Photo Tagging App)

This project is based on Odin Project requirements which could be found [here](https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app).
A full-stack photo tagging application inspired by the classic "Where's Waldo?" game, built with Node.js and PostgreSQL. Players must find specific characters in a crowded illustration while competing for the fastest completion time.

## 🎮 Features

- Interactive photo tagging interface
- Real-time validation of character selections
- Targeting box with character dropdown menu
- Score tracking based on completion time
- High score system with user names
- Responsive design supporting multiple screen sizes
- Coordinate normalization for consistent experience across devices

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Package Manager**: NPM

## 📋 Prerequisites

- Node.js (v14 or higher)
- NPM
- PostgreSQL database

## ⚙️ Installation

1. Clone the repository:
```bash
git clone [your-repo-link]
cd wheres-waldo
```

2. Install dependencies in both frontend and backend folders:
```bash
cd frontend
npm install

cd ../backend
npm install
```

3. Set up your PostgreSQL database and update the `.env` file in the backend folder:
```
DATABASE_URL="postgresql://user:password@localhost:5432/waldo_db"
```

4. Run Prisma migrations:
```bash
cd backend
npx prisma migrate dev
```

5. Start the servers:

For frontend (in the frontend folder):
```bash
npm run dev
```

For backend (in the backend folder):
```bash
node index.js
```

The application will be running on localhost with the frontend and backend on separate ports.

## 🗄️ Database Structure

The application uses PostgreSQL with Prisma ORM with the following schema:

### Character Model
```prisma
model Character {
  id              Int       @id @default(autoincrement())
  name            String
  xPositionStart  Float     @map("x_position_start")
  xPositionEnd    Float     @map("x_position_end")
  yPositionStart  Float     @map("y_position_start")
  yPositionEnd    Float     @map("y_position_end")
  gameId          Int       @map("game_id")
  game            Game      @relation(fields: [gameId], references: [id])
  characterFinds  CharacterFind[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([gameId])
}
```

### Game Model
```prisma
model Game {
  id              Int       @id @default(autoincrement())
  name            String
  imageUrl        String    @map("image_url")
  difficulty      String
  characters      Character[]
  gameSessions    GameSession[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### GameSession Model
```prisma
model GameSession {
  id              Int       @id @default(autoincrement())
  playerName      String    @map("player_name")
  gameId          Int       @map("game_id")
  game            Game      @relation(fields: [gameId], references: [id])
  startTime       DateTime  @default(now())
  endTime         DateTime?
  characterFinds  CharacterFind[]
  completed       Boolean   @default(false)

  @@index([gameId])
}
```

### CharacterFind Model
```prisma
model CharacterFind {
  id              Int          @id @default(autoincrement())
  characterId     Int          @map("character_id")
  character       Character    @relation(fields: [characterId], references: [id])
  gameSessionId   Int          @map("game_session_id")
  gameSession     GameSession  @relation(fields: [gameSessionId], references: [id])
  foundAt         DateTime     @default(now())

  @@index([characterId])
  @@index([gameSessionId])
}
```

## 🎯 Game Logic

1. **Image Loading**
   - Large illustration loads with hidden characters
   - Timer starts automatically on image load

2. **Character Selection**
   - Click anywhere on the image to open targeting box
   - Select character from dropdown menu
   - Coordinates are normalized for different screen sizes

3. **Validation**
   - Backend validates character position
   - Provides feedback for correct/incorrect selections
   - Places marker for correct selections

4. **Game Completion**
   - Timer stops when all characters are found
   - Prompts user for name if high score achieved
   - Records score in database

## 🔐 Security Features

- Server-side time tracking to prevent score manipulation
- Secure validation of character positions
- Anonymous user tracking system


## 🙏 Acknowledgments

- The Odin Project for the project requirements
- Original Where's Waldo concept