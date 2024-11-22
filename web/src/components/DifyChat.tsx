'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Import the CSS file
import '@mxmweb/difychat/style.css'

const DynamicDifyChat = dynamic(
  () => import('@mxmweb/difychat').then((mod) => mod.MxMChat),
  {
    ssr: false,
    loading: () => <div>Loading chat...</div>
  }
)

interface DifyChatWrapperProps {
  url: string
  token: string
  mock: boolean
}

export default function DifyChatWrapper({ url, token, mock }: DifyChatWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (error) {
    return <div>Error loading chat: {error.message}</div>
  }

  return (
    <ErrorBoundary onError={(error) => setError(error)}>
      <DynamicDifyChat url={url} token={token} mock={mock} />
    </ErrorBoundary>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}