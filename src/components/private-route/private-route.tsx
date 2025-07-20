import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { Navigate, Outlet } from 'react-router-dom'
import { useGetUserById } from '@/http/user-get-user-by-id'

interface JwtPayload {
  sub: string
}

function AuthenticatedRoute() {
  const token = Cookies.get('auth-finance-ai-web')
  const { sub: userId } = jwtDecode<JwtPayload>(token ?? '')
  const { data, isLoading } = useGetUserById(userId)

  if (data) {
    console.log('data :>> ', data)
  }

  return <>{isLoading ? <div>Loading...</div> : <Outlet />}</>
}

export function PrivateRoute() {
  const token = Cookies.get('auth-finance-ai-web')

  if (!token) {
    return <Navigate replace to="/login" />
  }

  return <AuthenticatedRoute />
}
