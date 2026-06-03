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
    <nav className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
          RecettesMonde
        </Link>
        <div className="flex items-center gap-1">
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`
            }
          >
            Recettes
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/recipes/new"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`
                }
              >
                + Ajouter
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`
                }
              >
                <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`
                }
              >
                Connexion
              </NavLink>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
