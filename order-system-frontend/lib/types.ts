// ===== Enums =====
export type ProductType = "HYGIENE" | "PACKAGED" | "COLD" | "MEATS" | "VARIETIES"
export type ShippingStatus = "PENDING" | "PROCESSING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED" | "RETURNED"
export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "DIGITAL_WALLET" | "CASH_ON_DELIVERY"

// ===== Store =====
export interface Store {
  id: number
  name: string
  address: string
  balance: number
}

export interface StoreDTO {
  name: string
  address: string
  balance: number
}

// ===== Product =====
export interface Product {
  id: number
  name: string
  cost: number
  type: ProductType
  supplierId?: number
}

export interface ProductDTO {
  name: string
  cost: number
  type: ProductType
  supplierId?: number
}

// ===== ProductDetail =====
export interface ProductDetail {
  id: number
  brand: string
  description: string
  expirationDate: string
  weight: number
  isCurrentConsume: boolean
}

// ===== OrderDetail =====
export interface OrderDetail {
  id?: number
  productId: number
  quantity: number
  price: number
  subtotal?: number
  product?: Product
}

export interface OrderDetailDTO {
  productId: number
  quantity: number
  price: number
}

// ===== Order =====
export interface Order {
  id: number
  deliveryAddress: string
  date: string
  type: string
  total: number
  store?: Store
  orderDetails?: OrderDetail[]
  shipping?: Shipping
  payment?: Payment
}

export interface OrderDTO {
  storeId: number
  deliveryAddress: string
  date?: string
  type: string
  orderDetails: OrderDetailDTO[]
}

// ===== Shipping =====
export interface Shipping {
  id: number
  address: string
  shipDate: string
  deliveryDate: string
  cost: number
  status: ShippingStatus
  order?: Order
}

export interface ShippingDTO {
  orderId: number
  address: string
  shipDate: string
  deliveryDate: string
  cost: number
  status: ShippingStatus
}

// ===== Payment =====
export interface Payment {
  id: number
  date: string
  amount: number
  method: PaymentMethod
  status: string
}

// ===== Supplier =====
export interface Supplier {
  id: number
  name: string
  supplierId: string
  companyName: string
}

// ===== SupplierInvoice =====
export interface SupplierInvoice {
  id: number
  invoiceId: string
  date: string
  quantity: number
  totalCost: number
  generateDate: string
}
