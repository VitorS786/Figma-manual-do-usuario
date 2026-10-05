import { useState, useEffect } from 'react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import type { Product, Order, Session } from '../types'

type Screen = 'welcome' | 'menu' | 'cart' | 'confirm' | 'success' | 'tracking' | 'account' | 'close-confirm' | 'bill-closed' | 'paid'

const CATEGORIES = ['Todos', 'Entradas', 'Hambúrgueres', 'Pratos Principais', 'Massas', 'Pizzas', 'Sobremesas', 'Bebidas', 'Acompanhamentos']

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    novo: { label: 'Recebido', bg: '#EEF0FA', color: '#4B3FA8' },
    em_preparo: { label: 'Em Preparo', bg: '#FFF4E5', color: '#9A5F00' },
    pronto: { label: 'Pronto! ✓', bg: '#EDFAF0', color: '#2D7A3D' },
    entregue: { label: 'Entregue', bg: '#F0F0F0', color: '#6B7280' },
    cancelado: { label: 'Cancelado', bg: '#FEECEC', color: '#B72B2B' },
  }
  const s = map[status] || map.novo
  return <span className="px-2.5 py-1 rounded-lg text-xs font-700" style={{ background: s.bg, color: s.color }}>{s.label}</span>
}

export default function TabletView() {
  const { currentUser, products, cart, addToCart, removeFromCart, updateCartQty, clearCart,
    placeOrder, createSession, getTableSession, getSessionOrders, closeTableBill, tables } = useApp()

  const tableId = currentUser!.tableId!
  const tableNumber = currentUser!.tableNumber!
  const tabletId = currentUser!.tabletId!

  const [screen, setScreen] = useState<Screen>('welcome')
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productQty, setProductQty] = useState(1)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [session, setSession] = useState<Session | undefined>(() => undefined)
  const [toast, setToast] = useState('')

  // Sync session and table status
  const currentTable = tables.find(t => t.id === tableId)

  useEffect(() => {
    const s = getTableSession(tableId)
    setSession(s)
    if (currentTable?.status === 'livre' && screen !== 'welcome' && screen !== 'menu' && screen !== 'cart' && screen !== 'confirm' && screen !== 'success' && screen !== 'tracking') {
      // table was reset after payment
    }
    if (currentTable?.status === 'pago') setScreen('paid')
    if (currentTable?.status === 'aguardando_pagamento' && session?.status === 'awaiting_payment') {
      if (screen !== 'bill-closed' && screen !== 'paid') setScreen('bill-closed')
    }
  }, [tables])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0)
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  const sessionOrders = session ? getSessionOrders(session.id) : []
  const accountTotal = session ? session.total : 0

  const filteredProducts = products.filter(p => {
    const matchCat = category === 'Todos' || p.category === category
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handlePlaceOrder = () => {
    if (cart.length === 0) return
    let activeSession = getTableSession(tableId)
    if (!activeSession) activeSession = createSession(tableId, tableNumber, tabletId)
    setSession(activeSession)
    const order = placeOrder(activeSession.id, tableId, tableNumber, tabletId, cart)
    setLastOrder(order)
    clearCart()
    setScreen('success')
  }

  const handleCloseBill = () => {
    const activeSession = getTableSession(tableId)
    if (activeSession) { closeTableBill(tableId, activeSession.id); setSession({ ...activeSession, status: 'awaiting_payment' }); setScreen('bill-closed') }
  }

  // ─── WELCOME SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    const tableStatus = currentTable?.status
    if (tableStatus === 'pago') return <PaidScreen tableNumber={tableNumber} setScreen={setScreen} />

    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #8B7FC7 0%, #6B5FB5 50%, #4A3F8A 100%)' }}>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Logo size="lg" variant="full" dark />
          <div className="mt-8 mb-6">
            <p className="text-white/70 text-lg font-500 mb-1">Bem-vindo!</p>
            <h1 className="text-white text-5xl font-800 mb-3">Mesa {String(tableNumber).padStart(2, '0')}</h1>
            <p className="text-white/60 font-500">Faça seu pedido diretamente pelo tablet.</p>
          </div>
          {tableStatus === 'aguardando_pagamento' ? (
            <div className="mt-4 p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <p className="text-2xl mb-2">🧾</p>
              <p className="text-white font-700 text-lg mb-1">Conta Fechada</p>
              <p className="text-white/70 font-500 text-sm">Dirija-se ao caixa para realizar o pagamento.</p>
            </div>
          ) : (
            <button onClick={() => setScreen('menu')} className="mt-6 px-10 py-4 rounded-2xl font-700 text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: '#FFFFFF', color: '#8B7FC7' }}>
              Ver Cardápio
            </button>
          )}
        </div>
        {tableStatus === 'em_refeicao' && session && (
          <div className="p-4 flex gap-3">
            <button onClick={() => setScreen('tracking')} className="flex-1 py-3.5 rounded-xl font-700 text-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
              🍽 Meu Pedido
            </button>
            <button onClick={() => setScreen('account')} className="flex-1 py-3.5 rounded-xl font-700 text-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
              💰 Minha Conta
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── SHARED HEADER ───────────────────────────────────────────────────────────
  const Header = ({ back, title }: { back?: Screen; title?: string }) => (
    <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 border-b" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
      {back && (
        <button onClick={() => setScreen(back)} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: '#F5F2EE' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3830" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      )}
      <div className="flex items-center gap-2 flex-1">
        {!back && <Logo size="sm" />}
        {title && <span className="font-700" style={{ color: '#3D3830' }}>{title}</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-700 px-2.5 py-1 rounded-lg" style={{ background: '#EEF0FA', color: '#8B7FC7' }}>
          Mesa {String(tableNumber).padStart(2, '0')}
        </span>
        {screen !== 'cart' && screen !== 'account' && (
          <button onClick={() => setScreen('cart')} className="relative w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: cartCount > 0 ? '#8B7FC7' : '#F5F2EE' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cartCount > 0 ? 'white' : '#3D3830'} strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-700" style={{ background: '#DC5F5F', fontSize: '10px' }}>{cartCount}</span>}
          </button>
        )}
      </div>
    </div>
  )

  // ─── MENU ────────────────────────────────────────────────────────────────────
  if (screen === 'menu') {
    return (
      <div className="min-h-screen" style={{ background: '#F5F2EE' }}>
        <Header />
        {/* Account total banner */}
        {accountTotal > 0 && (
          <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ background: '#EEF0FA', borderColor: '#D8D4F0' }}>
            <span className="text-sm font-600" style={{ color: '#8B7FC7' }}>Conta atual</span>
            <button onClick={() => setScreen('account')} className="font-800 text-base" style={{ color: '#8B7FC7' }}>{fmt(accountTotal + cartTotal)}</button>
          </div>
        )}
        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9C9490" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pratos, bebidas..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border font-500 outline-none transition-all"
              style={{ background: '#FFFFFF', borderColor: '#E8E4DE', color: '#3D3830' }}
              onFocus={e => e.target.style.borderColor = '#8B7FC7'} onBlur={e => e.target.style.borderColor = '#E8E4DE'} />
          </div>
        </div>
        {/* Categories */}
        <div className="px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className="px-4 py-2 rounded-xl text-sm font-600 whitespace-nowrap transition-all"
                style={{ background: category === cat ? '#8B7FC7' : '#FFFFFF', color: category === cat ? '#FFFFFF' : '#9C9490', border: `1.5px solid ${category === cat ? '#8B7FC7' : '#E8E4DE'}` }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Products */}
        <div className="px-4 pb-32 space-y-4 mt-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-600" style={{ color: '#9C9490' }}>Nenhum produto encontrado</p>
            </div>
          ) : filteredProducts.map(product => (
            <div key={product.id} className="rounded-2xl overflow-hidden border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
              <div className="flex gap-0">
                <div className="relative w-28 h-28 flex-shrink-0 bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" style={{ opacity: product.available ? 1 : 0.5 }} />
                  {!product.available && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <span className="text-white text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: '#DC5F5F' }}>Indisponível</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <p className="font-700" style={{ color: '#3D3830' }}>{product.name}</p>
                    <p className="text-xs font-500 mt-0.5 line-clamp-2" style={{ color: '#9C9490' }}>{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-800 text-base" style={{ color: '#8B7FC7' }}>{fmt(product.price)}</span>
                    {product.available ? (
                      <button onClick={() => { setSelectedProduct(product); setProductQty(1) }}
                        className="px-3 py-1.5 rounded-xl text-sm font-700 transition-all active:scale-95"
                        style={{ background: '#8B7FC7', color: '#FFFFFF' }}>
                        + Adicionar
                      </button>
                    ) : (
                      <span className="text-xs font-600 px-3 py-1.5 rounded-xl" style={{ background: '#F5F2EE', color: '#9C9490' }}>Indisponível</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart FAB */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 left-4 right-4 z-40">
            <button onClick={() => setScreen('cart')} className="w-full py-4 rounded-2xl font-700 text-white flex items-center justify-between px-5 shadow-lg transition-all active:scale-[0.99]"
              style={{ background: '#8B7FC7', boxShadow: '0 8px 24px rgba(139,127,199,0.4)' }}>
              <span className="w-7 h-7 rounded-xl flex items-center justify-center font-800 text-sm" style={{ background: 'rgba(255,255,255,0.25)' }}>{cartCount}</span>
              <span>Ver pedido</span>
              <span className="font-800">{fmt(cartTotal)}</span>
            </button>
          </div>
        )}

        {/* Product modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setSelectedProduct(null)}>
            <div className="w-full rounded-t-3xl overflow-hidden" style={{ background: '#FFFFFF' }} onClick={e => e.stopPropagation()}>
              <div className="h-52 relative" style={{ background: '#F5F2EE' }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="p-5">
                <p className="font-800 text-xl" style={{ color: '#3D3830' }}>{selectedProduct.name}</p>
                <p className="text-sm font-500 mt-1.5 leading-relaxed" style={{ color: '#9C9490' }}>{selectedProduct.description}</p>
                <div className="flex items-center justify-between mt-5">
                  <span className="font-800 text-2xl" style={{ color: '#8B7FC7' }}>{fmt(selectedProduct.price)}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProductQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl font-700 text-lg flex items-center justify-center transition-all active:scale-90" style={{ background: '#F5F2EE', color: '#3D3830' }}>−</button>
                    <span className="w-8 text-center font-800 text-lg" style={{ color: '#3D3830' }}>{productQty}</span>
                    <button onClick={() => setProductQty(q => q + 1)} className="w-9 h-9 rounded-xl font-700 text-lg flex items-center justify-center transition-all active:scale-90" style={{ background: '#8B7FC7', color: 'white' }}>+</button>
                  </div>
                </div>
                <button onClick={() => { addToCart(selectedProduct, productQty); setSelectedProduct(null); showToast('Produto adicionado ao pedido!') }}
                  className="w-full mt-4 py-4 rounded-2xl font-700 text-white text-lg transition-all active:scale-[0.99]"
                  style={{ background: '#8B7FC7' }}>
                  Adicionar ao Pedido · {fmt(selectedProduct.price * productQty)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed top-20 left-4 right-4 z-50 text-center">
            <span className="inline-block px-5 py-2.5 rounded-2xl font-600 text-sm text-white shadow-lg" style={{ background: '#7E9478' }}>{toast}</span>
          </div>
        )}
      </div>
    )
  }

  // ─── CART ────────────────────────────────────────────────────────────────────
  if (screen === 'cart') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F5F2EE' }}>
        <Header back="menu" title="Meu Pedido" />
        <div className="flex-1 p-4 space-y-3 pb-40">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-700 text-lg" style={{ color: '#3D3830' }}>Pedido vazio</p>
              <p className="font-500 text-sm mt-1" style={{ color: '#9C9490' }}>Adicione itens do cardápio</p>
              <button onClick={() => setScreen('menu')} className="mt-5 px-6 py-3 rounded-xl font-700 text-white" style={{ background: '#8B7FC7' }}>Ver Cardápio</button>
            </div>
          ) : cart.map(item => (
            <div key={item.product.id} className="rounded-2xl p-4 flex items-center gap-3 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
              <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-700 truncate" style={{ color: '#3D3830' }}>{item.product.name}</p>
                <p className="text-sm font-500" style={{ color: '#9C9490' }}>{fmt(item.product.price)} cada</p>
                <p className="font-700 mt-0.5" style={{ color: '#8B7FC7' }}>{fmt(item.product.price * item.quantity)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeFromCart(item.product.id)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#FEECEC' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#DC5F5F" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-xl font-700 text-lg flex items-center justify-center" style={{ background: '#F5F2EE', color: '#3D3830' }}>−</button>
                  <span className="w-6 text-center font-800" style={{ color: '#3D3830' }}>{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-xl font-700 text-lg flex items-center justify-center" style={{ background: '#8B7FC7', color: 'white' }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
            <div className="flex justify-between mb-3 px-1">
              <span className="font-600" style={{ color: '#9C9490' }}>Total do pedido</span>
              <span className="font-800 text-lg" style={{ color: '#3D3830' }}>{fmt(cartTotal)}</span>
            </div>
            <button onClick={() => setScreen('confirm')} className="w-full py-4 rounded-2xl font-700 text-white text-lg" style={{ background: '#8B7FC7' }}>
              Confirmar Pedido
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── CONFIRM ORDER ───────────────────────────────────────────────────────────
  if (screen === 'confirm') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F5F2EE' }}>
        <Header back="cart" title="Confira seu Pedido" />
        <div className="flex-1 p-4 pb-36">
          <div className="rounded-2xl p-4 mb-4 border" style={{ background: '#EEF0FA', borderColor: '#D8D4F0' }}>
            <p className="font-600 text-sm" style={{ color: '#8B7FC7' }}>Mesa {String(tableNumber).padStart(2, '0')} · Tablet {tabletId}</p>
          </div>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center p-4 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                <div>
                  <p className="font-700" style={{ color: '#3D3830' }}>{item.product.name}</p>
                  <p className="text-sm font-500" style={{ color: '#9C9490' }}>{item.quantity}x · {fmt(item.product.price)}</p>
                </div>
                <span className="font-800" style={{ color: '#8B7FC7' }}>{fmt(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
            <div className="flex justify-between items-center">
              <span className="font-700 text-lg" style={{ color: '#3D3830' }}>Total</span>
              <span className="font-800 text-2xl" style={{ color: '#8B7FC7' }}>{fmt(cartTotal)}</span>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t space-y-3" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
          <button onClick={() => setScreen('menu')} className="w-full py-3.5 rounded-2xl font-700 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE', color: '#3D3830' }}>
            + Adicionar mais itens
          </button>
          <button onClick={handlePlaceOrder} className="w-full py-4 rounded-2xl font-700 text-white text-lg" style={{ background: '#8B7FC7' }}>
            Confirmar Pedido
          </button>
        </div>
      </div>
    )
  }

  // ─── SUCCESS ─────────────────────────────────────────────────────────────────
  if (screen === 'success' && lastOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#F5F2EE' }}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#EDFAF0' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5BA85A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-3xl font-800 mb-2" style={{ color: '#3D3830' }}>Pedido enviado!</h2>
          <p className="font-500" style={{ color: '#9C9490' }}>Seu pedido foi enviado para a cozinha.</p>
        </div>
        <div className="w-full max-w-sm rounded-2xl p-5 border space-y-2" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
          <div className="flex justify-between"><span className="font-600" style={{ color: '#9C9490' }}>Pedido</span><span className="font-700" style={{ color: '#3D3830' }}>#{lastOrder.number}</span></div>
          <div className="flex justify-between"><span className="font-600" style={{ color: '#9C9490' }}>Mesa</span><span className="font-700" style={{ color: '#3D3830' }}>{String(tableNumber).padStart(2, '0')}</span></div>
          <div className="flex justify-between"><span className="font-600" style={{ color: '#9C9490' }}>Horário</span><span className="font-700" style={{ color: '#3D3830' }}>{fmtTime(lastOrder.createdAt)}</span></div>
          <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#E8E4DE' }}><span className="font-700 text-lg" style={{ color: '#3D3830' }}>Total</span><span className="font-800 text-xl" style={{ color: '#8B7FC7' }}>{fmt(lastOrder.total)}</span></div>
        </div>
        <button onClick={() => setScreen('tracking')} className="mt-6 w-full max-w-sm py-4 rounded-2xl font-700 text-white" style={{ background: '#8B7FC7' }}>Acompanhar Pedido</button>
        <button onClick={() => setScreen('menu')} className="mt-3 w-full max-w-sm py-3.5 rounded-2xl font-700 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE', color: '#3D3830' }}>+ Adicionar mais itens</button>
      </div>
    )
  }

  // ─── TRACKING ────────────────────────────────────────────────────────────────
  if (screen === 'tracking') {
    return (
      <div className="min-h-screen" style={{ background: '#F5F2EE' }}>
        <Header back="menu" title="Acompanhar Pedido" />
        <div className="p-4 space-y-4">
          {sessionOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-3">📋</p>
              <p className="font-600" style={{ color: '#9C9490' }}>Nenhum pedido ainda</p>
            </div>
          ) : sessionOrders.map(order => {
            const steps = [
              { key: 'novo', label: 'Pedido enviado', icon: '📤' },
              { key: 'novo', label: 'Recebido pela cozinha', icon: '👨‍🍳' },
              { key: 'em_preparo', label: 'Em preparo', icon: '🍳' },
              { key: 'pronto', label: 'Pronto!', icon: '✅' },
              { key: 'entregue', label: 'Entregue', icon: '🎉' },
            ]
            const stepIndex = ['novo', 'novo', 'em_preparo', 'pronto', 'entregue'].indexOf(order.status)
            const activeStep = Math.max(0, stepIndex)

            return (
              <div key={order.id} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E8E4DE', background: '#F9F8F6' }}>
                  <span className="font-700" style={{ color: '#3D3830' }}>Pedido #{order.number}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-600 text-sm" style={{ color: '#9C9490' }}>{fmtTime(order.createdAt)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="p-4">
                  {/* Items */}
                  <div className="mb-4 space-y-1">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="font-500" style={{ color: '#3D3830' }}>{item.quantity}x {item.name}</span>
                        <span className="font-600" style={{ color: '#9C9490' }}>{fmt(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {/* Timeline */}
                  <div className="space-y-2">
                    {steps.map((step, i) => {
                      const done = i <= activeStep
                      const active = i === activeStep
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all`}
                            style={{ background: done ? (active ? '#8B7FC7' : '#EDFAF0') : '#F5F2EE' }}>
                            {done ? (active ? step.icon : '✓') : '○'}
                          </div>
                          <span className={`text-sm font-${done ? '700' : '500'}`} style={{ color: done ? '#3D3830' : '#C0BAB5' }}>{step.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: '#FFFFFF', borderTop: '1px solid #E8E4DE' }}>
          <button onClick={() => setScreen('account')} className="w-full py-4 rounded-2xl font-700 text-white" style={{ background: '#8B7FC7' }}>Ver Minha Conta</button>
        </div>
      </div>
    )
  }

  // ─── ACCOUNT ─────────────────────────────────────────────────────────────────
  if (screen === 'account') {
    const canClose = session && session.status === 'open' && sessionOrders.length > 0
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F5F2EE' }}>
        <Header back="menu" title="Minha Conta" />
        <div className="flex-1 p-4 space-y-4 pb-48">
          <div className="rounded-2xl p-4 border" style={{ background: '#EEF0FA', borderColor: '#D8D4F0' }}>
            <p className="font-700 text-lg" style={{ color: '#8B7FC7' }}>Mesa {String(tableNumber).padStart(2, '0')}</p>
            {session && <p className="text-sm font-500 mt-0.5" style={{ color: '#9C9490' }}>Aberta às {fmtTime(session.openedAt)}</p>}
          </div>
          {sessionOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🧾</p>
              <p className="font-600" style={{ color: '#9C9490' }}>Nenhum pedido realizado ainda</p>
            </div>
          ) : sessionOrders.map(order => (
            <div key={order.id} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E8E4DE', background: '#F9F8F6' }}>
                <span className="font-700" style={{ color: '#3D3830' }}>Pedido #{order.number}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <span className="font-700" style={{ color: '#8B7FC7' }}>{fmt(order.total)}</span>
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="font-500" style={{ color: '#3D3830' }}>{item.quantity}x {item.name}</span>
                    <span className="font-600" style={{ color: '#9C9490' }}>{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {accountTotal > 0 && (
            <div className="rounded-2xl p-4 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
              <div className="flex justify-between items-center">
                <span className="font-700 text-lg" style={{ color: '#3D3830' }}>Total da conta</span>
                <span className="font-800 text-2xl" style={{ color: '#8B7FC7' }}>{fmt(accountTotal)}</span>
              </div>
            </div>
          )}
        </div>
        {canClose && (
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t space-y-3" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
            <button onClick={() => setScreen('menu')} className="w-full py-3.5 rounded-2xl font-700 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE', color: '#3D3830' }}>
              + Adicionar mais itens
            </button>
            <button onClick={() => setScreen('close-confirm')} className="w-full py-4 rounded-2xl font-700 text-white text-lg"
              style={{ background: '#C8933A', boxShadow: '0 4px 16px rgba(200,147,58,0.3)' }}>
              Fechar Conta
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── CLOSE BILL CONFIRM ──────────────────────────────────────────────────────
  if (screen === 'close-confirm') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#F5F2EE' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FFF4E5' }}>
              <span className="text-3xl">🧾</span>
            </div>
            <h2 className="text-2xl font-800" style={{ color: '#3D3830' }}>Fechar conta?</h2>
          </div>
          <div className="rounded-2xl p-5 border mb-6 space-y-2" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
            <p className="text-sm font-600" style={{ color: '#9C9490' }}>Você está encerrando seu consumo nesta mesa.</p>
            <p className="text-sm font-600" style={{ color: '#9C9490' }}>Após fechar a conta, não será possível realizar novos pedidos pelo tablet.</p>
            <p className="text-sm font-600 mt-2" style={{ color: '#3D3830' }}>Dirija-se ao caixa para realizar o pagamento.</p>
          </div>
          <div className="rounded-2xl p-4 border mb-6 flex justify-between items-center" style={{ background: '#EEF0FA', borderColor: '#D8D4F0' }}>
            <span className="font-700" style={{ color: '#8B7FC7' }}>Total</span>
            <span className="font-800 text-xl" style={{ color: '#8B7FC7' }}>{fmt(accountTotal)}</span>
          </div>
          <button onClick={handleCloseBill} className="w-full py-4 rounded-2xl font-700 text-white text-lg mb-3" style={{ background: '#C8933A' }}>
            Sim, fechar conta
          </button>
          <button onClick={() => setScreen('account')} className="w-full py-3.5 rounded-2xl font-700 border" style={{ background: '#FFFFFF', borderColor: '#E8E4DE', color: '#3D3830' }}>
            Voltar
          </button>
        </div>
      </div>
    )
  }

  // ─── BILL CLOSED ─────────────────────────────────────────────────────────────
  if (screen === 'bill-closed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(160deg, #F5F2EE, #EDE9E4)' }}>
        <div className="text-center w-full max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#FFF4E5' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C8933A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-3xl font-800 mb-2" style={{ color: '#3D3830' }}>Conta fechada! ✓</h2>
          <p className="font-500 mb-8" style={{ color: '#9C9490' }}>Seu consumo foi encerrado com sucesso.</p>
          <div className="rounded-2xl p-5 border space-y-3" style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}>
            <div className="flex justify-between"><span className="font-600" style={{ color: '#9C9490' }}>Mesa</span><span className="font-700" style={{ color: '#3D3830' }}>{String(tableNumber).padStart(2, '0')}</span></div>
            <div className="flex justify-between"><span className="font-600" style={{ color: '#9C9490' }}>Status</span><span className="text-sm font-700 px-2.5 py-1 rounded-lg" style={{ background: '#FFF4E5', color: '#9A5F00' }}>Aguardando pagamento</span></div>
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#E8E4DE' }}><span className="font-700 text-lg" style={{ color: '#3D3830' }}>Valor</span><span className="font-800 text-xl" style={{ color: '#C8933A' }}>{fmt(session?.total || accountTotal)}</span></div>
          </div>
          <div className="mt-6 p-4 rounded-2xl" style={{ background: '#EEF0FA' }}>
            <p className="text-sm font-600" style={{ color: '#8B7FC7' }}>Agora dirija-se ao caixa para realizar o pagamento. Estamos te esperando! 😊</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── PAID ────────────────────────────────────────────────────────────────────
  if (screen === 'paid') return <PaidScreen tableNumber={tableNumber} setScreen={setScreen} />

  return null
}

function PaidScreen({ tableNumber, setScreen }: { tableNumber: number; setScreen: (s: Screen) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(160deg, #7E9478, #5E7658)' }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 className="text-4xl font-800 text-white mb-2">Obrigado!</h1>
        <p className="text-white/70 font-500 text-lg mb-6">Pagamento confirmado com sucesso.</p>
        <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <p className="text-white/70 font-500 text-sm">Mesa {String(tableNumber).padStart(2, '0')}</p>
          <p className="text-white font-700 text-xl mt-1">🟢 Livre — Pronto para o próximo cliente</p>
        </div>
        <p className="text-white/60 font-500 text-sm">Volte sempre!</p>
      </div>
    </div>
  )
}
