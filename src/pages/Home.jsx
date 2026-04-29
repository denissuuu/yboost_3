import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import RecipeCard from '../components/RecipeCard.jsx'

export default function Home() {
  const [search, setSearch] = useState('')
  const [featured, setFeatured] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    apiFetch('/recipes?limit=6').then((d) => setFeatured(d.recipes)).catch(() => {})
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/recipes?search=${encodeURIComponent(search.trim())}`)
    else navigate('/recipes')
  }

  return (
    <div className="home">
      <section className="hero-section">
        <h1 className="hero-title">Recettes du Monde</h1>
        <p className="hero-subtitle">Découvrez des milliers de recettes internationales</p>
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher par nom, ingrédient ou pays…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-lg"
          />
          <button type="submit" className="btn-primary">Rechercher</button>
        </form>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Dernières recettes</h2>
          <Link to="/recipes" className="link-more">Voir tout →</Link>
        </div>
        {featured.length === 0 ? (
          <p className="empty-text">Aucune recette pour l'instant. <Link to="/register">Créez un compte</Link> pour en ajouter !</p>
        ) : (
          <div className="recipe-grid">
            {featured.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </section>

      <section className="home-section categories-section">
        <h2>Explorer par type</h2>
        <div className="categories-grid">
          {[
            { type: 'entree', label: 'Entrées', emoji: '🥗' },
            { type: 'plat', label: 'Plats', emoji: '🍲' },
            { type: 'dessert', label: 'Desserts', emoji: '🍰' },
            { type: 'boisson', label: 'Boissons', emoji: '🥤' },
          ].map(({ type, label, emoji }) => (
            <Link key={type} to={`/recipes?type=${type}`} className="category-card">
              <span className="category-emoji">{emoji}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
