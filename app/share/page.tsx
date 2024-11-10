'use client'

import { useState, useEffect } from 'react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function SharePage() {
  const [secret, setSecret] = useState('')
  const [reads, setReads] = useState(1)
  const [ttl, setTTL] = useState(1)
  const [shareLink, setShareLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!secret.trim()) {
      setError('Secret cannot be empty')
      return
    }

    setIsLoading(true)
    setError('')
    setShareLink('')

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secret.trim(),
          reads,
          ttl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share secret')
      }

      if (!data.id) {
        throw new Error('Invalid server response')
      }

      setShareLink(`${window.location.origin}/unseal#${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share secret')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink)
      } else {
        // Fallback for older browsers or non-HTTPS environments
        const textArea = document.createElement("textarea")
        textArea.value = shareLink
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Share a Secret</h1>
      
      <div className="mb-8 p-6 glass-effect bg-[rgba(15,22,36,0.6)] border border-white/10 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How it works:</h2>
        <ul className="space-y-4 text-white/80">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong className="text-white">Reads:</strong> Set the number of times the secret can be viewed (max 10) before it's automatically deleted.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              <strong className="text-white">TTL (Time To Live):</strong> Set the number of days (max 7) the secret will exist before it's automatically deleted, regardless of the number of reads.
            </span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleShare} className="space-y-6">
        <div>
          <label htmlFor="secret" className="block text-sm font-medium text-white/80 mb-2">Your Secret</label>
          <textarea
            id="secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="glass-input w-full h-32"
            placeholder="Enter your secret here..."
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="reads" className="block text-sm font-medium text-white/80 mb-2">Reads (1-10)</label>
            <input
              type="number"
              id="reads"
              value={reads}
              onChange={(e) => setReads(Math.min(10, Math.max(1, parseInt(e.target.value))))}
              className="glass-input w-full"
              min="1"
              max="10"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="ttl" className="block text-sm font-medium text-white/80 mb-2">TTL (1-7 days)</label>
            <input
              type="number"
              id="ttl"
              value={ttl}
              onChange={(e) => setTTL(Math.min(7, Math.max(1, parseInt(e.target.value))))}
              className="glass-input w-full"
              min="1"
              max="7"
              required
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="cta-button primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sharing...' : 'Share Secret'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 glass-effect bg-red-500/10">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {shareLink && (
        <div className="mt-8 p-4 glass-effect">
          <h2 className="text-xl font-semibold mb-2">Share this link:</h2>
          <div className="flex items-center">
            <p className="text-white/80 break-all flex-grow mr-2">{shareLink}</p>
            <button
              onClick={copyToClipboard}
              className="cta-button secondary p-2"
              aria-label="Copy to clipboard"
            >
              {copied ? <CheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}