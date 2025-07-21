import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedRoute = () => {
  const location = useLocation()
  const token = Cookie.get('jwt_token')
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export default ProtectedRoute
