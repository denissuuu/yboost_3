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
      await apiFetch(`/recipes/${id}/ratings`, {
        method: 'POST',
        body: JSON.stringify({ score }),
      })
      setUserRating(score)
      const updated = await apiFetch(`/recipes/${id}`)
      setRecipe(updated)
    } catch {
    } finally {
      setRatingLoading(false)
    }
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
    } catch (e) {
      alert(e.message)
    }
  }

  const [shareCopied, setShareCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  if (loading) return <div className="page-loading">Chargement…</div>
  if (error || !recipe) return <div className="page-error">{error || 'Recette introuvable'}</div>

  const isOwner = user?.id === recipe.author?.id

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-hero">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} className="recipe-detail-img" />
          : <div className="recipe-detail-placeholder">🍴</div>
        }
        <div className="recipe-detail-overlay">
          <span className="badge badge-type">{recipe.type}</span>
          <h1>{recipe.title}</h1>
          <p className="recipe-detail-country">🌍 {recipe.country}</p>
          <div className="recipe-detail-meta">
            <RatingStars score={recipe.avgRating} readonly />
            <span className="recipe-detail-author">par {recipe.author?.name}</span>
            <span className="recipe-detail-favcount">❤️ {recipe._count?.favorites || 0}</span>
          </div>
        </div>
      </div>

      <div className="recipe-detail-body">
        <div className="recipe-detail-main">
          <p className="recipe-description">{recipe.description}</p>

          {recipe.diet?.length > 0 && (
            <div className="diets-row">
              {recipe.diet.map((d) => <span key={d} className="badge">{d}</span>)}
            </div>
          )}

          <h2>Ingrédients</h2>
          <ul className="ingredients-list">
            {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <strong>{ing.quantity} {ing.unit}</strong> {ing.name}
              </li>
            ))}
          </ul>

          <h2>Préparation</h2>
          <ol className="steps-list">
            {recipe.steps?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <aside className="recipe-detail-aside">
          <div className="aside-card">
            <h3>Votre note</h3>
            <RatingStars
              score={userRating}
              readonly={ratingLoading}
              onRate={handleRate}
              size="lg"
            />
            {!user && <p className="aside-hint"><Link to="/login">Connectez-vous</Link> pour noter</p>}
          </div>

          <button
            className={`btn-fav ${isFav ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            {isFav ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
          </button>

          <button className="btn-share" onClick={handleShare}>
            {shareCopied ? '✅ Lien copié !' : '🔗 Partager'}
          </button>

          {isOwner && (
            <div className="aside-owner">
              <Link to={`/recipes/${id}/edit`} className="btn-outline-sm">
                ✏️ Modifier
              </Link>
              <button className="btn-danger-sm" onClick={handleDelete}>
                🗑️ Supprimer
              </button>
            </div>
          )}

          <div className="aside-card">
            <h3>Avis ({recipe.ratings?.length || 0})</h3>
            <div className="reviews-list">
              {recipe.ratings?.length === 0 && <p className="aside-hint">Aucun avis pour l'instant.</p>}
              {recipe.ratings?.map((r) => (
                <div key={r.id} className="review-item">
                  <strong>{r.user?.name}</strong>
                  <RatingStars score={r.score} readonly size="sm" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
