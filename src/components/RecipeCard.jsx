import { Link } from 'react-router-dom'
import RatingStars from './RatingStars.jsx'

const DISH_LABELS = { entree: 'Entrée', plat: 'Plat', dessert: 'Dessert', boisson: 'Boisson' }
const DIET_LABELS = { vegetarien: 'Végétarien', vegan: 'Vegan', 'sans-gluten': 'Sans gluten', 'sans-lactose': 'Sans lactose', halal: 'Halal', casher: 'Casher' }

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="recipe-card-img">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} />
          : <div className="recipe-card-placeholder">🍴</div>
        }
        <span className="recipe-card-type">{DISH_LABELS[recipe.type] || recipe.type}</span>
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-country">🌍 {recipe.country}</p>
        <p className="recipe-card-desc">{recipe.description}</p>
        {recipe.diet?.length > 0 && (
          <div className="recipe-card-diets">
            {recipe.diet.slice(0, 2).map((d) => (
              <span key={d} className="badge">{DIET_LABELS[d] || d}</span>
            ))}
          </div>
        )}
        <div className="recipe-card-footer">
          <RatingStars score={recipe.avgRating} readonly size="sm" />
          <span className="recipe-card-author">par {recipe.author?.name}</span>
        </div>
      </div>
    </Link>
  )
}
