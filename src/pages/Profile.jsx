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
    Promise.all([apiFetch('/users/me/recipes'), apiFetch('/users/me/favorites')])
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
      if (editForm.password) { payload.password = editForm.password; payload.currentPassword = editForm.currentPassword }
      if (Object.keys(payload).length === 0) { setEditError('Aucune modification détectée'); return }
      const updated = await apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(payload) })
      setUser(updated)
      setEditSuccess('Profil mis à jour !')
      setEditForm((f) => ({ ...f, currentPassword: '', password: '' }))
    } catch (err) {
      setEditError(err.message)
    } finally { setEditLoading(false) }
  }

  const list = tab === 'recipes' ? myRecipes : favorites
  const inputCls = "w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* Header */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-500 to-rose-500 text-white text-2xl font-extrabold flex items-center justify-center shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-zinc-100 truncate">{user?.name}</h1>
          <p className="text-sm text-zinc-500 truncate">{user?.email}</p>
          <div className="flex gap-4 mt-1 text-xs text-zinc-600">
            <span>{myRecipes.length} recette{myRecipes.length !== 1 ? 's' : ''}</span>
            <span>{favorites.length} favori{favorites.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button
          onClick={() => { setEditOpen((v) => !v); setEditError(''); setEditSuccess('') }}
          className="shrink-0 px-4 py-2 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          {editOpen ? 'Fermer' : '✏️ Modifier'}
        </button>
      </div>

      {/* Edit form */}
      {editOpen && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="font-bold text-zinc-100 mb-4">Modifier le profil</h2>
          {editError && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{editError}</div>}
          {editSuccess && <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm">{editSuccess}</div>}
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nom</label>
                <input className={inputCls} value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                <input type="email" className={inputCls} value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <p className="text-xs text-zinc-600">Laissez les champs mot de passe vides pour ne pas le modifier.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Mot de passe actuel</label>
                <input type="password" className={inputCls} value={editForm.currentPassword} onChange={(e) => setEditForm((f) => ({ ...f, currentPassword: e.target.value }))} placeholder="Requis pour changer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nouveau mot de passe</label>
                <input type="password" className={inputCls} value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} placeholder="Nouveau mot de passe" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditOpen(false)} className="px-5 py-2 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-zinc-800 transition-colors">Annuler</button>
              <button type="submit" disabled={editLoading} className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors">
                {editLoading ? 'Enregistrement…' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-1.5">
        {[{ key: 'recipes', label: `Mes recettes (${myRecipes.length})` }, { key: 'favorites', label: `Favoris (${favorites.length})` }].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === key ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-zinc-800 animate-pulse rounded-2xl h-64" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
          {tab === 'recipes' ? (
            <>
              <p className="text-4xl mb-3">🍳</p>
              <p className="text-zinc-500 mb-4">Vous n'avez pas encore créé de recette.</p>
              <Link to="/recipes/new" className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">Ajouter une recette</Link>
            </>
          ) : (
            <>
              <p className="text-4xl mb-3">🤍</p>
              <p className="text-zinc-500">Aucun favori pour l'instant.</p>
              <Link to="/recipes" className="text-orange-400 font-semibold hover:text-orange-300 text-sm mt-2 inline-block">Explorer les recettes →</Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}
