'use client'

import { useState, useEffect } from 'react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function UnsealPage() {
  const [id, setId] = useState('')
  const [secret, setSecret] = useState('')
  const [remainingReads, setRemainingReads] = useState(0)
  const [remainingTTL, setRemainingTTL] = useState(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setId(hash)
        handleUnseal(hash)
      }
    }

    // Check for hash on initial load
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange)

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleUnseal = async (secretId: string) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/unseal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: secretId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unseal secret')
      }

      setSecret(data.secret)
      setRemainingReads(data.remainingReads)
      setRemainingTTL(data.remainingTTL)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleUnseal(id)
  }

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(secret)
      } else {
        // Fallback for older browsers or non-HTTPS environments
        const textArea = document.createElement("textarea")
        textArea.value = secret
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err)
        }
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      setError('Failed to copy to clipboard. Please try again or copy manually.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Decrypt a Secret</h1>
      {!secret && (
        <>
          <div className="mb-8 p-4 glass-effect">
            <h2 className="text-xl font-semibold mb-2">How it works:</h2>
            <p className="text-white/80">
              Enter the secret ID or use the link provided to you. Once you view the secret, it may be deleted based on the settings chosen by the sender.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-white/80 mb-2">Secret ID</label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="glass-input w-full"
                placeholder="Enter the secret ID"
                required
              />
            </div>
            <button type="submit" className="cta-button primary w-full" disabled={isLoading}>
              {isLoading ? 'Unsealing...' : 'Unseal'}
            </button>
          </form>
        </>
      )}
      {secret && (
        <div className="mt-8 p-4 glass-effect">
          <h2 className="text-xl font-semibold mb-2">Decrypted Secret:</h2>
          <div className="flex items-start">
            <p className="text-white/80 break-all flex-grow mr-2">{secret}</p>
            <button
              onClick={copyToClipboard}
              className="cta-button secondary p-2 mt-1"
              aria-label="Copy to clipboard"
            >
              {copied ? <CheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-4 text-sm text-white/60">
            <p>Remaining reads: {remainingReads}</p>
            <p>Time to live: {remainingTTL} {remainingTTL === 1 ? 'day' : 'days'}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-8 p-4 glass-effect bg-red-500/10">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}