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
      <section className="relative bg-linear-to-br from-orange-500 via-orange-400 to-rose-500 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-sm tracking-tight">
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
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl shadow-lg hover:bg-orange-50 transition-colors shrink-0"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Explorer par type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { type: 'entree', label: 'Entrées', emoji: '🥗', color: 'from-green-400 to-emerald-500' },
              { type: 'plat', label: 'Plats', emoji: '🍲', color: 'from-orange-400 to-red-500' },
              { type: 'dessert', label: 'Desserts', emoji: '🍰', color: 'from-pink-400 to-rose-500' },
              { type: 'boisson', label: 'Boissons', emoji: '🥤', color: 'from-blue-400 to-cyan-500' },
            ].map(({ type, label, emoji, color }) => (
              <Link
                key={type}
                to={`/recipes?type=${type}`}
                className="group relative overflow-hidden flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
              >
                <span className={`text-4xl p-3 rounded-2xl bg-linear-to-br ${color} bg-opacity-10`}>{emoji}</span>
                <span className="font-semibold text-gray-700 text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured recipes */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Dernières recettes</h2>
            <Link to="/recipes" className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
              Voir tout →
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-gray-500 mb-3">Aucune recette pour l'instant.</p>
              <Link to="/register" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
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
