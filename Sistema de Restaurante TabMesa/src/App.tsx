import { AppProvider, useApp } from './context/AppContext'
import LoginView from './views/LoginView'
import TabletView from './views/TabletView'
import KitchenView from './views/KitchenView'
import CashierView from './views/CashierView'
import AdminView from './views/AdminView'

function Router() {
  const { currentUser } = useApp()
  if (!currentUser) return <LoginView />
  if (currentUser.role === 'tablet') return <TabletView />
  if (currentUser.role === 'cozinha') return <KitchenView />
  if (currentUser.role === 'caixa') return <CashierView />
  if (currentUser.role === 'admin') return <AdminView />
  return <LoginView />
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
