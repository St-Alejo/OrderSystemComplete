"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Plus,
  Search,
  Truck,
  MapPin,
  CalendarIcon,
  ArrowRight,
  Filter,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DashboardHeader } from "@/components/dashboard-header"
import { shippingsAPI } from "@/lib/api"
import type { Shipping, ShippingDTO, ShippingStatus, Order } from "@/lib/types"

const STATUS_CONFIG: Record<ShippingStatus, { label: string; color: string; icon: React.ElementType; bgColor: string }> = {
  PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock, bgColor: "bg-amber-50" },
  PROCESSING: { label: "Procesando", color: "bg-blue-100 text-blue-700", icon: Loader2, bgColor: "bg-blue-50" },
  IN_TRANSIT: { label: "En Transito", color: "bg-indigo-100 text-indigo-700", icon: Truck, bgColor: "bg-indigo-50" },
  DELIVERED: { label: "Entregado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, bgColor: "bg-emerald-50" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle, bgColor: "bg-red-50" },
  RETURNED: { label: "Devuelto", color: "bg-orange-100 text-orange-700", icon: RotateCcw, bgColor: "bg-orange-50" },
}

const ALL_STATUSES: ShippingStatus[] = ["PENDING", "PROCESSING", "IN_TRANSIT", "DELIVERED", "CANCELLED", "RETURNED"]

function ShippingForm({
  orders,
  onSubmit,
  onCancel,
  loading,
}: {
  orders: Order[]
  onSubmit: (data: ShippingDTO) => void
  onCancel: () => void
  loading: boolean
}) {
  const [orderId, setOrderId] = useState("")
  const [address, setAddress] = useState("")
  const [shipDate, setShipDate] = useState(new Date().toISOString().split("T")[0])
  const [deliveryDate, setDeliveryDate] = useState("")
  const [cost, setCost] = useState("")
  const [status, setStatus] = useState<ShippingStatus>("PENDING")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          orderId: parseInt(orderId),
          address,
          shipDate,
          deliveryDate,
          cost: parseFloat(cost) || 0,
          status,
        })
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label>Pedido</Label>
        <Select value={orderId} onValueChange={setOrderId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar pedido" />
          </SelectTrigger>
          <SelectContent>
            {orders.map((o) => (
              <SelectItem key={o.id} value={o.id.toString()}>
                Pedido #{o.id} - {o.store?.name ?? "Tienda"} (${o.total?.toLocaleString("es-CO")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Direccion de Envio</Label>
        <Input
          placeholder="Direccion de envio"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Fecha de Envio</Label>
          <Input
            type="date"
            value={shipDate}
            onChange={(e) => setShipDate(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Fecha de Entrega</Label>
          <Input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Costo de Envio</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ShippingStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Envio"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function StatusUpdateDialog({
  shipping,
  open,
  onClose,
  onUpdate,
}: {
  shipping: Shipping | null
  open: boolean
  onClose: () => void
  onUpdate: (id: number, status: ShippingStatus) => void
}) {
  const [newStatus, setNewStatus] = useState<ShippingStatus>(shipping?.status ?? "PENDING")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Actualizar Estado</DialogTitle>
          <DialogDescription>
            Envio #{shipping?.id} - Cambiar estado actual
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {shipping && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Estado actual:</span>
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[shipping.status].color}`}>
                {STATUS_CONFIG[shipping.status].label}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Nuevo Estado</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ShippingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => {
                  const config = STATUS_CONFIG[s]
                  return (
                    <SelectItem key={s} value={s}>
                      <div className="flex items-center gap-2">
                        <config.icon className="size-3.5" />
                        {config.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (shipping) onUpdate(shipping.id, newStatus)
              }}
            >
              Actualizar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ShippingsPage() {
  const { data: shippings, isLoading, mutate } = useSWR<Shipping[]>("/shippings")
  const { data: orders } = useSWR<Order[]>("/orders")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [updateShipping, setUpdateShipping] = useState<Shipping | null>(null)

  const filtered = shippings?.filter((s) => {
    const matchesSearch =
      s.address?.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toString().includes(search)
    const matchesStatus = filterStatus === "ALL" || s.status === filterStatus
    return matchesSearch && matchesStatus
  }) ?? []

  async function handleSubmit(data: ShippingDTO) {
    setSubmitting(true)
    try {
      await shippingsAPI.create(data)
      toast.success("Envio creado correctamente")
      mutate()
      setDialogOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusUpdate(id: number, status: ShippingStatus) {
    try {
      await shippingsAPI.updateStatus(id, status)
      toast.success("Estado actualizado correctamente")
      mutate()
      setUpdateShipping(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const statusCounts = shippings?.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {}) ?? {}

  return (
    <>
      <DashboardHeader title="Envios" breadcrumbs={[{ label: "Envios" }]} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Envios</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rastrea y gestiona los envios de pedidos
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="size-4" />
            Nuevo Envio
          </Button>
        </div>

        {/* Status summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ALL_STATUSES.map((status) => {
            const config = STATUS_CONFIG[status]
            const StatusIcon = config.icon
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(filterStatus === status ? "ALL" : status)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                  filterStatus === status
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:border-border hover:bg-muted/50"
                }`}
              >
                <StatusIcon className={`size-4 ${filterStatus === status ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-lg font-bold text-foreground">{statusCounts[status] || 0}</span>
                <span className="text-[10px] text-muted-foreground">{config.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar envios..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filterStatus !== "ALL" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterStatus("ALL")}
              className="gap-1"
            >
              <XCircle className="size-3" />
              Limpiar filtro
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Truck className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">No hay envios</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search || filterStatus !== "ALL"
                  ? "No se encontraron resultados"
                  : "Crea un envio para comenzar"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((shipping) => {
              const config = STATUS_CONFIG[shipping.status]
              const StatusIcon = config.icon
              return (
                <Card key={shipping.id} className="group transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}>
                        <StatusIcon className={`size-5 ${config.color.split(" ")[1]}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">Envio #{shipping.id}</CardTitle>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium mt-1 ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => setUpdateShipping(shipping)}
                    >
                      Actualizar
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{shipping.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="size-3.5 shrink-0" />
                      <span>Pedido #{shipping.order?.id ?? "-"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        {shipping.shipDate}
                      </div>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        {shipping.deliveryDate}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">Costo de envio</span>
                      <span className="text-sm font-semibold text-foreground">
                        ${shipping.cost?.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo Envio</DialogTitle>
            <DialogDescription>
              Crea un nuevo envio para un pedido existente
            </DialogDescription>
          </DialogHeader>
          <ShippingForm
            orders={orders ?? []}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      <StatusUpdateDialog
        shipping={updateShipping}
        open={updateShipping !== null}
        onClose={() => setUpdateShipping(null)}
        onUpdate={handleStatusUpdate}
      />
    </>
  )
}
