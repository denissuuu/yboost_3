import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  function close() { setOpen(false) }

  const linkCls = (isActive) =>
    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Barre principale */}
        <div className="h-16 flex items-center justify-between">
          <Link to="/" onClick={close} className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
            RecettesMonde
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/recipes" className={({ isActive }) => linkCls(isActive)}>Recettes</NavLink>
            {user ? (
              <>
                <NavLink to="/recipes/new" className={({ isActive }) => linkCls(isActive)}>+ Ajouter</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-2 ${linkCls(isActive)}`}>
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name}
                </NavLink>
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => linkCls(isActive)}>Connexion</NavLink>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-zinc-400 transition-all duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-zinc-400 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-zinc-400 transition-all duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {open && (
          <div className="md:hidden border-t border-zinc-800 py-3 pb-4 flex flex-col gap-1">
            <NavLink to="/recipes" onClick={close} className={({ isActive }) => linkCls(isActive)}>Recettes</NavLink>
            {user ? (
              <>
                <NavLink to="/recipes/new" onClick={close} className={({ isActive }) => linkCls(isActive)}>+ Ajouter une recette</NavLink>
                <NavLink to="/profile" onClick={close} className={({ isActive }) => `flex items-center gap-2 ${linkCls(isActive)}`}>
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name}
                </NavLink>
                <button onClick={handleLogout} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={close} className={({ isActive }) => linkCls(isActive)}>Connexion</NavLink>
                <Link to="/register" onClick={close} className="mx-3 mt-1 py-2.5 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors text-center">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
