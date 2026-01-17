import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = () => {
  // CHANGED:
  // withRouter + history removed
  // useNavigate is the v6 replacement
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    // CHANGED:
    // history.replace('/login') → navigate
    navigate('/login', {replace: true})
  }

  return (
    <nav className="header-container">
      <Link to="/" className="logo-link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo"
        />
      </Link>

      <ul className="nav-menu">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li>
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>

        <li>
          <button
            type="button"
            className="logout-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Header
