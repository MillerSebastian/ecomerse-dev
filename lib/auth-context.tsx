"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    console.log('Starting login process...')
    setLoading(true)
    try {
      console.log('Sending login request to local API...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)
      
      if (!response.ok) {
        let errorMessage = 'Error al iniciar sesión'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
          console.error('Login error response:', errorData)
        } catch (e) {
          console.error('Failed to parse error response:', e)
          errorMessage = response.status === 401 ? 'Credenciales inválidas' : `Error del servidor (${response.status})`
        }
        throw new Error(errorMessage)
      }

      console.log('Login successful, parsing response...')
      let userData
      try {
        userData = await response.json()
        console.log('User data received:', userData)
      } catch (e) {
        console.error('Failed to parse user data:', e)
        throw new Error('Error al procesar la respuesta del servidor')
      }
      
      // Extract user data from the nested structure
      const userToStore = userData.user || userData;
      
      if (!userToStore || !userToStore.id) {
        console.error('Invalid user data format:', userData);
        throw new Error('Datos de usuario inválidos recibidos del servidor');
      }
      
      console.log('Updating user state and localStorage...', { userToStore });
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore))
      console.log('Login process completed successfully')
      return userData
    } catch (error) {
      console.error('Auth error:', error)
      throw error
    } finally {
      console.log('Login process finished, setting loading to false')
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
