import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const updates = [
  { title: 'Ramen au miso',              prepTime: 90,  servings: 2 },
  { title: 'Tajine d\'agneau aux pruneaux', prepTime: 120, servings: 4 },
  { title: 'Tiramisu classique',          prepTime: 30,  servings: 6 },
  { title: 'Gazpacho andalou',            prepTime: 15,  servings: 4 },
  { title: 'Pad Thaï aux crevettes',      prepTime: 30,  servings: 2 },
  { title: 'Curry de pois chiches',       prepTime: 35,  servings: 4 },
  { title: 'Crème brûlée',               prepTime: 60,  servings: 4 },
  { title: 'Tacos al Pastor',             prepTime: 45,  servings: 4 },
  { title: 'Baklava',                     prepTime: 75,  servings: 12 },
  { title: 'Salade César',               prepTime: 20,  servings: 2 },
  { title: 'Moussaka grecque',            prepTime: 90,  servings: 6 },
  { title: 'Matcha Latte',               prepTime: 5,   servings: 1 },
]

for (const { title, prepTime, servings } of updates) {
  const r = await prisma.recipe.updateMany({ where: { title }, data: { prepTime, servings } })
  console.log(`${r.count > 0 ? '✓' : '✗'} ${title} — ${prepTime} min, ${servings} pers.`)
}

await prisma.$disconnect()
