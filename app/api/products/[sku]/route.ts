import { type NextRequest, NextResponse } from "next/server"

// Mock product database (referencia)
const products = [
  {
    sku: "LAPTOP-001",
    name: "MacBook Pro 14",
    description: "Laptop de alto rendimiento para profesionales",
    price: 1999,
    category: "Electrónica",
    stock: 15,
    isActive: true,
  },
  {
    sku: "PHONE-001",
    name: "iPhone 15 Pro",
    description: "Smartphone de última generación",
    price: 999,
    category: "Electrónica",
    stock: 25,
    isActive: true,
  },
]

export async function GET(request: NextRequest, { params }: { params: { sku: string } }) {
  try {
    const { sku } = params
    const product = products.find((p) => p.sku === sku)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Get product error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { sku: string } }) {
  try {
    const { sku } = params
    const updates = await request.json()

    const index = products.findIndex((p) => p.sku === sku)
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products[index] = { ...products[index], ...updates, sku }
    return NextResponse.json(products[index])
  } catch (error) {
    console.error("[v0] Update product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { sku: string } }) {
  try {
    const { sku } = params
    const index = products.findIndex((p) => p.sku === sku)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products[index].isActive = false
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete product error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
