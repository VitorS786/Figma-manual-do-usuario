export type TableStatus = 'livre' | 'em_refeicao' | 'aguardando_pagamento' | 'pago' | 'indisponivel'
export type OrderStatus = 'novo' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado'
export type UserRole = 'admin' | 'cozinha' | 'caixa'
export type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix'
export type SessionStatus = 'open' | 'awaiting_payment' | 'paid'

export interface Table {
  id: string
  number: number
  status: TableStatus
  tabletId?: string
  sessionId?: string
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  number: number
  tableId: string
  tableNumber: number
  tabletId: string
  sessionId: string
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: string
}

export interface Session {
  id: string
  tableId: string
  tableNumber: number
  tabletId: string
  orderIds: string[]
  total: number
  openedAt: string
  closedAt?: string
  paymentMethod?: PaymentMethod
  paidAt?: string
  status: SessionStatus
}

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
  available: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  password: string
  active: boolean
  createdAt: string
}

export interface Tablet {
  id: string
  name: string
  tableId: string
  tableNumber: number
  active: boolean
  lastSeen: string
}

export interface Notification {
  id: string
  type: 'payment_request'
  tableId: string
  tableNumber: number
  sessionId: string
  amount: number
  createdAt: string
  read: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CurrentUser {
  id: string
  name: string
  role: UserRole | 'tablet'
  tabletId?: string
  tableId?: string
  tableNumber?: number
}
