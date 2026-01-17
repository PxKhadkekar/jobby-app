import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({children}) => {
  // CHANGED:
  // - No Route usage
  // - We protect components, not paths
  const token = Cookies.get('jwt_token')

  if (token === undefined) {
    // CHANGED:
    // - Redirect replaced with Navigate
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
