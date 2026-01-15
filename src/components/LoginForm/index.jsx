import {useState} from 'react'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import './index.css'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const submitForm = async event => {
    event.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      })

      const data = await response.json()

      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 30})
        navigate('/', {replace: true})
      } else {
        setErrorMsg(data.error_msg)
      }
    } catch {
      setErrorMsg('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submitForm}>
        <h1 className="title">Login</h1>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
    </div>
  )
}

export default LoginForm
