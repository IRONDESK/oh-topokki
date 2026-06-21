'use client'

import { useAuth } from '@/shared/context/AuthContext'
import { useState } from 'react'

interface LogoutButtonProps {
  children: React.ReactNode
  className?: string
}

export default function LogoutButton({ children, className = '' }: LogoutButtonProps) {
  const { signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
      )}
      {children}
    </button>
  )
}