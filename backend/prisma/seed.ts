import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding database...');

  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('dUmmyPass456!', 12);

  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Wonderland',
      passwordHash,
      trips: {
        create: [
          {
            title: 'Weekend in Vienna',
            destination: 'Vienna, Austria',
            startDate: new Date('2026-05-10T00:00:00.000Z'),
            endDate: new Date('2026-05-12T00:00:00.000Z'),
            isPublic: true,
            coverImage: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1000&auto=format&fit=crop',
            days: {
              create: [
                {
                  date: new Date('2026-05-10T00:00:00.000Z'),
                  order: 0,
                  activities: {
                    create: [
                      {
                        title: 'Arrive at Hotel',
                        time: '14:00',
                        order: 0,
                        address: '1010 Vienna, Austria',
                      },
                      {
                        title: 'Visit Schönbrunn Palace',
                        time: '15:30',
                        order: 1,
                        cost: 22.0,
                        lat: 48.1848,
                        lng: 16.3122,
                        notes: 'Buy tickets online to skip the line.',
                      },
                    ],
                  },
                },
                {
                  date: new Date('2026-05-11T00:00:00.000Z'),
                  order: 1,
                  activities: {
                    create: [
                      {
                        title: 'Coffee at Cafe Central',
                        time: '09:00',
                        order: 0,
                        cost: 15.5,
                        lat: 48.2106,
                        lng: 16.3655,
                      },
                      {
                        title: 'Prater Amusement Park',
                        time: '13:00',
                        order: 1,
                        notes: 'Ride the Giant Ferris Wheel.',
                      },
                    ],
                  },
                },
                {
                  date: new Date('2026-05-12T00:00:00.000Z'),
                  order: 2,
                  activities: {
                    create: [
                      {
                        title: 'Train to Airport',
                        time: '10:00',
                        order: 0,
                        cost: 4.5,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Database has been seeded. Created user with email: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });