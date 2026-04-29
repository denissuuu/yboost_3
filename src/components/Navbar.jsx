import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🍽️ RecettesMonde
        </Link>
        <div className="navbar-links">
          <NavLink to="/recipes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Recettes
          </NavLink>
          {user ? (
            <>
              <NavLink to="/recipes/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                + Ajouter
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                {user.name}
              </NavLink>
              <button className="btn-outline-sm" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Connexion
              </NavLink>
              <Link to="/register" className="btn-primary-sm">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
