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
    <div>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-orange-600 via-orange-500 to-rose-600 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white drop-shadow tracking-tight">
            Recettes du Monde
          </h1>
          <p className="text-lg text-orange-100 mb-10">
            Découvrez et partagez des milliers de recettes internationales
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher par nom, ingrédient ou pays…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shrink-0"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-100 mb-5">Explorer par type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { type: 'entree', label: 'Entrées', emoji: '🥗', border: 'border-emerald-500/20', glow: 'hover:border-emerald-500/40' },
              { type: 'plat', label: 'Plats', emoji: '🍲', border: 'border-orange-500/20', glow: 'hover:border-orange-500/40' },
              { type: 'dessert', label: 'Desserts', emoji: '🍰', border: 'border-pink-500/20', glow: 'hover:border-pink-500/40' },
              { type: 'boisson', label: 'Boissons', emoji: '🥤', border: 'border-cyan-500/20', glow: 'hover:border-cyan-500/40' },
            ].map(({ type, label, emoji, border, glow }) => (
              <Link
                key={type}
                to={`/recipes?type=${type}`}
                className={`flex flex-col items-center gap-3 p-6 bg-zinc-900 rounded-2xl border ${border} ${glow} hover:-translate-y-0.5 transition-all text-center`}
              >
                <span className="text-4xl">{emoji}</span>
                <span className="font-semibold text-zinc-300 text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-zinc-100">Dernières recettes</h2>
            <Link to="/recipes" className="text-orange-400 font-semibold text-sm hover:text-orange-300 transition-colors">
              Voir tout →
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-zinc-500 mb-3">Aucune recette pour l'instant.</p>
              <Link to="/register" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
                Créez un compte pour en ajouter !
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((r) => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
