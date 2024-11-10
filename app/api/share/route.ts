import { NextResponse } from 'next/server'
import { createClient } from 'redis'
import { v4 as uuidv4 } from 'uuid'
import { encrypt } from '../../../utils/encryption'

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
})

export async function POST(request: Request) {
  if (!client.isOpen) {
    await client.connect()
  }

  try {
    const { secret, reads, ttl } = await request.json()

    if (!secret || typeof reads !== 'number' || typeof ttl !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const id = uuidv4()
    const encryptedSecret = encrypt(secret)
    const expirationTime = Math.min(ttl, 7) * 24 * 60 * 60 // Max 7 days
    const maxReads = Math.min(reads, 10) // Max 10 reads

    await client.set(id, JSON.stringify({
      secret: encryptedSecret,
      reads: maxReads,
      ttl: expirationTime,
      createdAt: Date.now()
    }), {
      EX: expirationTime
    })

    return NextResponse.json({ id })
  } catch (error) {
    console.error('Error sharing secret:', error)
    return NextResponse.json({ error: 'Failed to share secret' }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}