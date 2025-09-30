'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginButtonProps {
  provider: 'kakao' | 'naver'
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function LoginButton({ provider, children, className = '', style }: LoginButtonProps) {
  const { signInWithOAuth } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      await signInWithOAuth(provider)
    } catch (error) {
      console.error(`${provider} login error:`, error)
      alert(`${provider} 로그인 중 오류가 발생했습니다.`)
    } finally {
      setLoading(false)
    }
  }

  const providerClass = provider === 'kakao'
    ? "bg-yellow-400 hover:bg-yellow-500 text-black"
    : "bg-green-500 hover:bg-green-600 text-white"

  const baseClass = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`${baseClass} ${providerClass} ${className}`}
      style={style}
    >
      {loading ? (
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '16px',
          width: '16px',
          border: '2px solid currentColor',
          borderTop: '2px solid transparent',
          marginRight: '8px'
        }}></div>
      ) : null}
      {children}
    </button>
  )
}