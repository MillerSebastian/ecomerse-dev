const API_BASE = "https://backend-ecommerce-mock.onrender.com/api"

const handleFetchError = (error: unknown, context: string) => {
  if (error instanceof TypeError) {
    console.log(`[v0] ${context} - Network/CORS Error:`, error.message)
    // "Failed to fetch" is typically a CORS error
    return new Error(`Network error (${context}): Possible CORS issue or backend unavailable`)
  }
  return error
}

export const apiClient = {
  async login(email: string, password: string) {
    try {
      console.log("[v0] Attempting login with:", email)
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Invalid credentials" }))
        console.log("[v0] Login error:", error)
        throw new Error(error.error || "Invalid credentials")
      }

      const data = await res.json()
      console.log("[v0] Login successful:", data)
      return data
    } catch (error) {
      console.log("[v0] Login fetch error:", error)
      throw handleFetchError(error, "login")
    }
  },

  async getProducts() {
    try {
      console.log("[v0] Fetching products from:", `${API_BASE}/products`)
      const res = await fetch(`${API_BASE}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      console.log("[v0] Products response status:", res.status)

      if (!res.ok) {
        console.log("[v0] Response not OK. Status:", res.status)
        throw new Error(`Failed to fetch products: ${res.status}`)
      }

      const response = await res.json()
      console.log("[v0] Products fetched successfully:", response)
      // Extract the products array from the response
      return response.data || []
    } catch (error) {
      console.log("[v0] Get products error:", error)
      throw handleFetchError(error, "getProducts")
    }
  },

  async getProduct(sku: string) {
    try {
      const res = await fetch(`${API_BASE}/products/${sku}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Product not found")
      }

      return res.json()
    } catch (error) {
      console.log("[v0] Get product error:", error)
      throw handleFetchError(error, "getProduct")
    }
  },

  async createProduct(data: any) {
    try {
      console.log("[v0] Creating product:", data)
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to create product" }))
        throw new Error(error.error || "Failed to create product")
      }

      return res.json()
    } catch (error) {
      console.log("[v0] Create product error:", error)
      throw handleFetchError(error, "createProduct")
    }
  },

  async updateProduct(sku: string, data: any) {
    try {
      console.log("[v0] Updating product:", sku, data)
      const res = await fetch(`${API_BASE}/products/${sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to update product" }))
        throw new Error(error.error || "Failed to update product")
      }

      return res.json()
    } catch (error) {
      console.log("[v0] Update product error:", error)
      throw handleFetchError(error, "updateProduct")
    }
  },

  async deleteProduct(sku: string) {
    try {
      console.log("[v0] Deleting product:", sku)
      const res = await fetch(`${API_BASE}/products/${sku}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to delete product" }))
        throw new Error(error.error || "Failed to delete product")
      }

      return res.json()
    } catch (error) {
      console.log("[v0] Delete product error:", error)
      throw handleFetchError(error, "deleteProduct")
    }
  },
}
