"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Product, ProductFormData } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Edit2, Plus, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.getProducts()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setError(error instanceof Error ? error.message : "Error al cargar productos")
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "admin") {
      fetchProducts()
    }
  }, [user])

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true)
      if (selectedProduct) {
        await apiClient.updateProduct(selectedProduct.sku, data)
        setProducts((prev) => prev.map((p) => (p.sku === selectedProduct.sku ? (data as Product) : p)))
      } else {
        await apiClient.createProduct(data)
        const newProducts = await apiClient.getProducts()
        setProducts(Array.isArray(newProducts) ? newProducts : [])
      }
      setIsFormOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (sku: string) => {
    try {
      await apiClient.deleteProduct(sku)
      setProducts((prev) => prev.filter((p) => p.sku !== sku))
      setDeleteConfirm(null)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  if (authLoading || !user || user.role !== "admin") {
    return null
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Panel de Administración</h1>
                <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
              </div>
              <Button onClick={handleAddProduct} size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Nuevo producto
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Error al cargar productos</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            )}

            {/* Form Modal */}
            {isFormOpen && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedProduct ? "Editar producto" : "Crear nuevo producto"}</CardTitle>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProductForm product={selectedProduct} onSubmit={handleFormSubmit} isLoading={isSubmitting} />
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Products Table */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Categoría</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Precio</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.sku} className="border-b border-border hover:bg-muted/50">
                            <td className="px-6 py-3 text-sm">{product.sku}</td>
                            <td className="px-6 py-3 text-sm font-medium">{product.name}</td>
                            <td className="px-6 py-3 text-sm">{product.category}</td>
                            <td className="px-6 py-3 text-sm">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-3 text-sm">{product.quantity}</td>
                            <td className="px-6 py-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  product.isActive
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                }`}
                              >
                                {product.isActive ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-sm">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                  className="gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setDeleteConfirm(product.sku)}
                                  className="gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent className="flex gap-3 flex-row justify-end pt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteProduct(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
