


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function main() {
  // Create a game
  const game = await prisma.game.create({
    data: {
      name: 'Beach Scene',
      imageUrl: '/images/waldo1.jpg',
      difficulty: 'medium',
      characters: {
        create: [
           {
            name: 'Waldo',
            xPositionStart: 64.65,  // These are percentages of image width
            xPositionEnd: 68.38,
            yPositionStart: 87.05,  // These are percentages of image height
            yPositionEnd: 100.0
            },
            {
                name: 'Lonely sailor',
                xPositionStart: 71.92,  // These are percentages of image width
                xPositionEnd: 80.19,
                yPositionStart: 26.50,  // These are percentages of image height
                yPositionEnd: 34.55
              },
              {
                name: 'Water skier',
                xPositionStart: 32.41,  // These are percentages of image width
                xPositionEnd: 36.74,
                yPositionStart: 24.58,  // These are percentages of image height
                yPositionEnd: 31.19
              }
          // Add other characters...
        ]
      }
    }
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });