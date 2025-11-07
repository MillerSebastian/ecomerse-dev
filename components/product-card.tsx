"use client"

import type { Product } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onDetails?: (product: Product) => void
}

export function ProductCard({ product, onDetails }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="relative w-full h-48 mb-2 bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=192&width=300&query=product"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        <CardDescription>{product.brand}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">{product.category}</span>
        </div>
        <p className="text-xs text-muted-foreground">Stock: {product.quantity}</p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onDetails?.(product)}
          className="w-full"
          variant={product.quantity === 0 ? "outline" : "default"}
          disabled={product.quantity === 0}
        >
          {product.quantity === 0 ? "Sin stock" : "Ver detalles"}
        </Button>
      </CardFooter>
    </Card>
  )
}
