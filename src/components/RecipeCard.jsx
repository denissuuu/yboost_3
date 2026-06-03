import { Link } from 'react-router-dom'
import RatingStars from './RatingStars.jsx'

const DISH_LABELS = { entree: 'Entrée', plat: 'Plat', dessert: 'Dessert', boisson: 'Boisson' }
const DIET_LABELS = { vegetarien: 'Végétarien', vegan: 'Vegan', 'sans-gluten': 'Sans gluten', 'sans-lactose': 'Sans lactose', halal: 'Halal', casher: 'Casher' }

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-48 bg-zinc-800 overflow-hidden shrink-0">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🍴</div>
        }
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {DISH_LABELS[recipe.type] || recipe.type}
        </span>
        {recipe._count?.favorites > 0 && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            ❤️ {recipe._count.favorites}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-zinc-100 text-base leading-snug line-clamp-1">{recipe.title}</h3>
        <p className="text-xs text-zinc-500 font-medium">🌍 {recipe.country}</p>
        <p className="text-sm text-zinc-400 line-clamp-2 flex-1 leading-relaxed">{recipe.description}</p>
        {recipe.diet?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.diet.slice(0, 2).map((d) => (
              <span key={d} className="bg-orange-500/10 text-orange-400 text-xs font-medium px-2 py-0.5 rounded-full">
                {DIET_LABELS[d] || d}
              </span>
            ))}
            {recipe.diet.length > 2 && (
              <span className="text-xs text-zinc-600">+{recipe.diet.length - 2}</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 mt-auto">
          <RatingStars score={recipe.avgRating} readonly size="sm" />
          <span className="text-xs text-zinc-600 truncate max-w-[50%]">par {recipe.author?.name}</span>
        </div>
      </div>
    </Link>
  )
}
