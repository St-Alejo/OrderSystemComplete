"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Filter,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { productsAPI } from "@/lib/api"
import type { Product, ProductDTO, ProductType } from "@/lib/types"

const PRODUCT_TYPES: { value: ProductType; label: string; color: string }[] = [
  { value: "HYGIENE", label: "Higiene", color: "bg-cyan-100 text-cyan-700" },
  { value: "PACKAGED", label: "Empaquetado", color: "bg-amber-100 text-amber-700" },
  { value: "COLD", label: "Refrigerado", color: "bg-blue-100 text-blue-700" },
  { value: "MEATS", label: "Carnes", color: "bg-red-100 text-red-700" },
  { value: "VARIETIES", label: "Variedades", color: "bg-emerald-100 text-emerald-700" },
]

function getTypeInfo(type: string) {
  return PRODUCT_TYPES.find((t) => t.value === type) ?? { label: type, color: "bg-muted text-muted-foreground" }
}

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Product
  onSubmit: (data: ProductDTO) => void
  onCancel: () => void
  loading: boolean
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [cost, setCost] = useState(initial?.cost?.toString() ?? "")
  const [type, setType] = useState<ProductType>(initial?.type ?? "HYGIENE")
  const [supplierId, setSupplierId] = useState(initial?.supplierId?.toString() ?? "")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          name,
          cost: parseFloat(cost) || 0,
          type,
          supplierId: supplierId ? parseInt(supplierId) : undefined,
        })
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-name">Nombre</Label>
        <Input
          id="product-name"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-cost">Costo</Label>
        <Input
          id="product-cost"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <Select value={type} onValueChange={(v) => setType(v as ProductType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-supplier">ID Proveedor (opcional)</Label>
        <Input
          id="product-supplier"
          type="number"
          placeholder="ID del proveedor"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : initial ? "Actualizar" : "Crear"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function ProductsPage() {
  const { data: products, isLoading, mutate } = useSWR<Product[]>("/products")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const filtered = products?.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === "ALL" || p.type === filterType
    return matchesSearch && matchesType
  }) ?? []

  async function handleSubmit(data: ProductDTO) {
    setSubmitting(true)
    try {
      if (editProduct) {
        await productsAPI.update(editProduct.id, data)
        toast.success("Producto actualizado correctamente")
      } else {
        await productsAPI.create(data)
        toast.success("Producto creado correctamente")
      }
      mutate()
      setDialogOpen(false)
      setEditProduct(undefined)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await productsAPI.delete(deleteId)
      toast.success("Producto eliminado correctamente")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <>
      <DashboardHeader title="Productos" breadcrumbs={[{ label: "Productos" }]} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Productos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Catalogo de productos disponibles
            </p>
          </div>
          <Button
            onClick={() => {
              setEditProduct(undefined)
              setDialogOpen(true)
            }}
            className="gap-2"
          >
            <Plus className="size-4" />
            Nuevo Producto
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los tipos</SelectItem>
                {PRODUCT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Package className="size-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">No hay productos</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {search || filterType !== "ALL"
                    ? "No se encontraron resultados"
                    : "Crea un producto para comenzar"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Costo</TableHead>
                    <TableHead className="text-right">Proveedor</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product) => {
                    const typeInfo = getTypeInfo(product.type)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          #{product.id}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}
                          >
                            {typeInfo.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          ${product.cost?.toLocaleString("es-CO")}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.supplierId ? (
                            <Badge variant="outline" className="text-[10px]">
                              #{product.supplierId}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => {
                                setEditProduct(product)
                                setDialogOpen(true)
                              }}
                            >
                              <Pencil className="size-3.5" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 className="size-3.5" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditProduct(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {editProduct
                ? "Modifica los datos del producto"
                : "Completa los datos para crear un nuevo producto"}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            initial={editProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false)
              setEditProduct(undefined)
            }}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara el producto permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
