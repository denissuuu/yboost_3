import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import RecipeCard from '../components/RecipeCard.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [tab, setTab] = useState('recipes')
  const [myRecipes, setMyRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch('/users/me/recipes'),
      apiFetch('/users/me/favorites'),
    ])
      .then(([r, f]) => { setMyRecipes(r); setFavorites(f) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const list = tab === 'recipes' ? myRecipes : favorites

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${tab === 'recipes' ? 'active' : ''}`}
          onClick={() => setTab('recipes')}
        >
          Mes recettes ({myRecipes.length})
        </button>
        <button
          className={`tab ${tab === 'favorites' ? 'active' : ''}`}
          onClick={() => setTab('favorites')}
        >
          Favoris ({favorites.length})
        </button>
      </div>

      {loading ? (
        <div className="page-loading">Chargement…</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          {tab === 'recipes' ? (
            <>
              <p>Vous n'avez pas encore créé de recette.</p>
              <Link to="/recipes/new" className="btn-primary">Ajouter une recette</Link>
            </>
          ) : (
            <p>Aucun favori pour l'instant. Explorez les <Link to="/recipes">recettes</Link> !</p>
          )}
        </div>
      ) : (
        <div className="recipe-grid">
          {list.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}
