


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function main() {
  // Create a game
  const game = await prisma.game.create({
    data: {
      name: 'General Scene',
      imageUrl: '/images/waldo2.jpg',
      difficulty: 'hard',
      characters: {
        create: [
           {
            name: 'Waldo',
            xPositionStart: 79.65,  // These are percentages of image width
            xPositionEnd: 81.38,
            yPositionStart: 0.08,  // These are percentages of image height
            yPositionEnd: .1223
            },
            {
                name: 'Frog',
                xPositionStart: 84.5 ,  // These are percentages of image width
                xPositionEnd: 94.19,
                yPositionStart: 85.50,  // These are percentages of image height
                yPositionEnd: 95.55
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