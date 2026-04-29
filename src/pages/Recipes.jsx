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
  const page = parseInt(searchParams.get('page') || '1')

  const [searchInput, setSearchInput] = useState(search)

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: '12' })
      if (search) params.set('search', search)
      if (type) params.set('type', type)
      if (diet) params.set('diet', diet)
      const data = await apiFetch(`/recipes?${params}`)
      setRecipes(data.recipes)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [search, type, diet, page])

  useEffect(() => { fetchRecipes() }, [fetchRecipes])
  useEffect(() => { setSearchInput(search) }, [search])

  function setParam(key, value) {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value); else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  function handleSearch(e) {
    e.preventDefault()
    setParam('search', searchInput.trim())
  }

  function toggleDiet(value) {
    const current = diet ? diet.split(',') : []
    const next = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value]
    setParam('diet', next.join(','))
  }

  return (
    <div className="recipes-page">
      <div className="recipes-sidebar">
        <h3>Filtres</h3>

        <form onSubmit={handleSearch} className="filter-search">
          <input
            type="text"
            placeholder="Rechercher…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-primary-sm">OK</button>
        </form>

        <div className="filter-group">
          <label className="filter-label">Type de plat</label>
          {TYPES.map(({ value, label }) => (
            <label key={value} className="filter-radio">
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setParam('type', value)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <label className="filter-label">Régime alimentaire</label>
          {DIETS.map(({ value, label }) => (
            <label key={value} className="filter-check">
              <input
                type="checkbox"
                checked={(diet ? diet.split(',') : []).includes(value)}
                onChange={() => toggleDiet(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {(search || type || diet) && (
          <button className="btn-outline-sm" onClick={() => setSearchParams({})}>
            Réinitialiser
          </button>
        )}
      </div>

      <div className="recipes-main">
        <div className="recipes-header">
          <h2>
            {search ? `Résultats pour « ${search} »` : 'Toutes les recettes'}
          </h2>
          <span className="recipes-count">{total} recette{total !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="card-skeleton" />)}
          </div>
        ) : recipes.length === 0 ? (
          <p className="empty-text">Aucune recette trouvée. Essayez d'autres filtres.</p>
        ) : (
          <div className="recipe-grid">
            {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn-outline-sm"
              disabled={page <= 1}
              onClick={() => setParam('page', String(page - 1))}
            >
              ← Précédent
            </button>
            <span>Page {page} / {totalPages}</span>
            <button
              className="btn-outline-sm"
              disabled={page >= totalPages}
              onClick={() => setParam('page', String(page + 1))}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
