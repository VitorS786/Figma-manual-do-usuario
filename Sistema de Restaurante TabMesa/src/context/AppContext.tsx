import React, { createContext, useContext, useState } from 'react'
import type {
  Table, Order, Session, Product, User, Tablet, Notification,
  CartItem, CurrentUser, TableStatus, OrderStatus, PaymentMethod, SessionStatus, UserRole
} from '../types'

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Bruschetta Italiana', category: 'Entradas', description: 'Pão ciabatta tostado com tomate cereja, manjericão fresco, alho e azeite extra virgem. Servido com 4 unidades.', price: 24.90, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p2', name: 'Carpaccio de Carne', category: 'Entradas', description: 'Fatias finas de carne bovina com alcaparras, rúcula, lascas de parmesão e azeite trufado.', price: 38.90, image: 'https://images.unsplash.com/photo-1535400255456-984e2f77db80?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p3', name: 'Sopa do Dia', category: 'Entradas', description: 'Sopa cremosa preparada com ingredientes frescos da estação. Acompanha fatias de pão artesanal.', price: 19.90, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p4', name: 'Bolinhos de Queijo', category: 'Entradas', description: 'Bolinhos fritos com recheio cremoso de queijo minas e catupiry. Acompanha molho agridoce.', price: 22.90, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p5', name: 'Hambúrguer TabMesa', category: 'Hambúrgueres', description: 'Pão brioche artesanal, blend de carne 180g, queijo cheddar, alface americana, tomate, cebola roxa e molho especial da casa.', price: 32.90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p6', name: 'Smash Burger Duplo', category: 'Hambúrgueres', description: 'Dois smash burgers de 90g cada, queijo americano, picles crocante, molho da casa e pão brioche tostado.', price: 38.90, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p7', name: 'Veggie Burger', category: 'Hambúrgueres', description: 'Hambúrguer vegetal de grão-de-bico e quinoa, maionese de ervas, rúcula, tomate confit e pão integral.', price: 34.90, image: 'https://images.unsplash.com/photo-1525059696034-4f64b8e64923?w=400&h=300&fit=crop&auto=format', available: false },
  { id: 'p8', name: 'Filé ao Molho Madeira', category: 'Pratos Principais', description: 'Medalhão de filé mignon ao molho madeira com champignons salteados. Acompanha arroz arbóreo e batatas douradas.', price: 58.90, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p9', name: 'Salmão Grelhado', category: 'Pratos Principais', description: 'Filé de salmão grelhado na manteiga e limão siciliano, com purê de batata-doce e legumes salteados.', price: 64.90, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p10', name: 'Risoto de Cogumelos', category: 'Pratos Principais', description: 'Risoto cremoso com mix de cogumelos shiitake e portobello, finalizado com parmesão e azeite de trufas.', price: 47.90, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p11', name: 'Frango à Parmegiana', category: 'Pratos Principais', description: 'Filé de frango empanado coberto com molho de tomate caseiro e queijo mussarela gratinado. Acompanha arroz e salada.', price: 44.90, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p12', name: 'Massa Alfredo', category: 'Massas', description: 'Fettuccine al dente ao molho alfredo com creme de leite fresco, manteiga, alho e parmesão gratinado.', price: 42.90, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p13', name: 'Espaguete Carbonara', category: 'Massas', description: 'Espaguete com molho carbonara tradicional, pancetta italiana, gema de ovo caipira e queijo pecorino.', price: 44.90, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p14', name: 'Pizza Margherita', category: 'Pizzas', description: 'Massa artesanal fina e crocante com molho de tomate san marzano, mussarela de búfala e manjericão fresco.', price: 49.90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p15', name: 'Pizza Quatro Queijos', category: 'Pizzas', description: 'Gorgonzola, mussarela, parmesão e provolone sobre massa de fermentação natural. Borda recheada opcional.', price: 54.90, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format', available: false },
  { id: 'p16', name: 'Brownie com Sorvete', category: 'Sobremesas', description: 'Brownie quentinho de chocolate belga com sorvete de creme artesanal, calda de chocolate e castanha caramelizada.', price: 19.90, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p17', name: 'Petit Gâteau', category: 'Sobremesas', description: 'Bolinho de chocolate com coração derretido, acompanha sorvete de baunilha e açúcar de confeiteiro.', price: 22.90, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p18', name: 'Pudim de Leite', category: 'Sobremesas', description: 'Pudim de leite condensado tradicional com calda de caramelo dourado. Servido bem gelado.', price: 14.90, image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p19', name: 'Água Mineral', category: 'Bebidas', description: 'Água mineral natural ou com gás da Serra da Canastra. Garrafa 500ml.', price: 5.90, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p20', name: 'Suco Natural', category: 'Bebidas', description: 'Suco 100% natural de laranja, limão, abacaxi, maracujá ou manga. Copo 300ml.', price: 9.90, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p21', name: 'Refrigerante', category: 'Bebidas', description: 'Coca-Cola, Guaraná Antarctica, Sprite ou Fanta Laranja. Lata 350ml gelada.', price: 7.00, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p22', name: 'Cerveja Artesanal', category: 'Bebidas', description: 'Seleção de cervejas artesanais locais: IPA, Witbier, Stout ou Lager. Long neck 355ml.', price: 16.90, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p23', name: 'Caipirinha', category: 'Bebidas', description: 'Caipirinha artesanal de limão taiti, tangerina, maracujá ou morango. Preparada na hora com cachaça premium.', price: 19.90, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p24', name: 'Vinho Tinto (Taça)', category: 'Bebidas', description: 'Seleção de vinhos tintos nacionais e importados. Taça 150ml — pergunte ao garçom as opções disponíveis.', price: 28.90, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&auto=format', available: true },
  { id: 'p25', name: 'Batata Frita Especial', category: 'Acompanhamentos', description: 'Batatas fritas crocantes temperadas com alecrim, sal grosso e páprica. Acompanha aioli de alho.', price: 18.90, image: 'https://images.unsplash.com/photo-1573080496219-bb964701c394?w=400&h=300&fit=crop&auto=format', available: true },
]

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Carlos Administrador', email: 'admin@tabmesa.com', role: 'admin', password: 'admin123', active: true, createdAt: '2024-01-15' },
  { id: 'u2', name: 'Ana Gerente', email: 'gerente@tabmesa.com', role: 'admin', password: 'ger123', active: true, createdAt: '2024-01-20' },
  { id: 'u3', name: 'Equipe Cozinha', email: 'cozinha@tabmesa.com', role: 'cozinha', password: 'coz123', active: true, createdAt: '2024-02-01' },
  { id: 'u4', name: 'Operador Caixa', email: 'caixa@tabmesa.com', role: 'caixa', password: 'caixa123', active: true, createdAt: '2024-02-01' },
]

const INITIAL_TABLETS: Tablet[] = Array.from({ length: 20 }, (_, i) => ({
  id: `TB-${String(i + 1).padStart(3, '0')}`,
  name: `Tablet ${String(i + 1).padStart(2, '0')}`,
  tableId: `t${i + 1}`,
  tableNumber: i + 1,
  active: true,
  lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
}))

function buildTables(): Table[] {
  const tables: Table[] = Array.from({ length: 20 }, (_, i) => ({
    id: `t${i + 1}`,
    number: i + 1,
    status: 'livre' as TableStatus,
    tabletId: `TB-${String(i + 1).padStart(3, '0')}`,
  }))
  tables[1].status = 'em_refeicao'; tables[1].sessionId = 's1'
  tables[4].status = 'aguardando_pagamento'; tables[4].sessionId = 's2'
  tables[7].status = 'em_refeicao'; tables[7].sessionId = 's3'
  tables[10].status = 'em_refeicao'; tables[10].sessionId = 's4'
  tables[14].status = 'pago'; tables[14].sessionId = 's5'
  return tables
}

function buildSessionsAndOrders() {
  const now = new Date()
  const hm = (h: number, m = 0) => {
    const d = new Date(now); d.setHours(h, m, 0); return d.toISOString()
  }

  const orders: Order[] = [
    { id: 'o1', number: 1021, tableId: 't2', tableNumber: 2, tabletId: 'TB-002', sessionId: 's1', status: 'em_preparo', total: 84.70, createdAt: hm(19, 15), items: [{ productId: 'p5', name: 'Hambúrguer TabMesa', quantity: 2, price: 32.90 }, { productId: 'p25', name: 'Batata Frita Especial', quantity: 1, price: 18.90 }] },
    { id: 'o2', number: 1022, tableId: 't2', tableNumber: 2, tabletId: 'TB-002', sessionId: 's1', status: 'novo', total: 33.80, createdAt: hm(19, 42), items: [{ productId: 'p22', name: 'Cerveja Artesanal', quantity: 2, price: 16.90 }] },
    { id: 'o3', number: 1019, tableId: 't5', tableNumber: 5, tabletId: 'TB-005', sessionId: 's2', status: 'entregue', total: 122.60, createdAt: hm(18, 30), items: [{ productId: 'p8', name: 'Filé ao Molho Madeira', quantity: 1, price: 58.90 }, { productId: 'p24', name: 'Vinho Tinto (Taça)', quantity: 2, price: 28.90 }, { productId: 'p19', name: 'Água Mineral', quantity: 1, price: 5.90 }] },
    { id: 'o4', number: 1020, tableId: 't5', tableNumber: 5, tabletId: 'TB-005', sessionId: 's2', status: 'entregue', total: 42.80, createdAt: hm(19, 5), items: [{ productId: 'p16', name: 'Brownie com Sorvete', quantity: 1, price: 19.90 }, { productId: 'p17', name: 'Petit Gâteau', quantity: 1, price: 22.90 }] },
    { id: 'o5', number: 1023, tableId: 't8', tableNumber: 8, tabletId: 'TB-008', sessionId: 's3', status: 'novo', total: 63.90, createdAt: hm(20, 2), items: [{ productId: 'p14', name: 'Pizza Margherita', quantity: 1, price: 49.90 }, { productId: 'p21', name: 'Refrigerante', quantity: 2, price: 7.00 }] },
    { id: 'o6', number: 1024, tableId: 't11', tableNumber: 11, tabletId: 'TB-011', sessionId: 's4', status: 'pronto', total: 57.80, createdAt: hm(19, 50), items: [{ productId: 'p10', name: 'Risoto de Cogumelos', quantity: 1, price: 47.90 }, { productId: 'p20', name: 'Suco Natural', quantity: 1, price: 9.90 }] },
    { id: 'o7', number: 1017, tableId: 't15', tableNumber: 15, tabletId: 'TB-015', sessionId: 's5', status: 'entregue', total: 104.70, createdAt: hm(17, 30), items: [{ productId: 'p9', name: 'Salmão Grelhado', quantity: 1, price: 64.90 }, { productId: 'p12', name: 'Massa Alfredo', quantity: 1, price: 42.90 } ] },
  ]

  const sessions: Session[] = [
    { id: 's1', tableId: 't2', tableNumber: 2, tabletId: 'TB-002', orderIds: ['o1', 'o2'], total: 118.50, openedAt: hm(19, 10), status: 'open' },
    { id: 's2', tableId: 't5', tableNumber: 5, tabletId: 'TB-005', orderIds: ['o3', 'o4'], total: 165.40, openedAt: hm(18, 25), closedAt: hm(19, 45), status: 'awaiting_payment' },
    { id: 's3', tableId: 't8', tableNumber: 8, tabletId: 'TB-008', orderIds: ['o5'], total: 63.90, openedAt: hm(19, 58), status: 'open' },
    { id: 's4', tableId: 't11', tableNumber: 11, tabletId: 'TB-011', orderIds: ['o6'], total: 57.80, openedAt: hm(19, 45), status: 'open' },
    { id: 's5', tableId: 't15', tableNumber: 15, tabletId: 'TB-015', orderIds: ['o7'], total: 104.70, openedAt: hm(17, 25), closedAt: hm(19, 10), paidAt: hm(19, 20), paymentMethod: 'pix', status: 'paid' },
  ]

  const notifications: Notification[] = [
    { id: 'n1', type: 'payment_request', tableId: 't5', tableNumber: 5, sessionId: 's2', amount: 165.40, createdAt: hm(19, 45), read: false },
  ]

  return { orders, sessions, notifications }
}

// ─── Context ──────────────────────────────────────────────────────────────────

let orderCounter = 1025
let sessionCounter = 6
let notifCounter = 2
let userCounter = 5
let productCounter = 26

interface AppContextType {
  currentUser: CurrentUser | null
  tables: Table[]
  orders: Order[]
  sessions: Session[]
  products: Product[]
  users: User[]
  tablets: Tablet[]
  notifications: Notification[]
  cart: CartItem[]
  login: (type: 'tablet' | UserRole, id: string, password?: string) => boolean
  logout: () => void
  addToCart: (product: Product, qty: number) => void
  removeFromCart: (productId: string) => void
  updateCartQty: (productId: string, qty: number) => void
  clearCart: () => void
  placeOrder: (sessionId: string, tableId: string, tableNumber: number, tabletId: string, items: CartItem[]) => Order
  createSession: (tableId: string, tableNumber: number, tabletId: string) => Session
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  closeTableBill: (tableId: string, sessionId: string) => void
  processPayment: (tableId: string, sessionId: string, method: PaymentMethod) => void
  toggleProductAvailability: (productId: string) => void
  addProduct: (p: Omit<Product, 'id'>) => void
  updateProduct: (id: string, p: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void
  updateUser: (id: string, u: Partial<User>) => void
  deleteUser: (id: string) => void
  addTable: (t: Omit<Table, 'id'>) => void
  updateTable: (id: string, t: Partial<Table>) => void
  deleteTable: (id: string) => void
  addTablet: (t: Omit<Tablet, 'id'>) => void
  updateTablet: (id: string, t: Partial<Tablet>) => void
  deleteTablet: (id: string) => void
  markNotificationRead: (id: string) => void
  getSessionOrders: (sessionId: string) => Order[]
  getTableSession: (tableId: string) => Session | undefined
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initData = buildSessionsAndOrders()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [tables, setTables] = useState<Table[]>(buildTables())
  const [orders, setOrders] = useState<Order[]>(initData.orders)
  const [sessions, setSessions] = useState<Session[]>(initData.sessions)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [tablets] = useState<Tablet[]>(INITIAL_TABLETS)
  const [tabletsState, setTabletsState] = useState<Tablet[]>(INITIAL_TABLETS)
  const [notifications, setNotifications] = useState<Notification[]>(initData.notifications)
  const [cart, setCart] = useState<CartItem[]>([])

  const login = (type: 'tablet' | UserRole, id: string, password?: string): boolean => {
    if (type === 'tablet') {
      const tablet = tabletsState.find(t => t.id === id && t.active)
      if (!tablet) return false
      setCurrentUser({ id: tablet.id, name: `Tablet ${tablet.tableNumber}`, role: 'tablet', tabletId: tablet.id, tableId: tablet.tableId, tableNumber: tablet.tableNumber })
      return true
    }
    const user = users.find(u => u.role === type && u.active)
    if (!user) {
      if (type === 'cozinha') {
        const u = users.find(u => u.role === 'cozinha' && u.password === password)
        if (u) { setCurrentUser({ id: u.id, name: u.name, role: u.role }); return true }
      }
      if (type === 'caixa') {
        const u = users.find(u => u.role === 'caixa' && u.password === password)
        if (u) { setCurrentUser({ id: u.id, name: u.name, role: u.role }); return true }
      }
      return false
    }
    if (user.password !== password) return false
    setCurrentUser({ id: user.id, name: user.name, role: user.role })
    return true
  }

  const loginAdmin = (email: string, password: string): boolean => {
    const user = users.find(u => u.role === 'admin' && u.email === email && u.password === password && u.active)
    if (!user) return false
    setCurrentUser({ id: user.id, name: user.name, role: user.role })
    return true
  }

  const logout = () => { setCurrentUser(null); setCart([]) }

  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id)
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + qty } : c)
      return [...prev, { product, quantity: qty }]
    })
  }

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(c => c.product.id !== productId))
  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return }
    setCart(prev => prev.map(c => c.product.id === productId ? { ...c, quantity: qty } : c))
  }
  const clearCart = () => setCart([])

  const createSession = (tableId: string, tableNumber: number, tabletId: string): Session => {
    const session: Session = { id: `s${sessionCounter++}`, tableId, tableNumber, tabletId, orderIds: [], total: 0, openedAt: new Date().toISOString(), status: 'open' }
    setSessions(prev => [...prev, session])
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'em_refeicao', sessionId: session.id } : t))
    return session
  }

  const placeOrder = (sessionId: string, tableId: string, tableNumber: number, tabletId: string, items: CartItem[]): Order => {
    const total = items.reduce((s, c) => s + c.product.price * c.quantity, 0)
    const order: Order = {
      id: `o${Date.now()}`, number: orderCounter++, tableId, tableNumber, tabletId, sessionId,
      items: items.map(c => ({ productId: c.product.id, name: c.product.name, quantity: c.quantity, price: c.product.price })),
      status: 'novo', total, createdAt: new Date().toISOString(),
    }
    setOrders(prev => [...prev, order])
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, orderIds: [...s.orderIds, order.id], total: s.total + total } : s))
    return order
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) =>
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))

  const closeTableBill = (tableId: string, sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'awaiting_payment' as SessionStatus, closedAt: new Date().toISOString() } : s))
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'aguardando_pagamento' as TableStatus } : t))
    const notif: Notification = { id: `n${notifCounter++}`, type: 'payment_request', tableId, tableNumber: session.tableNumber, sessionId, amount: session.total, createdAt: new Date().toISOString(), read: false }
    setNotifications(prev => [...prev, notif])
  }

  const processPayment = (tableId: string, sessionId: string, method: PaymentMethod) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'paid' as SessionStatus, paymentMethod: method, paidAt: new Date().toISOString() } : s))
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'livre' as TableStatus, sessionId: undefined } : t))
    setNotifications(prev => prev.map(n => n.sessionId === sessionId ? { ...n, read: true } : n))
  }

  const toggleProductAvailability = (productId: string) =>
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: !p.available } : p))

  const addProduct = (p: Omit<Product, 'id'>) =>
    setProducts(prev => [...prev, { ...p, id: `p${productCounter++}` }])

  const updateProduct = (id: string, p: Partial<Product>) =>
    setProducts(prev => prev.map(pr => pr.id === id ? { ...pr, ...p } : pr))

  const deleteProduct = (id: string) =>
    setProducts(prev => prev.filter(p => p.id !== id))

  const addUser = (u: Omit<User, 'id' | 'createdAt'>) =>
    setUsers(prev => [...prev, { ...u, id: `u${userCounter++}`, createdAt: new Date().toISOString().split('T')[0] }])

  const updateUser = (id: string, u: Partial<User>) =>
    setUsers(prev => prev.map(us => us.id === id ? { ...us, ...u } : us))

  const deleteUser = (id: string) =>
    setUsers(prev => prev.filter(u => u.id !== id))

  const addTable = (t: Omit<Table, 'id'>) =>
    setTables(prev => [...prev, { ...t, id: `t${Date.now()}` }])

  const updateTable = (id: string, t: Partial<Table>) =>
    setTables(prev => prev.map(tb => tb.id === id ? { ...tb, ...t } : tb))

  const deleteTable = (id: string) =>
    setTables(prev => prev.filter(t => t.id !== id))

  const addTablet = (t: Omit<Tablet, 'id'>) =>
    setTabletsState(prev => [...prev, { ...t, id: `TB-${String(Date.now()).slice(-3)}` }])

  const updateTablet = (id: string, t: Partial<Tablet>) =>
    setTabletsState(prev => prev.map(tb => tb.id === id ? { ...tb, ...t } : tb))

  const deleteTablet = (id: string) =>
    setTabletsState(prev => prev.filter(t => t.id !== id))

  const markNotificationRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const getSessionOrders = (sessionId: string) => orders.filter(o => o.sessionId === sessionId)
  const getTableSession = (tableId: string) => sessions.find(s => s.tableId === tableId && (s.status === 'open' || s.status === 'awaiting_payment'))

  // Expose loginAdmin as a separate key via the login function overload:
  // We'll handle admin login by passing role 'admin' and email as id, password as second arg
  const loginUnified = (type: 'tablet' | UserRole, id: string, password?: string): boolean => {
    if (type === 'admin') return loginAdmin(id, password ?? '')
    return login(type, id, password)
  }

  return (
    <AppContext.Provider value={{
      currentUser, tables, orders, sessions, products, users, tablets: tabletsState,
      notifications, cart,
      login: loginUnified, logout,
      addToCart, removeFromCart, updateCartQty, clearCart,
      placeOrder, createSession, updateOrderStatus,
      closeTableBill, processPayment,
      toggleProductAvailability,
      addProduct, updateProduct, deleteProduct,
      addUser, updateUser, deleteUser,
      addTable, updateTable, deleteTable,
      addTablet, updateTablet, deleteTablet,
      markNotificationRead,
      getSessionOrders, getTableSession,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
