import { useState } from 'react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import type { Product, User, Table, Tablet, UserRole } from '../types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

type AdminSection = 'dashboard' | 'tables' | 'orders' | 'menu' | 'users' | 'tablets' | 'reports' | 'settings'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'tables', label: 'Mesas', icon: '🪑' },
  { id: 'orders', label: 'Pedidos', icon: '📋' },
  { id: 'menu', label: 'Cardápio', icon: '🍽' },
  { id: 'users', label: 'Usuários', icon: '👥' },
  { id: 'tablets', label: 'Tablets', icon: '📱' },
  { id: 'reports', label: 'Relatórios', icon: '📈' },
  { id: 'settings', label: 'Configurações', icon: '⚙️' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  livre: { label: 'Livre', color: '#2D7A3D', bg: '#EDFAF0' },
  em_refeicao: { label: 'Em Refeição', color: '#4B3FA8', bg: '#EEF0FA' },
  aguardando_pagamento: { label: 'Aguardando Pgto.', color: '#9A5F00', bg: '#FFF4E5' },
  pago: { label: 'Pago', color: '#2D7A3D', bg: '#E8F5EA' },
  indisponivel: { label: 'Indisponível', color: '#B72B2B', bg: '#FEECEC' },
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  cozinha: 'Cozinha',
  caixa: 'Caixa',
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return <span className="px-2.5 py-1 rounded-lg text-xs font-700" style={{ color, background: bg }}>{children}</span>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#FFFFFF' }} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E4DE', background: '#F9F8F6' }}>
          <p className="font-800 text-lg" style={{ color: '#3D3830' }}>{title}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F5F2EE' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9490" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-600 mb-1.5" style={{ color: '#3D3830' }}>{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-3 rounded-xl border font-500 outline-none transition-all"
const inputStyle = { background: '#F5F2EE', borderColor: '#E8E4DE', color: '#3D3830' }
const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = '#8B7FC7'
const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => e.target.style.borderColor = '#E8E4DE'

export default function AdminView() {
  const { tables, orders, sessions, products, users, tablets, logout, currentUser,
    toggleProductAvailability, addProduct, updateProduct, deleteProduct,
    addUser, updateUser, deleteUser, addTable, updateTable, deleteTable, addTablet, updateTablet, deleteTablet } = useApp()

  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null)

  // ─── PRODUCT FORM ──────────────────────────────────────────────────────────
  const [pForm, setPForm] = useState({ name: '', category: '', description: '', price: '', image: '', available: true })
  const openProductModal = (product?: Product) => {
    if (product) setPForm({ name: product.name, category: product.category, description: product.description, price: String(product.price), image: product.image, available: product.available })
    else setPForm({ name: '', category: '', description: '', price: '', image: '', available: true })
    setModal({ type: product ? 'editProduct' : 'addProduct', data: product })
  }
  const saveProduct = () => {
    const data = { ...pForm, price: parseFloat(pForm.price) || 0 }
    if (modal?.data) updateProduct(modal.data.id, data)
    else addProduct(data)
    setModal(null)
  }

  // ─── USER FORM ─────────────────────────────────────────────────────────────
  const [uForm, setUForm] = useState({ name: '', email: '', role: 'caixa' as UserRole, password: '', active: true })
  const openUserModal = (user?: User) => {
    if (user) setUForm({ name: user.name, email: user.email, role: user.role, password: user.password, active: user.active })
    else setUForm({ name: '', email: '', role: 'caixa', password: '', active: true })
    setModal({ type: user ? 'editUser' : 'addUser', data: user })
  }
  const saveUser = () => {
    if (modal?.data) updateUser(modal.data.id, uForm)
    else addUser(uForm)
    setModal(null)
  }

  // ─── TABLE FORM ────────────────────────────────────────────────────────────
  const [tForm, setTForm] = useState({ number: '', status: 'livre' as any, tabletId: '' })
  const openTableModal = (table?: Table) => {
    if (table) setTForm({ number: String(table.number), status: table.status, tabletId: table.tabletId || '' })
    else setTForm({ number: '', status: 'livre', tabletId: '' })
    setModal({ type: table ? 'editTable' : 'addTable', data: table })
  }
  const saveTable = () => {
    const data = { number: parseInt(tForm.number), status: tForm.status, tabletId: tForm.tabletId || undefined }
    if (modal?.data) updateTable(modal.data.id, data)
    else addTable(data)
    setModal(null)
  }

  // ─── STATS ────────────────────────────────────────────────────────────────
  const totalRevenue = sessions.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total, 0)
  const todayRevenue = totalRevenue
  const tableStats = { occupied: tables.filter(t => t.status === 'em_refeicao').length, free: tables.filter(t => t.status === 'livre').length, waiting: tables.filter(t => t.status === 'aguardando_pagamento').length }
  const unavailableProducts = products.filter(p => !p.available).length
  const activeOrders = orders.filter(o => ['novo', 'em_preparo', 'pronto'].includes(o.status)).length

  // Chart data
  const hourlyData = Array.from({ length: 8 }, (_, i) => ({
    hora: `${14 + i}h`,
    pedidos: Math.floor(Math.random() * 12) + 2,
    faturamento: Math.floor(Math.random() * 800) + 200,
  }))
  const categoryData = ['Hambúrgueres', 'Pratos Principais', 'Pizzas', 'Bebidas', 'Sobremesas'].map((cat, i) => ({
    name: cat, value: [34, 28, 19, 42, 15][i],
  }))
  const CHART_COLORS = ['#8B7FC7', '#7E9478', '#C8933A', '#5BA85A', '#DC5F5F']

  const weekData = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => ({
    dia: day, faturamento: Math.floor(Math.random() * 3000) + 1500,
  }))

  // ─── ORDER STATUS BADGE ───────────────────────────────────────────────────
  const orderStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    novo: { label: 'Novo', color: '#4B3FA8', bg: '#EEF0FA' },
    em_preparo: { label: 'Em Preparo', color: '#9A5F00', bg: '#FFF4E5' },
    pronto: { label: 'Pronto', color: '#2D7A3D', bg: '#EDFAF0' },
    entregue: { label: 'Entregue', color: '#6B7280', bg: '#F5F2EE' },
    cancelado: { label: 'Cancelado', color: '#B72B2B', bg: '#FEECEC' },
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: '#F5F2EE' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 flex flex-col border-r transition-all duration-200`} style={{ background: '#FFFFFF', borderColor: '#E8E4DE', minHeight: '100vh' }}>
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#E8E4DE' }}>
          {sidebarOpen ? <Logo size="sm" /> : <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FA' }}><span style={{ color: '#8B7FC7' }}>T</span></div>}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#F5F2EE' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9C9490" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="w-full flex justify-center p-2 mb-2 rounded-xl" style={{ color: '#9C9490' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          {NAV.map(item => (
            <button key={item.id} onClick={() => setSection(item.id as AdminSection)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
              style={{ background: section === item.id ? '#EEF0FA' : 'transparent', color: section === item.id ? '#8B7FC7' : '#9C9490', fontWeight: section === item.id ? '700' : '600' }}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: '#E8E4DE' }}>
          {sidebarOpen && <p className="text-xs font-500 mb-2 px-3 truncate" style={{ color: '#9C9490' }}>{currentUser?.name}</p>}
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-700 transition-all hover:bg-red-50 ${!sidebarOpen ? 'justify-center' : ''}`} style={{ color: '#DC5F5F' }}>
            <span>🚪</span>{sidebarOpen && 'Sair'}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="border-b px-6 py-4 flex items-center justify-between" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
          <div>
            <h1 className="font-800 text-xl" style={{ color: '#3D3830' }}>{NAV.find(n => n.id === section)?.label}</h1>
            <p className="text-xs font-500" style={{ color: '#9C9490' }}>TabMesa · Painel Administrativo</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-700" style={{ color: '#3D3830' }}>{currentUser?.name}</p>
              <p className="text-xs font-500" style={{ color: '#9C9490' }}>Administrador</p>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-800 text-white" style={{ background: '#8B7FC7' }}>
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">

          {/* ── DASHBOARD ─────────────────────────────────────────────────── */}
          {section === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Mesas Ocupadas', value: tableStats.occupied, color: '#4B3FA8', bg: '#EEF0FA', icon: '🪑' },
                  { label: 'Mesas Livres', value: tableStats.free, color: '#2D7A3D', bg: '#EDFAF0', icon: '✅' },
                  { label: 'Aguard. Pgto.', value: tableStats.waiting, color: '#9A5F00', bg: '#FFF4E5', icon: '🔔' },
                  { label: 'Pedidos Ativos', value: activeOrders, color: '#8B7FC7', bg: '#EEF0FA', icon: '📋' },
                  { label: 'Faturamento Hoje', value: fmt(todayRevenue), color: '#2D7A3D', bg: '#EDFAF0', icon: '💰' },
                  { label: 'Indisp.', value: unavailableProducts, color: '#B72B2B', bg: '#FEECEC', icon: '⚠️' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-4 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                    <p className="font-800 text-2xl" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs font-600 mt-1" style={{ color: '#9C9490' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                  <p className="font-800 mb-4" style={{ color: '#3D3830' }}>Faturamento da Semana</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weekData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                      <XAxis dataKey="dia" tick={{ fontSize: 11, fontWeight: 600, fill: '#9C9490', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9C9490', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(1)}k`} />
                      <Tooltip formatter={(v: any) => [fmt(Number(v)), 'Faturamento']} contentStyle={{ borderRadius: 12, border: '1px solid #E8E4DE', fontFamily: 'Nunito', fontWeight: 600 }} />
                      <Bar dataKey="faturamento" fill="#8B7FC7" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                  <p className="font-800 mb-4" style={{ color: '#3D3830' }}>Vendas por Categoria</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E8E4DE', fontFamily: 'Nunito' }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600, fontFamily: 'Nunito' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: '#E8E4DE', background: '#F9F8F6' }}>
                  <p className="font-800" style={{ color: '#3D3830' }}>Pedidos Recentes</p>
                </div>
                <div className="divide-y" style={{ borderColor: '#E8E4DE' }}>
                  {orders.slice(-5).reverse().map(order => {
                    const st = orderStatusConfig[order.status]
                    return (
                      <div key={order.id} className="px-5 py-3.5 flex items-center gap-4">
                        <span className="font-700 text-sm w-14 flex-shrink-0" style={{ color: '#8B7FC7' }}>#{order.number}</span>
                        <span className="font-600 text-sm flex-shrink-0" style={{ color: '#9C9490' }}>Mesa {String(order.tableNumber).padStart(2, '0')}</span>
                        <span className="flex-1 text-sm font-500 truncate" style={{ color: '#3D3830' }}>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                        <span className="font-700 text-sm" style={{ color: '#3D3830' }}>{fmt(order.total)}</span>
                        {st && <Badge color={st.color} bg={st.bg}>{st.label}</Badge>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── TABLES ────────────────────────────────────────────────────── */}
          {section === 'tables' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-600" style={{ color: '#9C9490' }}>{tables.length} mesas cadastradas</p>
                <button onClick={() => openTableModal()} className="px-4 py-2.5 rounded-xl text-sm font-700 text-white" style={{ background: '#8B7FC7' }}>+ Nova Mesa</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tables.map(table => {
                  const st = STATUS_CONFIG[table.status]
                  return (
                    <div key={table.id} className="rounded-2xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-800 text-xl" style={{ color: '#3D3830' }}>Mesa {String(table.number).padStart(2, '0')}</p>
                      </div>
                      <p className="text-xs font-500 mb-2" style={{ color: '#9C9490' }}>{table.tabletId || 'Sem tablet'}</p>
                      <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => openTableModal(table)} className="flex-1 py-2 rounded-xl text-xs font-700 border transition-all" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>Editar</button>
                        <button onClick={() => deleteTable(table.id)} className="py-2 px-2 rounded-xl text-xs font-700 transition-all" style={{ background: '#FEECEC', color: '#DC5F5F' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── ORDERS ────────────────────────────────────────────────────── */}
          {section === 'orders' && (
            <div>
              <p className="font-600 mb-5" style={{ color: '#9C9490' }}>{orders.length} pedidos registrados</p>
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                {[...orders].reverse().map((order, i) => {
                  const st = orderStatusConfig[order.status]
                  return (
                    <div key={order.id} className={`px-5 py-4 flex items-center gap-4 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: '#F5F2EE' }}>
                      <span className="font-700 w-16 flex-shrink-0" style={{ color: '#8B7FC7' }}>#{order.number}</span>
                      <span className="font-700 text-sm w-20 flex-shrink-0" style={{ color: '#3D3830' }}>Mesa {String(order.tableNumber).padStart(2, '0')}</span>
                      <span className="text-sm font-500 flex-shrink-0" style={{ color: '#9C9490' }}>{fmtTime(order.createdAt)}</span>
                      <span className="flex-1 text-sm font-500 truncate" style={{ color: '#3D3830' }}>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
                      <span className="font-700" style={{ color: '#3D3830' }}>{fmt(order.total)}</span>
                      {st && <Badge color={st.color} bg={st.bg}>{st.label}</Badge>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── MENU ──────────────────────────────────────────────────────── */}
          {section === 'menu' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-600" style={{ color: '#9C9490' }}>{products.length} produtos · {unavailableProducts} indisponíveis</p>
                <button onClick={() => openProductModal()} className="px-4 py-2.5 rounded-xl text-sm font-700 text-white" style={{ background: '#8B7FC7' }}>+ Novo Produto</button>
              </div>
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product.id} className="rounded-2xl border flex items-center gap-4 p-4 transition-all" style={{ background: '#FFFFFF', borderColor: '#E8E4DE', opacity: product.available ? 1 : 0.7 }}>
                    <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ filter: product.available ? 'none' : 'grayscale(60%)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-700" style={{ color: '#3D3830' }}>{product.name}</p>
                      <p className="text-xs font-500" style={{ color: '#9C9490' }}>{product.category}</p>
                    </div>
                    <span className="font-800" style={{ color: '#8B7FC7' }}>{fmt(product.price)}</span>
                    {/* Toggle */}
                    <button onClick={() => toggleProductAvailability(product.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-700 transition-all"
                      style={{ background: product.available ? '#EDFAF0' : '#FEECEC', color: product.available ? '#2D7A3D' : '#DC5F5F' }}>
                      <div className={`w-8 h-4 rounded-full relative transition-all`} style={{ background: product.available ? '#5BA85A' : '#E8E4DE' }}>
                        <div className={`w-3 h-3 rounded-full absolute top-0.5 transition-all`} style={{ background: 'white', left: product.available ? '17px' : '2px' }} />
                      </div>
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => openProductModal(product)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: '#FEECEC', color: '#DC5F5F' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS ─────────────────────────────────────────────────────── */}
          {section === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-600" style={{ color: '#9C9490' }}>{users.length} usuários</p>
                <button onClick={() => openUserModal()} className="px-4 py-2.5 rounded-xl text-sm font-700 text-white" style={{ background: '#8B7FC7' }}>+ Novo Usuário</button>
              </div>
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                {users.map((user, i) => (
                  <div key={user.id} className={`px-5 py-4 flex items-center gap-4 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: '#F5F2EE' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-800 text-white flex-shrink-0" style={{ background: '#8B7FC7' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-700" style={{ color: '#3D3830' }}>{user.name}</p>
                      <p className="text-xs font-500" style={{ color: '#9C9490' }}>{user.email}</p>
                    </div>
                    <Badge color="#4B3FA8" bg="#EEF0FA">{ROLE_LABELS[user.role]}</Badge>
                    <Badge color={user.active ? '#2D7A3D' : '#B72B2B'} bg={user.active ? '#EDFAF0' : '#FEECEC'}>{user.active ? 'Ativo' : 'Inativo'}</Badge>
                    <span className="text-xs font-500" style={{ color: '#9C9490' }}>{user.createdAt}</span>
                    <div className="flex gap-2">
                      <button onClick={() => openUserModal(user)} className="w-8 h-8 rounded-xl flex items-center justify-center border" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FEECEC', color: '#DC5F5F' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TABLETS ───────────────────────────────────────────────────── */}
          {section === 'tablets' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="font-600" style={{ color: '#9C9490' }}>{tablets.length} tablets cadastrados</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tablets.map(tablet => (
                  <div key={tablet.id} className="rounded-2xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FA' }}>
                        <span>📱</span>
                      </div>
                      <div>
                        <p className="font-800" style={{ color: '#3D3830' }}>{tablet.id}</p>
                        <p className="text-xs font-500" style={{ color: '#9C9490' }}>Mesa {String(tablet.tableNumber).padStart(2, '0')}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge color={tablet.active ? '#2D7A3D' : '#B72B2B'} bg={tablet.active ? '#EDFAF0' : '#FEECEC'}>
                        {tablet.active ? '● Online' : '○ Offline'}
                      </Badge>
                      <span className="text-xs font-500" style={{ color: '#9C9490' }}>{fmtTime(tablet.lastSeen)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REPORTS ───────────────────────────────────────────────────── */}
          {section === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Vendas do Dia', value: fmt(todayRevenue), icon: '💰' },
                  { label: 'Pedidos Hoje', value: orders.length, icon: '📋' },
                  { label: 'Ticket Médio', value: fmt(orders.length > 0 ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0), icon: '📊' },
                  { label: 'Contas Pagas', value: sessions.filter(s => s.status === 'paid').length, icon: '✅' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                    <p className="text-2xl mb-2">{stat.icon}</p>
                    <p className="font-800 text-xl" style={{ color: '#3D3830' }}>{stat.value}</p>
                    <p className="text-xs font-600 mt-1" style={{ color: '#9C9490' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                <p className="font-800 mb-4" style={{ color: '#3D3830' }}>Faturamento por Hora</p>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                    <XAxis dataKey="hora" tick={{ fontSize: 11, fontWeight: 600, fill: '#9C9490', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9C9490', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E8E4DE', fontFamily: 'Nunito' }} />
                    <Legend wrapperStyle={{ fontFamily: 'Nunito', fontWeight: 600 }} />
                    <Line type="monotone" dataKey="pedidos" stroke="#8B7FC7" strokeWidth={2.5} dot={{ fill: '#8B7FC7', strokeWidth: 0, r: 4 }} name="Pedidos" />
                    <Line type="monotone" dataKey="faturamento" stroke="#7E9478" strokeWidth={2.5} dot={{ fill: '#7E9478', strokeWidth: 0, r: 4 }} name="Faturamento (R$)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── SETTINGS ──────────────────────────────────────────────────── */}
          {section === 'settings' && (
            <div className="max-w-lg space-y-4">
              {[
                { label: 'Nome do Restaurante', value: 'TabMesa Restaurante' },
                { label: 'CNPJ', value: '12.345.678/0001-90' },
                { label: 'Endereço', value: 'Rua das Flores, 123 — São Paulo, SP' },
                { label: 'Telefone', value: '(11) 99999-0000' },
              ].map(field => (
                <div key={field.label} className="rounded-2xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                  <p className="text-xs font-700 mb-1" style={{ color: '#9C9490' }}>{field.label}</p>
                  <p className="font-700" style={{ color: '#3D3830' }}>{field.value}</p>
                </div>
              ))}
              <button className="px-5 py-3 rounded-xl font-700 text-white" style={{ background: '#8B7FC7' }}>Salvar Configurações</button>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ──────────────────────────────────────────────────────────── */}
      {(modal?.type === 'addProduct' || modal?.type === 'editProduct') && (
        <Modal title={modal.type === 'addProduct' ? 'Novo Produto' : 'Editar Produto'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Nome">
              <input className={inputCls} style={inputStyle} value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="Ex: Hambúrguer TabMesa" />
            </Field>
            <Field label="Categoria">
              <select className={inputCls} style={inputStyle} value={pForm.category} onChange={e => setPForm(f => ({ ...f, category: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur}>
                <option value="">Selecione...</option>
                {['Entradas', 'Hambúrgueres', 'Pratos Principais', 'Massas', 'Pizzas', 'Sobremesas', 'Bebidas', 'Acompanhamentos'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Descrição">
              <textarea className={inputCls} style={{ ...inputStyle, resize: 'none' }} rows={3} value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))} onFocus={inputFocus as any} onBlur={inputBlur as any} placeholder="Descrição do produto..." />
            </Field>
            <Field label="Preço (R$)">
              <input type="number" step="0.01" className={inputCls} style={inputStyle} value={pForm.price} onChange={e => setPForm(f => ({ ...f, price: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="0,00" />
            </Field>
            <Field label="URL da Imagem">
              <input className={inputCls} style={inputStyle} value={pForm.image} onChange={e => setPForm(f => ({ ...f, image: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="https://..." />
            </Field>
            <div className="flex items-center gap-3">
              <button onClick={() => setPForm(f => ({ ...f, available: !f.available }))}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-700 transition-all"
                style={{ background: pForm.available ? '#EDFAF0' : '#FEECEC', color: pForm.available ? '#2D7A3D' : '#DC5F5F' }}>
                <div className="w-8 h-4 rounded-full relative" style={{ background: pForm.available ? '#5BA85A' : '#E8E4DE' }}>
                  <div className="w-3 h-3 rounded-full absolute top-0.5 transition-all" style={{ background: 'white', left: pForm.available ? '17px' : '2px' }} />
                </div>
                {pForm.available ? 'Disponível' : 'Indisponível'}
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-700 border" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>Cancelar</button>
              <button onClick={saveProduct} className="flex-1 py-3 rounded-xl font-700 text-white" style={{ background: '#8B7FC7' }}>
                {modal.type === 'addProduct' ? 'Salvar Produto' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {(modal?.type === 'addUser' || modal?.type === 'editUser') && (
        <Modal title={modal.type === 'addUser' ? 'Novo Usuário' : 'Editar Usuário'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Nome Completo">
              <input className={inputCls} style={inputStyle} value={uForm.name} onChange={e => setUForm(f => ({ ...f, name: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="Nome do usuário" />
            </Field>
            <Field label="E-mail">
              <input type="email" className={inputCls} style={inputStyle} value={uForm.email} onChange={e => setUForm(f => ({ ...f, email: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="email@tabmesa.com" />
            </Field>
            <Field label="Perfil">
              <select className={inputCls} style={inputStyle} value={uForm.role} onChange={e => setUForm(f => ({ ...f, role: e.target.value as UserRole }))} onFocus={inputFocus} onBlur={inputBlur}>
                <option value="admin">Administrador</option>
                <option value="cozinha">Cozinha</option>
                <option value="caixa">Caixa</option>
              </select>
            </Field>
            <Field label="Senha">
              <input type="password" className={inputCls} style={inputStyle} value={uForm.password} onChange={e => setUForm(f => ({ ...f, password: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="••••••••" />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-700 border" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>Cancelar</button>
              <button onClick={saveUser} className="flex-1 py-3 rounded-xl font-700 text-white" style={{ background: '#8B7FC7' }}>
                {modal.type === 'addUser' ? 'Cadastrar Usuário' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {(modal?.type === 'addTable' || modal?.type === 'editTable') && (
        <Modal title={modal.type === 'addTable' ? 'Nova Mesa' : 'Editar Mesa'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Número da Mesa">
              <input type="number" className={inputCls} style={inputStyle} value={tForm.number} onChange={e => setTForm(f => ({ ...f, number: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur} placeholder="Ex: 21" />
            </Field>
            <Field label="Tablet Vinculado">
              <select className={inputCls} style={inputStyle} value={tForm.tabletId} onChange={e => setTForm(f => ({ ...f, tabletId: e.target.value }))} onFocus={inputFocus} onBlur={inputBlur}>
                <option value="">Sem tablet</option>
                {tablets.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-700 border" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>Cancelar</button>
              <button onClick={saveTable} className="flex-1 py-3 rounded-xl font-700 text-white" style={{ background: '#8B7FC7' }}>
                {modal.type === 'addTable' ? 'Salvar Mesa' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
