// Challenge 26 — Capstone: Feature 3 — Real-Time Polling
//
// Shows the last time project data was synced with the server.
// Updates every second so the "X seconds ago" text stays accurate.
// Briefly shows a "Data updated" flash when dataUpdatedAt changes.

import { useState, useEffect, useRef } from 'react'
import { useProjects } from '../hooks/queries/useProjects'

function formatRelativeTime(timestamp: number): string {
  if (timestamp === 0) return 'Never'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

export function SyncIndicator() {
  const { dataUpdatedAt, isFetching } = useProjects()

  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(dataUpdatedAt),
  )
  const [showFlash, setShowFlash] = useState(false)
  const prevUpdatedAt = useRef(dataUpdatedAt)

  // Update the relative time label every second
  useEffect(() => {
    const id = setInterval(() => {
      setRelativeTime(formatRelativeTime(dataUpdatedAt))
    }, 1000)
    return () => clearInterval(id)
  }, [dataUpdatedAt])

  // Flash "Data updated" when dataUpdatedAt changes (a new refetch completed)
  useEffect(() => {
    if (dataUpdatedAt !== prevUpdatedAt.current && prevUpdatedAt.current !== 0) {
      setShowFlash(true)
      const id = setTimeout(() => setShowFlash(false), 2500)
      prevUpdatedAt.current = dataUpdatedAt
      return () => clearTimeout(id)
    }
    prevUpdatedAt.current = dataUpdatedAt
  }, [dataUpdatedAt])

  return (
    <div className="sync-indicator" aria-live="polite" aria-atomic="false">
      {showFlash ? (
        <span className="sync-indicator__flash" role="status">
          Data updated
        </span>
      ) : (
        <span className="sync-indicator__time">
          {isFetching ? (
            <span className="sync-indicator__refreshing" aria-label="Refreshing data">
              <span className="sync-indicator__spinner" aria-hidden="true" />
              Syncing...
            </span>
          ) : (
            <>Synced: {relativeTime}</>
          )}
        </span>
      )}
    </div>
  )
}

export default SyncIndicator
