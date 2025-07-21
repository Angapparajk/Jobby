import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', { replace: true })
  }
  const toggleMenu = () => setMenuOpen(open => !open)

  return (
    <nav className="header">
      <div className="header-top">
        <Link to="/" className="links">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      <ul className={`links nav-links${menuOpen ? ' open' : ''}`}>
        <li>
          <Link to="/" className="links" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="links" onClick={() => setMenuOpen(false)}>
            Jobs
          </Link>
        </li>
        <li className="logout-mobile">
          <button type="button" className="btn" onClick={() => { setMenuOpen(false); onClickLogout(); }}>
            Logout
          </button>
        </li>
      </ul>
      <button type="button" className="btn logout-desktop" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Header
