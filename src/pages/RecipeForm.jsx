import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../api/client.js'

const TYPES = ['entree', 'plat', 'dessert', 'boisson']
const DIETS = ['vegetarien', 'vegan', 'sans-gluten', 'sans-lactose', 'halal', 'casher']

const emptyIngredient = () => ({ name: '', quantity: '', unit: '' })

export default function RecipeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    description: '',
    country: '',
    type: 'plat',
    diet: [],
    imageUrl: '',
    ingredients: [emptyIngredient()],
    steps: [''],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    apiFetch(`/recipes/${id}`).then((r) => {
      setForm({
        title: r.title,
        description: r.description,
        country: r.country,
        type: r.type,
        diet: r.diet || [],
        imageUrl: r.imageUrl || '',
        ingredients: Array.isArray(r.ingredients) && r.ingredients.length > 0
          ? r.ingredients
          : [emptyIngredient()],
        steps: r.steps?.length > 0 ? r.steps : [''],
      })
    }).catch(() => navigate('/recipes'))
  }, [id, isEdit, navigate])

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })) }

  function toggleDiet(d) {
    set('diet', form.diet.includes(d) ? form.diet.filter((x) => x !== d) : [...form.diet, d])
  }

  function setIngredient(i, key, value) {
    const arr = [...form.ingredients]
    arr[i] = { ...arr[i], [key]: value }
    set('ingredients', arr)
  }

  function addIngredient() { set('ingredients', [...form.ingredients, emptyIngredient()]) }
  function removeIngredient(i) { set('ingredients', form.ingredients.filter((_, idx) => idx !== i)) }

  function setStep(i, value) {
    const arr = [...form.steps]
    arr[i] = value
    set('steps', arr)
  }
  function addStep() { set('steps', [...form.steps, '']) }
  function removeStep(i) { set('steps', form.steps.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const ingredients = form.ingredients.filter((ing) => ing.name.trim())
    const steps = form.steps.filter((s) => s.trim())
    if (!form.title || !form.description || !form.country || !form.type) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (ingredients.length === 0) { setError('Ajoutez au moins un ingrédient'); return }
    if (steps.length === 0) { setError("Ajoutez au moins une étape de préparation"); return }

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      <h1>{isEdit ? 'Modifier la recette' : 'Nouvelle recette'}</h1>
      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-grid-2">
          <label className="form-label">
            Titre *
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </label>
          <label className="form-label">
            Pays d'origine *
            <input value={form.country} onChange={(e) => set('country', e.target.value)} required />
          </label>
        </div>

        <label className="form-label">
          Description *
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            required
          />
        </label>

        <div className="form-grid-2">
          <label className="form-label">
            Type de plat *
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </label>
          <label className="form-label">
            URL de l'image
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://…"
            />
          </label>
        </div>

        <div className="form-label">
          Régime alimentaire
          <div className="checkboxes-row">
            {DIETS.map((d) => (
              <label key={d} className="filter-check">
                <input
                  type="checkbox"
                  checked={form.diet.includes(d)}
                  onChange={() => toggleDiet(d)}
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>Ingrédients *</h3>
            <button type="button" className="btn-outline-sm" onClick={addIngredient}>+ Ajouter</button>
          </div>
          {form.ingredients.map((ing, i) => (
            <div key={i} className="ingredient-row">
              <input
                placeholder="Nom *"
                value={ing.name}
                onChange={(e) => setIngredient(i, 'name', e.target.value)}
                className="flex-2"
              />
              <input
                placeholder="Quantité"
                value={ing.quantity}
                onChange={(e) => setIngredient(i, 'quantity', e.target.value)}
                className="flex-1"
              />
              <input
                placeholder="Unité"
                value={ing.unit}
                onChange={(e) => setIngredient(i, 'unit', e.target.value)}
                className="flex-1"
              />
              {form.ingredients.length > 1 && (
                <button type="button" className="btn-icon-danger" onClick={() => removeIngredient(i)}>✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <h3>Étapes de préparation *</h3>
            <button type="button" className="btn-outline-sm" onClick={addStep}>+ Étape</button>
          </div>
          {form.steps.map((step, i) => (
            <div key={i} className="step-row">
              <span className="step-number">{i + 1}</span>
              <textarea
                value={step}
                onChange={(e) => setStep(i, e.target.value)}
                rows={2}
                placeholder={`Étape ${i + 1}…`}
              />
              {form.steps.length > 1 && (
                <button type="button" className="btn-icon-danger" onClick={() => removeStep(i)}>✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Annuler</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enregistrement…' : isEdit ? 'Modifier' : 'Publier la recette'}
          </button>
        </div>
      </form>
    </div>
  )
}
