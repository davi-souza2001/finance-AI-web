import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'
import { useGetMe } from '@/http/user-me'
import { useUserStore } from '@/store/useUserStore'

function AuthenticatedRoute() {
  const { data, isLoading } = useGetMe()

  if (data) {
    useUserStore.setState({ user: data })
  }

  return <>{isLoading ? <div className="flex h-screen w-screen items-center justify-center">
    <Loader2 className="animate-spin" size={40} />
  </div> : <Outlet />}</>
}

export function PrivateRoute() {
  const token = Cookies.get('auth-finance-ai-web')

  if (!token) {
    return <Navigate replace to="/login" />
  }

  return <AuthenticatedRoute />
}
