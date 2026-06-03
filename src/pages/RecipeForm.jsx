import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../api/client.js'

const TYPES = ['entree', 'plat', 'dessert', 'boisson']
const TYPE_LABELS = { entree: 'Entrée', plat: 'Plat', dessert: 'Dessert', boisson: 'Boisson' }
const DIETS = ['vegetarien', 'vegan', 'sans-gluten', 'sans-lactose', 'halal', 'casher']
const DIET_LABELS = { vegetarien: 'Végétarien', vegan: 'Vegan', 'sans-gluten': 'Sans gluten', 'sans-lactose': 'Sans lactose', halal: 'Halal', casher: 'Casher' }

const emptyIngredient = () => ({ name: '', quantity: '', unit: '' })

export default function RecipeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', country: '', type: 'plat',
    diet: [], imageUrl: '', prepTime: '', servings: '',
    ingredients: [emptyIngredient()], steps: [''],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    apiFetch(`/recipes/${id}`).then((r) => {
      setForm({
        title: r.title, description: r.description, country: r.country,
        type: r.type, diet: r.diet || [], imageUrl: r.imageUrl || '',
        prepTime: r.prepTime ?? '', servings: r.servings ?? '',
        ingredients: Array.isArray(r.ingredients) && r.ingredients.length > 0 ? r.ingredients : [emptyIngredient()],
        steps: r.steps?.length > 0 ? r.steps : [''],
      })
    }).catch(() => navigate('/recipes'))
  }, [id, isEdit, navigate])

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })) }
  function toggleDiet(d) { set('diet', form.diet.includes(d) ? form.diet.filter((x) => x !== d) : [...form.diet, d]) }
  function setIngredient(i, key, value) { const arr = [...form.ingredients]; arr[i] = { ...arr[i], [key]: value }; set('ingredients', arr) }
  function setStep(i, value) { const arr = [...form.steps]; arr[i] = value; set('steps', arr) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const ingredients = form.ingredients.filter((ing) => ing.name.trim())
    const steps = form.steps.filter((s) => s.trim())
    if (!form.title || !form.description || !form.country || !form.type) { setError('Veuillez remplir tous les champs obligatoires'); return }
    if (ingredients.length === 0) { setError('Ajoutez au moins un ingrédient'); return }
    if (steps.length === 0) { setError('Ajoutez au moins une étape'); return }
    setLoading(true)
    try {
      const payload = { ...form, ingredients, steps }
      if (isEdit) {
        await apiFetch(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
        navigate(`/recipes/${id}`)
      } else {
        const r = await apiFetch('/recipes', { method: 'POST', body: JSON.stringify(payload) })
        navigate(`/recipes/${r.id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const inputCls = "w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
  const cardCls = "bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4"

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-100 mb-8">
        {isEdit ? 'Modifier la recette' : 'Nouvelle recette'}
      </h1>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cardCls}>
          <h2 className="font-semibold text-zinc-200">Informations générales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Titre *</label>
              <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Ex : Ramen japonais" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Pays d'origine *</label>
              <input className={inputCls} value={form.country} onChange={(e) => set('country', e.target.value)} required placeholder="Ex : Japon" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Description *</label>
            <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="Décrivez votre recette…" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Type *</label>
              <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Temps (min)</label>
              <input className={inputCls} type="number" min="1" value={form.prepTime} onChange={(e) => set('prepTime', e.target.value)} placeholder="Ex : 45" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Portions</label>
              <input className={inputCls} type="number" min="1" value={form.servings} onChange={(e) => set('servings', e.target.value)} placeholder="Ex : 4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Image (URL)</label>
              <input className={inputCls} type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Régime alimentaire</label>
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button key={d} type="button" onClick={() => toggleDiet(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.diet.includes(d) ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-700 text-zinc-400 hover:border-orange-500/50'}`}>
                  {DIET_LABELS[d]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-200">Ingrédients *</h2>
            <button type="button" onClick={() => set('ingredients', [...form.ingredients, emptyIngredient()])}
              className="text-sm text-orange-400 font-semibold hover:text-orange-300 transition-colors">+ Ajouter</button>
          </div>
          {form.ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input placeholder="Nom *" value={ing.name} onChange={(e) => setIngredient(i, 'name', e.target.value)}
                className="flex-2 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input placeholder="Qté" value={ing.quantity} onChange={(e) => setIngredient(i, 'quantity', e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input placeholder="Unité" value={ing.unit} onChange={(e) => setIngredient(i, 'unit', e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {form.ingredients.length > 1 && (
                <button type="button" onClick={() => set('ingredients', form.ingredients.filter((_, idx) => idx !== i))}
                  className="text-zinc-600 hover:text-red-400 transition-colors px-1 shrink-0">×</button>
              )}
            </div>
          ))}
        </div>

        <div className={cardCls}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-200">Étapes *</h2>
            <button type="button" onClick={() => set('steps', [...form.steps, ''])}
              className="text-sm text-orange-400 font-semibold hover:text-orange-300 transition-colors">+ Étape</button>
          </div>
          {form.steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="shrink-0 w-7 h-7 mt-2 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
              <textarea value={step} onChange={(e) => setStep(i, e.target.value)} rows={2}
                placeholder={`Étape ${i + 1}…`}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
              {form.steps.length > 1 && (
                <button type="button" onClick={() => set('steps', form.steps.filter((_, idx) => idx !== i))}
                  className="text-zinc-600 hover:text-red-400 transition-colors mt-2 px-1 shrink-0">×</button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-400 hover:bg-zinc-800 transition-colors">Annuler</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors">
            {loading ? 'Enregistrement…' : isEdit ? 'Modifier' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  )
}
