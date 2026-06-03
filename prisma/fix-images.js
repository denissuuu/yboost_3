import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const fixes = [
  {
    title: 'Gazpacho andalou',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
  },
  {
    title: 'Moussaka grecque',
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80',
  },
]

for (const { title, imageUrl } of fixes) {
  const updated = await prisma.recipe.updateMany({
    where: { title },
    data: { imageUrl },
  })
  console.log(`${updated.count > 0 ? '✓' : '✗'} ${title}`)
}

await prisma.$disconnect()
