import crypto from 'crypto'

// We need a 32-byte key for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16
const ALGORITHM = 'aes-256-cbc'

export function encrypt(text: string): string {
  try {
    // Generate a new IV for each encryption
    const iv = crypto.randomBytes(IV_LENGTH)
    
    // Create cipher with key and iv
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    // Return iv:encrypted
    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export function decrypt(text: string): string {
  try {
    // Split iv and encrypted text
    const [ivHex, encryptedHex] = text.split(':')
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted text format')
    }

    // Convert hex strings to buffers
    const iv = Buffer.from(ivHex, 'hex')
    const key = Buffer.from(ENCRYPTION_KEY, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    
    // Decrypt the text
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    return decrypted.toString('utf8')
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}