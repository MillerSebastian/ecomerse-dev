import { type NextRequest, NextResponse } from "next/server"

// Mock product database
const products = [
  {
    sku: "LAPTOP-001",
    name: "MacBook Pro 14",
    description: "Laptop de alto rendimiento para profesionales",
    price: 1999,
    category: "Electrónica",
    image: "/laptop-pro.jpg",
    stock: 15,
    isActive: true,
  },
  {
    sku: "PHONE-001",
    name: "iPhone 15 Pro",
    description: "Smartphone de última generación con cámara avanzada",
    price: 999,
    category: "Electrónica",
    image: "/iphone-pro.jpg",
    stock: 25,
    isActive: true,
  },
  {
    sku: "HEADPHONES-001",
    name: "Sony WH-1000XM5",
    description: "Auriculares con cancelación de ruido premium",
    price: 399,
    category: "Audio",
    image: "/headphones-premium.jpg",
    stock: 10,
    isActive: true,
  },
  {
    sku: "WATCH-001",
    name: "Apple Watch Ultra",
    description: "Reloj inteligente resistente con múltiples sensores",
    price: 799,
    category: "Accesorios",
    image: "/modern-smartwatch.png",
    stock: 8,
    isActive: true,
  },
  {
    sku: "TABLET-001",
    name: "iPad Pro 12.9",
    description: "Tablet con pantalla Liquid Retina XDR",
    price: 1299,
    category: "Electrónica",
    image: "/tablet-pro.jpg",
    stock: 12,
    isActive: true,
  },
  {
    sku: "CABLE-001",
    name: "USB-C Braided Cable 3m",
    description: "Cable USB-C de carga rápida y transmisión de datos",
    price: 29,
    category: "Accesorios",
    image: "/usb-cable.jpg",
    stock: 50,
    isActive: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const activeProducts = products.filter((p) => p.isActive)
    return NextResponse.json(activeProducts)
  } catch (error) {
    console.error("[v0] Products fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json()

    if (!newProduct.name || !newProduct.price || !newProduct.sku) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = {
      ...newProduct,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    products.push(product)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("[v0] Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
