import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import RecipeCard from '../components/RecipeCard.jsx'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [tab, setTab] = useState('recipes')
  const [myRecipes, setMyRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', currentPassword: '', password: '' })
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      apiFetch('/users/me/recipes'),
      apiFetch('/users/me/favorites'),
    ])
      .then(([r, f]) => { setMyRecipes(r); setFavorites(f) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (user) setEditForm((f) => ({ ...f, name: user.name, email: user.email }))
  }, [user])

  async function handleEditSubmit(e) {
    e.preventDefault()
    setEditError('')
    setEditSuccess('')
    setEditLoading(true)
    try {
      const payload = {}
      if (editForm.name !== user.name) payload.name = editForm.name
      if (editForm.email !== user.email) payload.email = editForm.email
      if (editForm.password) {
        payload.password = editForm.password
        payload.currentPassword = editForm.currentPassword
      }
      if (Object.keys(payload).length === 0) {
        setEditError('Aucune modification détectée')
        return
      }
      const updated = await apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(payload) })
      setUser(updated)
      setEditSuccess('Profil mis à jour !')
      setEditForm((f) => ({ ...f, currentPassword: '', password: '' }))
    } catch (err) {
      setEditError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const list = tab === 'recipes' ? myRecipes : favorites

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <h1>{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
        <button className="btn-outline-sm profile-edit-btn" onClick={() => { setEditOpen((v) => !v); setEditError(''); setEditSuccess('') }}>
          {editOpen ? 'Fermer' : '✏️ Modifier le profil'}
        </button>
      </div>

      {editOpen && (
        <form className="edit-profile-form" onSubmit={handleEditSubmit}>
          <h3>Modifier le profil</h3>
          {editError && <div className="alert-error">{editError}</div>}
          {editSuccess && <div className="alert-success">{editSuccess}</div>}
          <div className="form-grid-2">
            <label className="form-label">
              Nom
              <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} required />
            </label>
            <label className="form-label">
              Email
              <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} required />
            </label>
          </div>
          <p className="edit-profile-hint">Laissez les champs mot de passe vides pour ne pas le modifier.</p>
          <div className="form-grid-2">
            <label className="form-label">
              Mot de passe actuel
              <input type="password" value={editForm.currentPassword} onChange={(e) => setEditForm((f) => ({ ...f, currentPassword: e.target.value }))} placeholder="Requis pour changer le mot de passe" />
            </label>
            <label className="form-label">
              Nouveau mot de passe
              <input type="password" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} placeholder="Nouveau mot de passe" />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => setEditOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={editLoading}>
              {editLoading ? 'Enregistrement…' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      )}

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
