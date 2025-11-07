import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = 'https://backend-ecommerce-mock.onrender.com/api/auth/login'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: response.status === 401 ? 'Invalid credentials' : 'Authentication failed'
      }))
      return NextResponse.json(
        { error: error.error || 'Authentication failed' },
        { status: response.status }
      )
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error('[AUTH] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
