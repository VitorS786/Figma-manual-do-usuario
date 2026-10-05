import { useState } from 'react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import type { Session, PaymentMethod } from '../types'

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  livre: { label: 'Livre', color: '#2D7A3D', bg: '#EDFAF0', dot: '#5BA85A' },
  em_refeicao: { label: 'Em Refeição', color: '#4B3FA8', bg: '#EEF0FA', dot: '#8B7FC7' },
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: '#9A5F00', bg: '#FFF4E5', dot: '#C8933A' },
  pago: { label: 'Pago', color: '#2D7A3D', bg: '#E8F5EA', dot: '#5BA85A' },
  indisponivel: { label: 'Indisponível', color: '#B72B2B', bg: '#FEECEC', dot: '#DC5F5F' },
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
  { id: 'debito', label: 'Cartão de Débito', icon: '💳' },
  { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'pix', label: 'PIX', icon: '📱' },
]

function TableCard({ table, session, onClick }: { table: any; session?: Session; onClick: () => void }) {
  const st = STATUS_LABELS[table.status] || STATUS_LABELS.livre
  const isAlert = table.status === 'aguardando_pagamento'
  return (
    <button onClick={onClick} className="rounded-2xl border p-4 text-left transition-all hover:shadow-md active:scale-[0.98]"
      style={{ background: '#FFFFFF', borderColor: isAlert ? '#C8933A' : '#E8E4DE', boxShadow: isAlert ? '0 4px 16px rgba(200,147,58,0.2)' : undefined }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-800 text-xl" style={{ color: '#3D3830' }}>Mesa {String(table.number).padStart(2, '0')}</p>
          <p className="text-xs font-500" style={{ color: '#9C9490' }}>{table.tabletId || '—'}</p>
        </div>
        {isAlert && <span className="text-sm animate-pulse">🔔</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: st.dot }} />
        <span className="text-xs font-700 px-2.5 py-1 rounded-lg" style={{ background: st.bg, color: st.color }}>{st.label}</span>
      </div>
      {session && (
        <p className="text-sm font-700 mt-2" style={{ color: '#9C9490' }}>{fmt(session.total)}</p>
      )}
    </button>
  )
}

export default function CashierView() {
  const { tables, sessions, orders, notifications, processPayment, markNotificationRead, logout, currentUser, getSessionOrders } = useApp()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentDone, setPaymentDone] = useState(false)
  const [activeTab, setActiveTab] = useState<'tables' | 'notifications'>('tables')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const getSession = (tableId: string) => sessions.find(s => s.tableId === tableId && (s.status === 'open' || s.status === 'awaiting_payment'))

  const selectedTableData = selectedTable ? tables.find(t => t.id === selectedTable) : null
  const selectedSession = selectedTable ? getSession(selectedTable) : null
  const sessionOrders = selectedSession ? getSessionOrders(selectedSession.id) : []

  const filteredTables = tables.filter(t => filterStatus === 'all' || t.status === filterStatus)
  const stats = {
    total: tables.length,
    livre: tables.filter(t => t.status === 'livre').length,
    em_refeicao: tables.filter(t => t.status === 'em_refeicao').length,
    aguardando: tables.filter(t => t.status === 'aguardando_pagamento').length,
    pago: tables.filter(t => t.status === 'pago').length,
  }

  const handleProcessPayment = () => {
    if (!paymentMethod || !selectedTable || !selectedSession) return
    processPayment(selectedTable, selectedSession.id, paymentMethod)
    setPaymentDone(true)
    if (unreadCount > 0) {
      notifications.filter(n => n.sessionId === selectedSession.id).forEach(n => markNotificationRead(n.id))
    }
  }

  const closeModal = () => { setSelectedTable(null); setPaymentMethod(null); setPaymentDone(false) }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F2EE' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="w-px h-6" style={{ background: '#E8E4DE' }} />
          <div>
            <p className="font-700" style={{ color: '#3D3830' }}>Painel do Caixa</p>
            <p className="text-xs font-500" style={{ color: '#9C9490' }}>{currentUser?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: '#E8E4DE' }}>
            {(['tables', 'notifications'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="relative px-4 py-2 text-sm font-700 transition-all"
                style={{ background: activeTab === tab ? '#8B7FC7' : '#FFFFFF', color: activeTab === tab ? 'white' : '#9C9490' }}>
                {tab === 'tables' ? 'Mesas' : (
                  <span className="flex items-center gap-1.5">
                    Notificações
                    {unreadCount > 0 && <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-800" style={{ background: '#DC5F5F', color: 'white' }}>{unreadCount}</span>}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button onClick={logout} className="px-3 py-2 rounded-xl text-sm font-600 border" style={{ borderColor: '#E8E4DE', color: '#9C9490' }}>Sair</button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto border-b" style={{ background: '#FAFAF9', borderColor: '#E8E4DE' }}>
        {[
          { label: 'Total de Mesas', value: stats.total, color: '#3D3830', bg: '#F5F2EE' },
          { label: 'Livres', value: stats.livre, color: '#2D7A3D', bg: '#EDFAF0' },
          { label: 'Em Refeição', value: stats.em_refeicao, color: '#4B3FA8', bg: '#EEF0FA' },
          { label: 'Aguardando Pgto.', value: stats.aguardando, color: '#9A5F00', bg: '#FFF4E5' },
          { label: 'Pagos Hoje', value: stats.pago, color: '#2D7A3D', bg: '#E8F5EA' },
        ].map(stat => (
          <div key={stat.label} className="flex-shrink-0 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: stat.bg }}>
            <span className="text-2xl font-800" style={{ color: stat.color }}>{stat.value}</span>
            <span className="text-xs font-600" style={{ color: stat.color, opacity: 0.8 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {activeTab === 'tables' ? (
        <div className="flex-1 p-6">
          {/* Filter */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'livre', label: 'Livres' },
              { value: 'em_refeicao', label: 'Em Refeição' },
              { value: 'aguardando_pagamento', label: 'Aguardando Pgto.' },
              { value: 'pago', label: 'Pagas' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilterStatus(f.value)}
                className="px-4 py-2 rounded-xl text-sm font-600 transition-all"
                style={{ background: filterStatus === f.value ? '#8B7FC7' : '#FFFFFF', color: filterStatus === f.value ? 'white' : '#9C9490', border: `1.5px solid ${filterStatus === f.value ? '#8B7FC7' : '#E8E4DE'}` }}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTables.map(table => (
              <TableCard key={table.id} table={table} session={getSession(table.id)}
                onClick={() => { if (table.status !== 'livre') setSelectedTable(table.id) }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6">
          <h2 className="font-800 text-lg mb-4" style={{ color: '#3D3830' }}>Notificações</h2>
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔔</p>
              <p className="font-600" style={{ color: '#9C9490' }}>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-lg">
              {[...notifications].reverse().map(notif => (
                <div key={notif.id} className="rounded-2xl border p-4 transition-all"
                  style={{ background: '#FFFFFF', borderColor: notif.read ? '#E8E4DE' : '#C8933A', opacity: notif.read ? 0.7 : 1 }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔔</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-700" style={{ color: '#3D3830' }}>Nova conta aguardando pagamento</p>
                        {!notif.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C8933A' }} />}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-600" style={{ color: '#9C9490' }}>Mesa {String(notif.tableNumber).padStart(2, '0')}</p>
                        <p className="font-700" style={{ color: '#C8933A' }}>{fmt(notif.amount)}</p>
                        <p className="font-500" style={{ color: '#9C9490' }}>Às {fmtTime(notif.createdAt)}</p>
                      </div>
                    </div>
                    {!notif.read && (
                      <button onClick={() => { setSelectedTable(notif.tableId); markNotificationRead(notif.id); setActiveTab('tables') }}
                        className="px-3 py-1.5 rounded-xl text-sm font-700 text-white flex-shrink-0"
                        style={{ background: '#C8933A' }}>
                        Abrir conta
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table detail / payment modal */}
      {selectedTable && selectedTableData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={closeModal}>
          <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#FFFFFF' }} onClick={e => e.stopPropagation()}>
            {paymentDone ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#EDFAF0' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA85A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-800 mb-2" style={{ color: '#3D3830' }}>Pagamento realizado! ✓</h3>
                <p className="font-500 mb-6" style={{ color: '#9C9490' }}>Mesa {String(selectedTableData.number).padStart(2, '0')} liberada com sucesso.</p>
                {selectedSession && (
                  <div className="rounded-2xl p-4 border space-y-2 mb-6" style={{ background: '#F9F8F6', borderColor: '#E8E4DE' }}>
                    <div className="flex justify-between text-sm"><span className="font-600" style={{ color: '#9C9490' }}>Valor pago</span><span className="font-700" style={{ color: '#3D3830' }}>{fmt(selectedSession.total)}</span></div>
                    <div className="flex justify-between text-sm"><span className="font-600" style={{ color: '#9C9490' }}>Forma de pagamento</span><span className="font-700" style={{ color: '#3D3830' }}>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</span></div>
                  </div>
                )}
                <button onClick={closeModal} className="w-full py-3.5 rounded-xl font-700 text-white" style={{ background: '#7E9478' }}>Fechar</button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E4DE', background: '#F9F8F6' }}>
                  <div>
                    <p className="font-800 text-lg" style={{ color: '#3D3830' }}>Mesa {String(selectedTableData.number).padStart(2, '0')}</p>
                    {selectedSession && <p className="text-xs font-500" style={{ color: '#9C9490' }}>Aberta às {fmtTime(selectedSession.openedAt)}</p>}
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F5F2EE' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9C9490" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                  {/* Orders */}
                  {sessionOrders.length > 0 ? (
                    <div className="space-y-3 mb-5">
                      {sessionOrders.map(order => (
                        <div key={order.id} className="rounded-xl p-4 border" style={{ background: '#F9F8F6', borderColor: '#E8E4DE' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-700 text-sm" style={{ color: '#3D3830' }}>Pedido #{order.number}</span>
                            <span className="font-600 text-xs" style={{ color: '#9C9490' }}>{fmtTime(order.createdAt)}</span>
                          </div>
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm py-0.5">
                              <span className="font-500" style={{ color: '#3D3830' }}>{item.quantity}x {item.name}</span>
                              <span className="font-600" style={{ color: '#9C9490' }}>{fmt(item.price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between mt-2 pt-2 border-t" style={{ borderColor: '#E8E4DE' }}>
                            <span className="font-700 text-sm" style={{ color: '#3D3830' }}>Subtotal</span>
                            <span className="font-700 text-sm" style={{ color: '#8B7FC7' }}>{fmt(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-500 mb-4" style={{ color: '#9C9490' }}>Nenhum pedido registrado.</p>
                  )}

                  {/* Total */}
                  {selectedSession && (
                    <div className="rounded-xl p-4 border mb-5 flex justify-between items-center" style={{ background: '#EEF0FA', borderColor: '#D8D4F0' }}>
                      <span className="font-700 text-lg" style={{ color: '#3D3830' }}>Total da conta</span>
                      <span className="font-800 text-2xl" style={{ color: '#8B7FC7' }}>{fmt(selectedSession.total)}</span>
                    </div>
                  )}

                  {/* Payment methods */}
                  {selectedTableData.status === 'aguardando_pagamento' && (
                    <div>
                      <p className="font-700 mb-3" style={{ color: '#3D3830' }}>Forma de pagamento</p>
                      <div className="grid grid-cols-2 gap-2">
                        {PAYMENT_METHODS.map(m => (
                          <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                            className="flex items-center gap-2 p-3 rounded-xl border transition-all"
                            style={{ background: paymentMethod === m.id ? '#8B7FC7' : '#FFFFFF', borderColor: paymentMethod === m.id ? '#8B7FC7' : '#E8E4DE', color: paymentMethod === m.id ? 'white' : '#3D3830' }}>
                            <span>{m.icon}</span>
                            <span className="text-sm font-700">{m.label}</span>
                          </button>
                        ))}
                      </div>
                      <button onClick={handleProcessPayment} disabled={!paymentMethod}
                        className="w-full mt-4 py-4 rounded-xl font-700 text-white transition-all"
                        style={{ background: paymentMethod ? '#7E9478' : '#D4CFC9', cursor: paymentMethod ? 'pointer' : 'not-allowed' }}>
                        Confirmar Pagamento
                      </button>
                      <p className="text-xs text-center mt-2 font-500" style={{ color: '#9C9490' }}>
                        O pagamento está sendo registrado após o cliente pagar presencialmente.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
