import type {
  Store, StoreDTO,
  Product, ProductDTO,
  Order, OrderDTO,
  Shipping, ShippingDTO,
  ShippingStatus,
  ProductType,
} from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error en la solicitud" }))
    throw new Error(error.message || `Error ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

// ===== Stores =====
export const storesAPI = {
  getAll: () => fetchAPI<Store[]>("/stores"),
  getById: (id: number) => fetchAPI<Store>(`/stores/${id}`),
  create: (data: StoreDTO) =>
    fetchAPI<Store>("/stores", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<StoreDTO>) =>
    fetchAPI<Store>(`/stores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchAPI<void>(`/stores/${id}`, { method: "DELETE" }),
  search: (name: string) => fetchAPI<Store[]>(`/stores/search?name=${encodeURIComponent(name)}`),
}

// ===== Products =====
export const productsAPI = {
  getAll: () => fetchAPI<Product[]>("/products"),
  getById: (id: number) => fetchAPI<Product>(`/products/${id}`),
  create: (data: ProductDTO) =>
    fetchAPI<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ProductDTO>) =>
    fetchAPI<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchAPI<void>(`/products/${id}`, { method: "DELETE" }),
  getByType: (type: ProductType) => fetchAPI<Product[]>(`/products/type/${type}`),
  search: (name: string) => fetchAPI<Product[]>(`/products/search?name=${encodeURIComponent(name)}`),
}

// ===== Orders =====
export const ordersAPI = {
  getAll: () => fetchAPI<Order[]>("/orders"),
  getById: (id: number) => fetchAPI<Order>(`/orders/${id}`),
  create: (data: OrderDTO) =>
    fetchAPI<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: number) =>
    fetchAPI<void>(`/orders/${id}`, { method: "DELETE" }),
  getByStore: (storeId: number) => fetchAPI<Order[]>(`/orders/store/${storeId}`),
  getByDateRange: (startDate: string, endDate: string) =>
    fetchAPI<Order[]>(`/orders/date-range?startDate=${startDate}&endDate=${endDate}`),
  getStoreTotal: (storeId: number) => fetchAPI<number>(`/orders/store/${storeId}/total`),
}

// ===== Shippings =====
export const shippingsAPI = {
  getAll: () => fetchAPI<Shipping[]>("/shippings"),
  getById: (id: number) => fetchAPI<Shipping>(`/shippings/${id}`),
  create: (data: ShippingDTO) =>
    fetchAPI<Shipping>("/shippings", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id: number, status: ShippingStatus) =>
    fetchAPI<Shipping>(`/shippings/${id}/status?status=${status}`, { method: "PUT" }),
  getByOrder: (orderId: number) => fetchAPI<Shipping>(`/shippings/order/${orderId}`),
  getByStatus: (status: ShippingStatus) => fetchAPI<Shipping[]>(`/shippings/status/${status}`),
}
