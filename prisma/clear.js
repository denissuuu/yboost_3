import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

await prisma.rating.deleteMany()
await prisma.favorite.deleteMany()
await prisma.recipe.deleteMany()
await prisma.user.deleteMany()
console.log('✅ Base nettoyée')
await prisma.$disconnect()
