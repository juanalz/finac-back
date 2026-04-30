import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { Prisma, PrismaClient } from '../prisma/prisma-client/client';
import { seedCategories } from './seeders/categories.seeder';

const prisma = new PrismaClient();

// async function createUsers(tx: Prisma.TransactionClient) {
//   const password = '$2b$10$PjReZjiztFbzgz3HlVL/MuSpMwm8o265DxJ6Jb84RB6S0BDIxFmRW';

//   const usersArray = Array.from({ length: 5 }).map(() => ({
//     id: faker.string.uuid(),
//     username: faker.internet.username().toLowerCase(),
//     email: faker.internet.email().toLowerCase(),
//     password,
//     isActive: true,
//   }));

//   const users = await Promise.all(
//     usersArray.map(userData =>
//       tx.user.create({
//         data: userData,
//       }),
//     ),
//   );

//   console.log(`✅ Created ${users.length} users`);

//   const usersDetailsData = Array.from({ length: 5 }).map((_: unknown, index: number) => ({
//     document: faker.string.numeric(10),
//     firstName: faker.person.firstName(),
//     secondName: faker.datatype.boolean() ? faker.person.firstName() : undefined,
//     lastName: faker.person.lastName(),
//     secondLastName: faker.datatype.boolean() ? faker.person.lastName() : undefined,
//     birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
//     phone: faker.phone.number(),
//     userId: usersArray[index].id,
//   }));

//   const usersDetails = await Promise.all(
//     usersDetailsData.map(userDetailsData =>
//       tx.userDetail.create({
//         data: userDetailsData,
//       }),
//     ),
//   );

//   console.log(`✅ Created ${usersDetails.length} user details`);
//   return users;
// }

async function main() {
  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
    //   await createUsers(tx);
      await seedCategories(tx);
    },
    { timeout: 100000 },
  );
  console.info('✅ Mock data created successfully');
}

main()
  .catch(e => {
    console.error('❌ Error creating mock data:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
