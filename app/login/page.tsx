'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '32px',
          width: '32px',
          borderBottom: '2px solid #2563eb'
        }}></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '448px',
        width: '100%',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>로그인</h2>
          <p style={{ marginTop: '8px', color: '#6b7280' }}>소셜 계정으로 간편하게 로그인하세요</p>
        </div>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <LoginButton provider="kakao" className="" style={{ width: '100%' }}>
            카카오 로그인
          </LoginButton>

          <LoginButton provider="naver" className="" style={{ width: '100%' }}>
            네이버 로그인
          </LoginButton>
        </div>
      </div>
    </div>
  )
}