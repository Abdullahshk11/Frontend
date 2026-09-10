import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import { useSelector } from 'react-redux'
import '../styles/Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useContext(authContext)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const navigate = useNavigate()
  const handellogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link className="navbar__brand" to="/" aria-label="ShopNext home">
          <span className="navbar__brand-mark" aria-hidden="true">S</span>
          <span>ShopNext</span>
        </Link>

        <button
          className="navbar__menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="navbar-links"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>

        {menuOpen && <button className="navbar__backdrop" type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}

        <div id="navbar-links" className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
          <Link className="navbar__link" to="/" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link className="navbar__link" to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartItems.length})</Link>

          {user ? (
            <>
              <Link className="navbar__link" to="/profile" onClick={() => setMenuOpen(false)}>Hi, {user.name}</Link>
              {user.role === 'admin' && <Link className="navbar__link" to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button className="navbar__action" type="button" onClick={handellogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="navbar__link" to="/register" onClick={() => setMenuOpen(false)}>Create account</Link>
              <Link className="navbar__action" to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )

}

export default Navbar
