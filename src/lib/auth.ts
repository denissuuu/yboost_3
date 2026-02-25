import crypto from "crypto"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

const COOKIE_NAME = "yboost_session"

function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex")
}

export async function createSession(userId: string) {
  const rawToken = crypto.randomBytes(32).toString("hex")
  const token = hashToken(rawToken)

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

  await prisma.session.create({
    data: { token, userId, expiresAt },
  })

  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const rawToken = cookieStore.get(COOKIE_NAME)?.value
  if (!rawToken) return null

  const token = hashToken(rawToken)

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) return null
  if (session.expiresAt < new Date()) return null

  return session.user
}

export async function destroySession() {
  const cookieStore = cookies()
  const rawToken = cookieStore.get(COOKIE_NAME)?.value

  if (rawToken) {
    const token = hashToken(rawToken)
    await prisma.session.deleteMany({ where: { token } })
  }

  cookieStore.delete(COOKIE_NAME)
}