import {Routes, Route, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import NotFound from './components/NotFound'

const App = () => {
  const jwtToken = Cookies.get('jwt_token')

  return (
    <Routes>
      <Route
        path="/login"
        element={jwtToken ? <Navigate to="/" replace /> : <LoginForm />}
      />

      <Route
        path="/"
        element={jwtToken ? <Home /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
