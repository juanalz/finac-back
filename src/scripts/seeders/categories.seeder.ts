import { faker } from '@faker-js/faker';
import { Prisma } from '../../prisma/prisma-client/client';

export async function seedCategories(tx: Prisma.TransactionClient) {

  const categoriesArray = [
      { name: 'Hogar', emoji: '🏠' },
      { name: 'Salud', emoji: '🏥' },
      { name: 'Entretenimiento', emoji: '🎮' },
      { name: 'Alimentación', emoji: '🍔' },
      { name: 'Transporte', emoji: '🚌' },
      { name: 'Educación', emoji: '📚' },
      { name: 'Ropa', emoji: '👗' },
      { name: 'Otros', emoji: '📦' },
  ];

  const categoriesData = [];

  for (const category of categoriesArray) {
    categoriesData.push({
      id: faker.string.uuid(),
      name: category.name,
      emoji: category.emoji,
    });
  }

  const categories = await Promise.all(categoriesData.map(data => tx.category.create({ data })));

  console.log(`✅ Created/updated ${categories.length} categories`);
  return categories;
}
