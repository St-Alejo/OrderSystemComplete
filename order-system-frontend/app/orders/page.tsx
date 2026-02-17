"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Plus,
  Search,
  Trash2,
  ShoppingCart,
  Eye,
  X,
  CalendarIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DashboardHeader } from "@/components/dashboard-header"
import { ordersAPI } from "@/lib/api"
import type { Store, Product, Order, OrderDTO, OrderDetailDTO } from "@/lib/types"

function OrderDetailRow({
  detail,
  index,
  products,
  onChange,
  onRemove,
}: {
  detail: OrderDetailDTO
  index: number
  products: Product[]
  onChange: (index: number, field: string, value: string | number) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex items-end gap-3 rounded-lg border border-border/50 p-3">
      <div className="flex flex-1 flex-col gap-2">
        <Label className="text-xs">Producto</Label>
        <Select
          value={detail.productId?.toString() ?? ""}
          onValueChange={(v) => onChange(index, "productId", parseInt(v))}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.name} (${p.cost.toLocaleString("es-CO")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-24 flex-col gap-2">
        <Label className="text-xs">Cantidad</Label>
        <Input
          type="number"
          min={1}
          className="h-9"
          value={detail.quantity || ""}
          onChange={(e) => onChange(index, "quantity", parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="flex w-32 flex-col gap-2">
        <Label className="text-xs">Precio</Label>
        <Input
          type="number"
          step="0.01"
          className="h-9"
          value={detail.price || ""}
          onChange={(e) => onChange(index, "price", parseFloat(e.target.value) || 0)}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 text-destructive hover:text-destructive"
        onClick={() => onRemove(index)}
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}

function OrderForm({
  stores,
  products,
  onSubmit,
  onCancel,
  loading,
}: {
  stores: Store[]
  products: Product[]
  onSubmit: (data: OrderDTO) => void
  onCancel: () => void
  loading: boolean
}) {
  const [storeId, setStoreId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [type, setType] = useState("HYGIENE")
  const [details, setDetails] = useState<OrderDetailDTO[]>([
    { productId: 0, quantity: 1, price: 0 },
  ])

  function handleDetailChange(index: number, field: string, value: string | number) {
    const newDetails = [...details]
    newDetails[index] = { ...newDetails[index], [field]: value }
    if (field === "productId") {
      const product = products.find((p) => p.id === value)
      if (product) {
        newDetails[index].price = product.cost
      }
    }
    setDetails(newDetails)
  }

  function addDetail() {
    setDetails([...details, { productId: 0, quantity: 1, price: 0 }])
  }

  function removeDetail(index: number) {
    if (details.length === 1) return
    setDetails(details.filter((_, i) => i !== index))
  }

  const total = details.reduce((acc, d) => acc + d.quantity * d.price, 0)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          storeId: parseInt(storeId),
          deliveryAddress,
          date,
          type,
          orderDetails: details.filter((d) => d.productId > 0),
        })
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Tienda</Label>
          <Select value={storeId} onValueChange={setStoreId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tienda" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HYGIENE">Higiene</SelectItem>
              <SelectItem value="PACKAGED">Empaquetado</SelectItem>
              <SelectItem value="COLD">Refrigerado</SelectItem>
              <SelectItem value="MEATS">Carnes</SelectItem>
              <SelectItem value="VARIETIES">Variedades</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Direccion de Entrega</Label>
        <Input
          placeholder="Direccion de entrega"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Fecha</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-foreground">Detalles del Pedido</Label>
        <Button type="button" variant="outline" size="sm" onClick={addDetail}>
          <Plus className="mr-1 size-3" />
          Agregar
        </Button>
      </div>

      <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto">
        {details.map((detail, index) => (
          <OrderDetailRow
            key={index}
            detail={detail}
            index={index}
            products={products}
            onChange={handleDetailChange}
            onRemove={removeDetail}
          />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground">Total estimado</span>
        <span className="text-lg font-bold text-foreground">
          ${total.toLocaleString("es-CO")}
        </span>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Pedido"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function OrderDetailSheet({ order, open, onClose }: { order: Order | null; open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Pedido #{order?.id}</SheetTitle>
          <SheetDescription>Detalles completos del pedido</SheetDescription>
        </SheetHeader>
        {order && (
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tienda</p>
                <p className="text-sm font-medium text-foreground">{order.store?.name ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="text-sm font-medium text-foreground">{order.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <Badge variant="secondary">{order.type}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-foreground">
                  ${order.total?.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Direccion de Entrega</p>
              <p className="text-sm text-foreground">{order.deliveryAddress}</p>
            </div>

            <Separator />

            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Productos del Pedido</p>
              {order.orderDetails && order.orderDetails.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {order.orderDetails.map((detail, i) => (
                    <div
                      key={detail.id ?? i}
                      className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {detail.product?.name ?? `Producto #${detail.productId}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {detail.quantity} x ${detail.price?.toLocaleString("es-CO")}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        ${detail.subtotal?.toLocaleString("es-CO") ?? (detail.quantity * detail.price).toLocaleString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin detalles disponibles</p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default function OrdersPage() {
  const { data: orders, isLoading, mutate } = useSWR<Order[]>("/orders")
  const { data: stores } = useSWR<Store[]>("/stores")
  const { data: products } = useSWR<Product[]>("/products")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [viewOrder, setViewOrder] = useState<Order | null>(null)

  const filtered = orders?.filter(
    (o) =>
      o.deliveryAddress?.toLowerCase().includes(search.toLowerCase()) ||
      o.store?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search)
  ) ?? []

  async function handleSubmit(data: OrderDTO) {
    setSubmitting(true)
    try {
      await ordersAPI.create(data)
      toast.success("Pedido creado correctamente")
      mutate()
      setDialogOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await ordersAPI.delete(deleteId)
      toast.success("Pedido eliminado correctamente")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <>
      <DashboardHeader title="Pedidos" breadcrumbs={[{ label: "Pedidos" }]} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pedidos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra los pedidos del sistema
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="size-4" />
            Nuevo Pedido
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  <ShoppingCart className="size-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">No hay pedidos</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {search ? "No se encontraron resultados" : "Crea un pedido para comenzar"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead>Tienda</TableHead>
                    <TableHead>Direccion</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[120px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {order.store?.name ?? "-"}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-muted-foreground">
                        {order.deliveryAddress}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="size-3" />
                          {order.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        ${order.total?.toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setViewOrder(order)}
                          >
                            <Eye className="size-3.5" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(order.id)}
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Pedido</DialogTitle>
            <DialogDescription>
              Crea un nuevo pedido con sus detalles de productos
            </DialogDescription>
          </DialogHeader>
          <OrderForm
            stores={stores ?? []}
            products={products ?? []}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      <OrderDetailSheet
        order={viewOrder}
        open={viewOrder !== null}
        onClose={() => setViewOrder(null)}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara el pedido permanentemente.
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
