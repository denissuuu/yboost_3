import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import RecipeCard from '../components/RecipeCard.jsx'

const TYPES = [
  { value: '', label: 'Tous les types' },
  { value: 'entree', label: 'Entrée' },
  { value: 'plat', label: 'Plat' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'boisson', label: 'Boisson' },
]

const DIETS = [
  { value: 'vegetarien', label: 'Végétarien' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'sans-gluten', label: 'Sans gluten' },
  { value: 'sans-lactose', label: 'Sans lactose' },
  { value: 'halal', label: 'Halal' },
  { value: 'casher', label: 'Casher' },
]

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || ''
  const diet = searchParams.get('diet') || ''
  const country = searchParams.get('country') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const [searchInput, setSearchInput] = useState(search)
  const [countryInput, setCountryInput] = useState(country)

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: '12' })
      if (search) params.set('search', search)
      if (type) params.set('type', type)
      if (diet) params.set('diet', diet)
      if (country) params.set('country', country)
      const data = await apiFetch(`/recipes?${params}`)
      setRecipes(data.recipes)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [search, type, diet, country, page])

  useEffect(() => { fetchRecipes() }, [fetchRecipes])
  useEffect(() => { setSearchInput(search) }, [search])
  useEffect(() => { setCountryInput(country) }, [country])

  function setParam(key, value) {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  function toggleDiet(value) {
    const current = diet ? diet.split(',') : []
    const next = current.includes(value) ? current.filter((d) => d !== value) : [...current, value]
    setParam('diet', next.join(','))
  }

  const activeDiets = diet ? diet.split(',') : []
  const hasFilters = search || type || diet || country

  const inputCls = "flex-1 min-w-0 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-7">

        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-24 bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-5">
            <h3 className="font-bold text-zinc-100">Filtres</h3>

            <form onSubmit={(e) => { e.preventDefault(); setParam('search', searchInput.trim()) }} className="flex gap-1.5">
              <input type="text" placeholder="Rechercher…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className={inputCls} />
              <button type="submit" className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shrink-0">OK</button>
            </form>

            <form onSubmit={(e) => { e.preventDefault(); setParam('country', countryInput.trim()) }} className="flex gap-1.5">
              <input type="text" placeholder="Pays…" value={countryInput} onChange={(e) => setCountryInput(e.target.value)} className={inputCls} />
              <button type="submit" className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shrink-0">OK</button>
            </form>

            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Type de plat</p>
              <div className="space-y-1.5">
                {TYPES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value={value} checked={type === value} onChange={() => setParam('type', value)} className="accent-orange-500" />
                    <span className={`text-sm ${type === value ? 'text-orange-400 font-semibold' : 'text-zinc-400'}`}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Régime</p>
              <div className="space-y-1.5">
                {DIETS.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={activeDiets.includes(value)} onChange={() => toggleDiet(value)} className="accent-orange-500" />
                    <span className={`text-sm ${activeDiets.includes(value) ? 'text-orange-400 font-semibold' : 'text-zinc-400'}`}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button className="w-full py-2 text-sm text-zinc-500 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors" onClick={() => setSearchParams({})}>
                Réinitialiser
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-zinc-100">
              {search ? `Résultats pour « ${search} »` : country ? `Recettes de ${country}` : 'Toutes les recettes'}
            </h2>
            <span className="text-sm text-zinc-500 shrink-0">{total} recette{total !== 1 ? 's' : ''}</span>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {search && <Chip label={`"${search}"`} onRemove={() => setParam('search', '')} />}
              {country && <Chip label={`🌍 ${country}`} onRemove={() => setParam('country', '')} />}
              {type && <Chip label={TYPES.find(t => t.value === type)?.label} onRemove={() => setParam('type', '')} />}
              {activeDiets.map(d => <Chip key={d} label={d} onRemove={() => toggleDiet(d)} />)}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-zinc-800 animate-pulse rounded-2xl h-72" />)}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-zinc-400">Aucune recette trouvée.</p>
              <p className="text-sm text-zinc-600 mt-1">Essayez d'autres filtres.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                className="px-4 py-2 border border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={page <= 1}
                onClick={() => setParam('page', String(page - 1))}
              >← Précédent</button>
              <span className="text-sm text-zinc-500 px-2">Page {page} / {totalPages}</span>
              <button
                className="px-4 py-2 border border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={page >= totalPages}
                onClick={() => setParam('page', String(page + 1))}
              >Suivant →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-orange-500/10 text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full border border-orange-500/20">
      {label}
      <button onClick={onRemove} className="hover:text-orange-200 ml-0.5">✕</button>
    </span>
  )
}
