"use client"

import useSWR from "swr"
import {
  Store,
  Package,
  ShoppingCart,
  Truck,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Store as StoreType, Product, Order, Shipping } from "@/lib/types"

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function RecentOrdersTable({ orders, loading }: { orders?: Order[]; loading: boolean }) {
  const recentOrders = orders?.slice(0, 5) ?? []

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pedidos Recientes</CardTitle>
          <CardDescription>Los ultimos pedidos realizados</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders" className="flex items-center gap-1">
            Ver todos <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay pedidos registrados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Tienda</th>
                  <th className="pb-2 font-medium">Direccion</th>
                  <th className="pb-2 font-medium">Tipo</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-sm font-medium text-foreground">
                      #{order.id}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {order.store?.name ?? "-"}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                      {order.deliveryAddress}
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary" className="text-xs">
                        {order.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-sm font-semibold text-foreground">
                      ${order.total?.toLocaleString("es-CO") ?? "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ShippingStatusOverview({ shippings, loading }: { shippings?: Shipping[]; loading: boolean }) {
  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
    PROCESSING: { label: "Procesando", color: "bg-blue-100 text-blue-700" },
    IN_TRANSIT: { label: "En Transito", color: "bg-indigo-100 text-indigo-700" },
    DELIVERED: { label: "Entregado", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700" },
    RETURNED: { label: "Devuelto", color: "bg-orange-100 text-orange-700" },
  }

  const counts = shippings?.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {}) ?? {}

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Estado de Envios</CardTitle>
          <CardDescription>Resumen por estado</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/shippings" className="flex items-center gap-1">
            Ver todos <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Object.entries(statusMap).map(([key, { label, color }]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${color}`}
                  >
                    {label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {counts[key] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: stores, isLoading: loadingStores } = useSWR<StoreType[]>("/stores")
  const { data: products, isLoading: loadingProducts } = useSWR<Product[]>("/products")
  const { data: orders, isLoading: loadingOrders } = useSWR<Order[]>("/orders")
  const { data: shippings, isLoading: loadingShippings } = useSWR<Shipping[]>("/shippings")

  const totalRevenue = orders?.reduce((acc, o) => acc + (o.total || 0), 0) ?? 0

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen general del sistema de pedidos
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tiendas"
            value={stores?.length ?? 0}
            icon={Store}
            description="Tiendas registradas"
            loading={loadingStores}
          />
          <StatCard
            title="Productos"
            value={products?.length ?? 0}
            icon={Package}
            description="Productos en catalogo"
            loading={loadingProducts}
          />
          <StatCard
            title="Pedidos"
            value={orders?.length ?? 0}
            icon={ShoppingCart}
            description="Total de pedidos"
            loading={loadingOrders}
          />
          <StatCard
            title="Ingresos"
            value={`$${totalRevenue.toLocaleString("es-CO")}`}
            icon={TrendingUp}
            description="Ingresos totales"
            loading={loadingOrders}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <RecentOrdersTable orders={orders} loading={loadingOrders} />
          <ShippingStatusOverview shippings={shippings} loading={loadingShippings} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Tiendas", href: "/stores", icon: Store, desc: "Gestionar tiendas" },
            { title: "Productos", href: "/products", icon: Package, desc: "Catalogo de productos" },
            { title: "Pedidos", href: "/orders", icon: ShoppingCart, desc: "Administrar pedidos" },
            { title: "Envios", href: "/shippings", icon: Truck, desc: "Rastrear envios" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group transition-colors hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
