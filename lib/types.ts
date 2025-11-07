// User and Authentication Types
export interface User {
  id: number
  fullName: string
  email: string
  role: "admin" | "user"
}

export interface AuthResponse {
  id: number
  fullName: string
  email: string
  role: "admin" | "user"
}

// Product Types
export interface Product {
  sku: string
  name: string
  brand: string
  quantity: number
  price: number
  isActive: boolean
  category: string
  imageUrl: string
  description: string
}

export interface ProductFormData {
  sku: string
  name: string
  brand: string
  quantity: number
  price: number
  isActive: boolean
  category: string
  imageUrl: string
  description: string
}
