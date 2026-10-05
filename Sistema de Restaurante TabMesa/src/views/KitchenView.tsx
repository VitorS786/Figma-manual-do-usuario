import { useState } from 'react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import type { Order, OrderStatus } from '../types'

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

function elapsed(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  return `${Math.floor(mins / 60)}h ${mins % 60}min`
}

interface Column {
  key: OrderStatus
  label: string
  next?: OrderStatus
  nextLabel?: string
  color: string
  bg: string
  emptyIcon: string
  emptyLabel: string
}

const COLUMNS: Column[] = [
  { key: 'novo', label: 'Novos Pedidos', next: 'em_preparo', nextLabel: 'Iniciar Preparo', color: '#8B7FC7', bg: '#EEF0FA', emptyIcon: '📭', emptyLabel: 'Nenhum pedido novo' },
  { key: 'em_preparo', label: 'Em Preparo', next: 'pronto', nextLabel: 'Marcar como Pronto', color: '#C8933A', bg: '#FFF4E5', emptyIcon: '🍳', emptyLabel: 'Nenhum em preparo' },
  { key: 'pronto', label: 'Prontos', next: 'entregue', nextLabel: 'Marcar como Entregue', color: '#5BA85A', bg: '#EDFAF0', emptyIcon: '✅', emptyLabel: 'Nenhum pronto' },
  { key: 'entregue', label: 'Entregues', color: '#9C9490', bg: '#F5F2EE', emptyIcon: '🎉', emptyLabel: 'Nenhum entregue' },
]

function OrderCard({ order, column, onAdvance }: { order: Order; column: Column; onAdvance: () => void }) {
  const isUrgent = column.key === 'novo' && (Date.now() - new Date(order.createdAt).getTime()) > 5 * 60000
  return (
    <div className="rounded-2xl border overflow-hidden transition-all hover:shadow-md"
      style={{ background: '#FFFFFF', borderColor: isUrgent && column.key === 'novo' ? '#DC5F5F' : '#E8E4DE', boxShadow: isUrgent && column.key === 'novo' ? '0 0 0 2px #DC5F5F30' : undefined }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: column.bg, borderColor: '#E8E4DE' }}>
        <div>
          <span className="font-800 text-base" style={{ color: column.color }}>#{order.number}</span>
          <span className="ml-2 font-600 text-sm" style={{ color: column.color, opacity: 0.7 }}>Mesa {String(order.tableNumber).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          {isUrgent && column.key === 'novo' && (
            <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: '#DC5F5F', color: 'white' }}>Urgente</span>
          )}
          <span className="text-xs font-600 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.7)', color: column.color }}>
            {fmtTime(order.createdAt)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-1.5 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-800 flex-shrink-0" style={{ background: column.bg, color: column.color }}>{item.quantity}x</span>
              <span className="text-sm font-600" style={{ color: '#3D3830' }}>{item.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-600" style={{ color: '#9C9490' }}>⏱ {elapsed(order.createdAt)}</span>
          <span className="text-sm font-700" style={{ color: '#9C9490' }}>{fmt(order.total)}</span>
        </div>
        {column.next && (
          <button onClick={onAdvance} className="w-full mt-3 py-3 rounded-xl font-700 text-white text-sm transition-all active:scale-[0.98]"
            style={{ background: column.color }}>
            {column.nextLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default function KitchenView() {
  const { orders, updateOrderStatus, logout, currentUser } = useApp()
  const [filter, setFilter] = useState<'all' | 'urgent'>('all')

  const relevantOrders = orders.filter(o => o.status !== 'cancelado')
  const counts: Record<string, number> = {
    novo: relevantOrders.filter(o => o.status === 'novo').length,
    em_preparo: relevantOrders.filter(o => o.status === 'em_preparo').length,
    pronto: relevantOrders.filter(o => o.status === 'pronto').length,
    entregue: relevantOrders.filter(o => o.status === 'entregue').length,
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F2EE' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="w-px h-6" style={{ background: '#E8E4DE' }} />
          <div>
            <p className="font-700" style={{ color: '#3D3830' }}>Painel da Cozinha</p>
            <p className="text-xs font-500" style={{ color: '#9C9490' }}>{currentUser?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {counts.novo > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: '#EEF0FA' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8B7FC7' }} />
                <span className="text-sm font-700" style={{ color: '#8B7FC7' }}>{counts.novo} novo{counts.novo > 1 ? 's' : ''}</span>
              </div>
            )}
            {counts.em_preparo > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: '#FFF4E5' }}>
                <span className="text-sm font-700" style={{ color: '#C8933A' }}>{counts.em_preparo} em preparo</span>
              </div>
            )}
          </div>
          <button onClick={logout} className="px-3 py-2 rounded-xl text-sm font-600 border transition-all hover:bg-red-50"
            style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>
            Sair
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-6 py-3 flex items-center gap-4 border-b" style={{ background: '#FAFAF9', borderColor: '#E8E4DE' }}>
        {COLUMNS.map(col => (
          <div key={col.key} className="flex items-center gap-2">
            <span className="text-sm font-600" style={{ color: '#9C9490' }}>{col.label}</span>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-800" style={{ background: col.bg, color: col.color }}>
              {counts[col.key]}
            </span>
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2">
          {(['all', 'urgent'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-xl text-xs font-700 transition-all"
              style={{ background: filter === f ? '#8B7FC7' : '#FFFFFF', color: filter === f ? 'white' : '#9C9490', border: `1.5px solid ${filter === f ? '#8B7FC7' : '#E8E4DE'}` }}>
              {f === 'all' ? 'Todos' : '🔥 Urgentes'}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-4 min-w-max h-full">
          {COLUMNS.map(col => {
            let colOrders = relevantOrders.filter(o => o.status === col.key)
            if (filter === 'urgent' && col.key === 'novo') {
              colOrders = colOrders.filter(o => (Date.now() - new Date(o.createdAt).getTime()) > 5 * 60000)
            }
            colOrders = colOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

            return (
              <div key={col.key} className="w-72 flex flex-col gap-3">
                {/* Column header */}
                <div className="rounded-2xl px-4 py-3 flex items-center justify-between" style={{ background: col.bg }}>
                  <span className="font-800" style={{ color: col.color }}>{col.label}</span>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center font-800 text-sm" style={{ background: col.color, color: 'white' }}>
                    {colOrders.length}
                  </span>
                </div>
                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)', paddingRight: '4px' }}>
                  {colOrders.length === 0 ? (
                    <div className="text-center py-10 rounded-2xl border-2 border-dashed" style={{ borderColor: '#E8E4DE' }}>
                      <p className="text-3xl mb-2">{col.emptyIcon}</p>
                      <p className="text-sm font-600" style={{ color: '#C0BAB5' }}>{col.emptyLabel}</p>
                    </div>
                  ) : colOrders.map(order => (
                    <OrderCard key={order.id} order={order} column={col}
                      onAdvance={() => col.next && updateOrderStatus(order.id, col.next!)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
