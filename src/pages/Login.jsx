import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const inputCls = "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍽️</span>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-3">Connexion</h1>
          <p className="text-zinc-500 mt-1 text-sm">Bienvenue ! Connectez-vous pour continuer.</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <input type="email" className={inputCls} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required autoComplete="email" placeholder="vous@exemple.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Mot de passe</label>
              <input type="password" className={inputCls} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required autoComplete="current-password" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-60 transition-colors mt-2">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-600 mt-5">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-orange-400 font-semibold hover:text-orange-300">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
