import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const logout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  return (
    <div style={{color: 'white', padding: '40px'}}>
      <h1>Home</h1>
      <p>You are logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Home
