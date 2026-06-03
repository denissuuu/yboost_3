import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import RatingStars from '../components/RatingStars.jsx'

export default function RecipeDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [error, setError] = useState('')
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    apiFetch(`/recipes/${id}`)
      .then(setRecipe)
      .catch(() => setError('Recette introuvable'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || !recipe) return
    const existing = recipe.ratings?.find((r) => r.user?.id === user.id)
    if (existing) setUserRating(existing.score)
    apiFetch('/users/me/favorites')
      .then((favs) => setIsFav(favs.some((f) => f.id === id)))
      .catch(() => {})
  }, [user, recipe, id])

  async function handleRate(score) {
    if (!user) { navigate('/login'); return }
    setRatingLoading(true)
    try {
      await apiFetch(`/recipes/${id}/ratings`, { method: 'POST', body: JSON.stringify({ score }) })
      setUserRating(score)
      const updated = await apiFetch(`/recipes/${id}`)
      setRecipe(updated)
    } catch {
    } finally { setRatingLoading(false) }
  }

  async function toggleFavorite() {
    if (!user) { navigate('/login'); return }
    try {
      if (isFav) {
        await apiFetch(`/users/me/favorites/${id}`, { method: 'DELETE' })
        setIsFav(false)
      } else {
        await apiFetch(`/users/me/favorites/${id}`, { method: 'POST' })
        setIsFav(true)
      }
    } catch {}
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette recette ?')) return
    try {
      await apiFetch(`/recipes/${id}`, { method: 'DELETE' })
      navigate('/recipes')
    } catch (e) { alert(e.message) }
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: recipe.title, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (error || !recipe) return (
    <div className="max-w-xl mx-auto text-center py-24 px-4">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-zinc-400 mb-4">{error || 'Recette introuvable'}</p>
      <Link to="/recipes" className="text-orange-400 font-semibold hover:text-orange-300">← Retour aux recettes</Link>
    </div>
  )

  const isOwner = user?.id === recipe.author?.id
  const DIET_LABELS = { vegetarien: 'Végétarien', vegan: 'Vegan', 'sans-gluten': 'Sans gluten', 'sans-lactose': 'Sans lactose', halal: 'Halal', casher: 'Casher' }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 sm:h-96 bg-zinc-900 overflow-hidden">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover opacity-50" />
          : <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🍴</div>
        }
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {recipe.type}
            </span>
            {recipe.diet?.map(d => (
              <span key={d} className="bg-white/10 text-zinc-200 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                {DIET_LABELS[d] || d}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
            <span className="text-zinc-300">🌍 {recipe.country}</span>
            <span>👨‍🍳 par <span className="font-semibold text-zinc-200">{recipe.author?.name}</span></span>
            <span>❤️ {recipe._count?.favorites || 0}</span>
            <RatingStars score={recipe.avgRating} readonly size="sm" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main */}
          <div className="flex-1 min-w-0 space-y-6">
            <p className="text-zinc-300 text-lg leading-relaxed">{recipe.description}</p>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">🧂 Ingrédients</h2>
              <ul className="divide-y divide-zinc-800">
                {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-zinc-200">{ing.name}</span>
                    <span className="text-zinc-500 ml-4 shrink-0">{ing.quantity} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">👨‍🍳 Préparation</h2>
              <ol className="space-y-4">
                {recipe.steps?.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 bg-orange-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-zinc-300 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-3">
              <button
                onClick={toggleFavorite}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  isFav ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'border-zinc-700 text-zinc-300 hover:border-rose-500/30 hover:text-rose-400'
                }`}
              >
                {isFav ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-700 text-sm font-semibold text-zinc-300 hover:border-orange-500/30 hover:text-orange-400 transition-colors"
              >
                {shareCopied ? '✅ Lien copié !' : '🔗 Partager'}
              </button>

              {isOwner && (
                <div className="pt-1 border-t border-zinc-800 flex gap-2">
                  <Link to={`/recipes/${id}/edit`} className="flex-1 text-center py-2 rounded-xl border border-zinc-700 text-sm font-medium text-zinc-400 hover:bg-zinc-800 transition-colors">
                    ✏️ Modifier
                  </Link>
                  <button onClick={handleDelete} className="flex-1 py-2 rounded-xl border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="font-bold text-zinc-100 mb-3">Votre note</h3>
              <RatingStars score={userRating} readonly={ratingLoading} onRate={handleRate} size="lg" />
              {!user && (
                <p className="text-xs text-zinc-600 mt-2">
                  <Link to="/login" className="text-orange-400 hover:underline">Connectez-vous</Link> pour noter
                </p>
              )}
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h3 className="font-bold text-zinc-100 mb-3">
                Avis <span className="text-zinc-600 font-normal text-sm">({recipe.ratings?.length || 0})</span>
              </h3>
              {recipe.ratings?.length === 0 ? (
                <p className="text-sm text-zinc-600">Aucun avis pour l'instant.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recipe.ratings?.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-sm py-2 border-b border-zinc-800 last:border-0">
                      <span className="font-medium text-zinc-300">{r.user?.name}</span>
                      <RatingStars score={r.score} readonly size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
