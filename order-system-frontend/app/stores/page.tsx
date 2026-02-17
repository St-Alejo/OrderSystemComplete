"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Store as StoreIcon,
  MapPin,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { DashboardHeader } from "@/components/dashboard-header"
import { storesAPI } from "@/lib/api"
import type { Store, StoreDTO } from "@/lib/types"

function StoreForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Store
  onSubmit: (data: StoreDTO) => void
  onCancel: () => void
  loading: boolean
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [address, setAddress] = useState(initial?.address ?? "")
  const [balance, setBalance] = useState(initial?.balance?.toString() ?? "")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name, address, balance: parseFloat(balance) || 0 })
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="store-name">Nombre</Label>
        <Input
          id="store-name"
          placeholder="Nombre de la tienda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="store-address">Direccion</Label>
        <Input
          id="store-address"
          placeholder="Direccion de la tienda"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="store-balance">Balance</Label>
        <Input
          id="store-balance"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          required
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

export default function StoresPage() {
  const { data: stores, isLoading, mutate } = useSWR<Store[]>("/stores")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editStore, setEditStore] = useState<Store | undefined>()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const filtered = stores?.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  async function handleSubmit(data: StoreDTO) {
    setSubmitting(true)
    try {
      if (editStore) {
        await storesAPI.update(editStore.id, data)
        toast.success("Tienda actualizada correctamente")
      } else {
        await storesAPI.create(data)
        toast.success("Tienda creada correctamente")
      }
      mutate()
      setDialogOpen(false)
      setEditStore(undefined)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    try {
      await storesAPI.delete(deleteId)
      toast.success("Tienda eliminada correctamente")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <>
      <DashboardHeader title="Tiendas" breadcrumbs={[{ label: "Tiendas" }]} />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tiendas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona las tiendas del sistema
            </p>
          </div>
          <Button
            onClick={() => {
              setEditStore(undefined)
              setDialogOpen(true)
            }}
            className="gap-2"
          >
            <Plus className="size-4" />
            Nueva Tienda
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar tiendas..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <StoreIcon className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">No hay tiendas</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search ? "No se encontraron resultados" : "Crea una tienda para comenzar"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((store) => (
              <Card key={store.id} className="group transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <StoreIcon className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{store.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        ID: {store.id}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => {
                        setEditStore(store)
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
                      onClick={() => setDeleteId(store.id)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="size-3.5 shrink-0 text-emerald-600" />
                    <span className="font-semibold text-foreground">
                      ${store.balance?.toLocaleString("es-CO")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditStore(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editStore ? "Editar Tienda" : "Nueva Tienda"}</DialogTitle>
            <DialogDescription>
              {editStore
                ? "Modifica los datos de la tienda"
                : "Completa los datos para crear una nueva tienda"}
            </DialogDescription>
          </DialogHeader>
          <StoreForm
            initial={editStore}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false)
              setEditStore(undefined)
            }}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tienda</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara la tienda permanentemente.
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
