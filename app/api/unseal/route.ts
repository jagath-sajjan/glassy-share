import { NextResponse } from 'next/server'
import { createClient } from 'redis'
import { decrypt } from '../../../utils/encryption'

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
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing secret ID' }, { status: 400 })
    }

    const data = await client.get(id)
    if (!data) {
      return NextResponse.json({ error: 'Secret not found or has expired' }, { status: 404 })
    }

    const { secret: encryptedSecret, reads, ttl, createdAt } = JSON.parse(data)
    
    if (reads <= 0) {
      await client.del(id)
      return NextResponse.json({ error: 'All reads for this secret have been exhausted' }, { status: 410 })
    }

    const decryptedSecret = decrypt(encryptedSecret)
    const remainingReads = reads - 1
    const remainingTTL = Math.max(0, Math.floor((createdAt + ttl * 1000 - Date.now()) / 1000))

    if (remainingReads > 0 && remainingTTL > 0) {
      await client.set(id, JSON.stringify({ 
        secret: encryptedSecret, 
        reads: remainingReads, 
        ttl, 
        createdAt 
      }), {
        EX: remainingTTL
      })
    } else {
      await client.del(id)
    }

    return NextResponse.json({ 
      secret: decryptedSecret, 
      remainingReads, 
      remainingTTL: Math.floor(remainingTTL / (24 * 60 * 60)) // Convert to days
    })
  } catch (error) {
    console.error('Error unsealing secret:', error)
    return NextResponse.json({ error: 'Failed to unseal secret' }, { status: 500 })
  } finally {
    await client.disconnect()
  }
}