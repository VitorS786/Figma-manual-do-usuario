import { useState } from 'react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'

type Step = 'role' | 'credentials'
type Role = 'tablet' | 'cozinha' | 'caixa' | 'admin'

const ROLES = [
  { id: 'tablet' as Role, label: 'Cliente / Tablet', desc: 'Acesso pelo tablet da mesa', icon: '📱', color: '#8B7FC7' },
  { id: 'cozinha' as Role, label: 'Cozinha', desc: 'Painel de preparo de pedidos', icon: '👨‍🍳', color: '#C8933A' },
  { id: 'caixa' as Role, label: 'Caixa', desc: 'Pagamentos e fechamento de contas', icon: '💳', color: '#7E9478' },
  { id: 'admin' as Role, label: 'Administrador', desc: 'Gestão completa do sistema', icon: '⚙️', color: '#6B7280' },
]

export default function LoginView() {
  const { login, tablets } = useApp()
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [tabletId, setTabletId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const activeTablets = tablets.filter(t => t.active)

  const handleRoleSelect = (r: Role) => { setRole(r); setStep('credentials'); setError('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    let ok = false
    if (role === 'tablet') ok = login('tablet', tabletId)
    else if (role === 'admin') ok = login('admin', email, password)
    else if (role === 'cozinha') ok = login('cozinha', '', password)
    else if (role === 'caixa') ok = login('caixa', '', password)
    setLoading(false)
    if (!ok) setError('Credenciais inválidas. Tente novamente.')
  }

  const selectedRole = ROLES.find(r => r.id === role)

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #F5F2EE 0%, #EDE9E4 100%)' }}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: '#8B7FC7' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-15" style={{ background: '#7E9478' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-sm font-500" style={{ color: '#9C9490' }}>Sistema Integrado de Restaurante</p>
        </div>

        {step === 'role' ? (
          <div className="space-y-3">
            <p className="text-center font-700 text-lg mb-5" style={{ color: '#3D3830' }}>Selecione seu perfil de acesso</p>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => handleRoleSelect(r.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: '#FFFFFF', borderColor: '#E8E4DE' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.boxShadow = `0 4px 20px ${r.color}25` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DE'; e.currentTarget.style.boxShadow = 'none' }}>
                <span className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl" style={{ background: `${r.color}15` }}>{r.icon}</span>
                <div>
                  <p className="font-700" style={{ color: '#3D3830' }}>{r.label}</p>
                  <p className="text-sm font-500" style={{ color: '#9C9490' }}>{r.desc}</p>
                </div>
                <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9C9490" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border p-8" style={{ background: '#FFFFFF', borderColor: '#E8E4DE', boxShadow: '0 8px 32px rgba(61,56,48,0.08)' }}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep('role')} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors" style={{ background: '#F5F2EE' }} onMouseEnter={e => e.currentTarget.style.background = '#E8E4DE'} onMouseLeave={e => e.currentTarget.style.background = '#F5F2EE'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D3830" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedRole?.icon}</span>
                <span className="font-700" style={{ color: '#3D3830' }}>{selectedRole?.label}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'tablet' && (
                <div>
                  <label className="block text-sm font-600 mb-1.5" style={{ color: '#3D3830' }}>Selecione o Tablet</label>
                  <select value={tabletId} onChange={e => setTabletId(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border font-500 transition-all outline-none appearance-none"
                    style={{ background: '#F5F2EE', borderColor: '#E8E4DE', color: tabletId ? '#3D3830' : '#9C9490' }}
                    onFocus={e => e.target.style.borderColor = '#8B7FC7'} onBlur={e => e.target.style.borderColor = '#E8E4DE'}>
                    <option value="">Selecione um tablet...</option>
                    {activeTablets.map(t => (
                      <option key={t.id} value={t.id}>{t.id} — Mesa {String(t.tableNumber).padStart(2, '0')}</option>
                    ))}
                  </select>
                  <p className="text-xs mt-1.5 font-500" style={{ color: '#9C9490' }}>O tablet já está vinculado à sua mesa.</p>
                </div>
              )}

              {role === 'admin' && (
                <>
                  <div>
                    <label className="block text-sm font-600 mb-1.5" style={{ color: '#3D3830' }}>E-mail</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@tabmesa.com"
                      className="w-full px-4 py-3 rounded-xl border font-500 transition-all outline-none"
                      style={{ background: '#F5F2EE', borderColor: '#E8E4DE', color: '#3D3830' }}
                      onFocus={e => e.target.style.borderColor = '#8B7FC7'} onBlur={e => e.target.style.borderColor = '#E8E4DE'} />
                  </div>
                  <div>
                    <label className="block text-sm font-600 mb-1.5" style={{ color: '#3D3830' }}>Senha</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border font-500 transition-all outline-none"
                      style={{ background: '#F5F2EE', borderColor: '#E8E4DE', color: '#3D3830' }}
                      onFocus={e => e.target.style.borderColor = '#8B7FC7'} onBlur={e => e.target.style.borderColor = '#E8E4DE'} />
                  </div>
                </>
              )}

              {(role === 'cozinha' || role === 'caixa') && (
                <div>
                  <label className="block text-sm font-600 mb-1.5" style={{ color: '#3D3830' }}>Senha de Acesso</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border font-500 transition-all outline-none"
                    style={{ background: '#F5F2EE', borderColor: '#E8E4DE', color: '#3D3830' }}
                    onFocus={e => e.target.style.borderColor = '#8B7FC7'} onBlur={e => e.target.style.borderColor = '#E8E4DE'} />
                  <p className="text-xs mt-1.5 font-500" style={{ color: '#9C9490' }}>
                    {role === 'cozinha' ? 'Senha padrão: coz123' : 'Senha padrão: caixa123'}
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#FEECEC' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC5F5F" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <p className="text-sm font-600" style={{ color: '#DC5F5F' }}>{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-700 text-white transition-all duration-200 mt-2"
                style={{ background: loading ? '#B8B4D4' : selectedRole?.color || '#8B7FC7', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                    Entrando...
                  </span>
                ) : 'Entrar'}
              </button>
            </form>

            {role === 'admin' && (
              <button className="w-full text-center text-sm font-600 mt-4 hover:underline" style={{ color: '#9C9490' }}>
                Esqueci minha senha
              </button>
            )}
          </div>
        )}

        <p className="text-center text-xs font-500 mt-8" style={{ color: '#C0BAB5' }}>
          TabMesa v2.0 · Sistema de Gestão de Restaurante
        </p>
      </div>
    </div>
  )
}
