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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
          🍽️ RecettesMonde
        </Link>
        <div className="flex items-center gap-1">
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
            }
          >
            Recettes
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/recipes/new"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                }
              >
                + Ajouter
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                }
              >
                <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                }
              >
                Connexion
              </NavLink>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
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
