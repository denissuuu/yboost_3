import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const count = await prisma.recipe.count()
  if (count > 0) {
    console.log(`✅ Base déjà peuplée (${count} recettes). Seed ignoré.`)
    return
  }

  const password = await bcrypt.hash('demo1234', 10)
  const chef = await prisma.user.upsert({
    where: { email: 'chef@recettes.fr' },
    update: {},
    create: { name: 'Chef Démo', email: 'chef@recettes.fr', password },
  })
  console.log(`👨‍🍳 Utilisateur créé : ${chef.email}`)

  const recipes = [
    {
      title: 'Ramen au miso',
      description: 'Un bouillon profond et fumé, garni de nouilles élastiques, de porc chashu fondant, d\'un œuf mollet mariné et de légumes croquants.',
      country: 'Japon',
      type: 'plat',
      diet: [],
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
      ingredients: [
        { name: 'Nouilles ramen', quantity: '200', unit: 'g' },
        { name: 'Pâte de miso', quantity: '3', unit: 'c. à soupe' },
        { name: 'Bouillon de poulet', quantity: '1', unit: 'L' },
        { name: 'Poitrine de porc', quantity: '300', unit: 'g' },
        { name: 'Œufs', quantity: '2', unit: '' },
        { name: 'Pousses de bambou', quantity: '100', unit: 'g' },
        { name: 'Nori (algue)', quantity: '2', unit: 'feuilles' },
        { name: 'Oignons verts', quantity: '2', unit: '' },
        { name: 'Sauce soja', quantity: '4', unit: 'c. à soupe' },
        { name: 'Ail', quantity: '3', unit: 'gousses' },
      ],
      steps: [
        'Faire mariner la poitrine de porc dans la sauce soja, le mirin et l\'ail pendant 2h. La rouler et la ficeler, puis la cuire à 160°C pendant 2h.',
        'Faire bouillir les œufs 6 minutes et 30 secondes, les plonger dans l\'eau glacée puis les peler. Les faire mariner dans la sauce soja diluée pendant 4h.',
        'Faire revenir l\'ail et le gingembre dans de l\'huile de sésame, ajouter le bouillon et laisser frémir 20 minutes.',
        'Délayer la pâte de miso dans un peu de bouillon chaud, puis l\'incorporer au reste du bouillon. Ne pas faire bouillir.',
        'Cuire les nouilles selon les instructions. Monter les bols avec les nouilles, le bouillon, le chashu tranché, l\'œuf coupé en deux, le nori et les oignons verts.',
      ],
    },
    {
      title: 'Tajine d\'agneau aux pruneaux',
      description: 'Un plat traditionnel marocain aux saveurs sucrées-salées, avec de l\'agneau tendre mijoté aux pruneaux, amandes et épices chaudes.',
      country: 'Maroc',
      type: 'plat',
      diet: ['halal'],
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      ingredients: [
        { name: 'Épaule d\'agneau', quantity: '1', unit: 'kg' },
        { name: 'Pruneaux dénoyautés', quantity: '200', unit: 'g' },
        { name: 'Amandes mondées', quantity: '100', unit: 'g' },
        { name: 'Oignons', quantity: '2', unit: '' },
        { name: 'Miel', quantity: '2', unit: 'c. à soupe' },
        { name: 'Cannelle', quantity: '1', unit: 'bâton' },
        { name: 'Gingembre en poudre', quantity: '1', unit: 'c. à café' },
        { name: 'Curcuma', quantity: '1', unit: 'c. à café' },
        { name: 'Ras-el-hanout', quantity: '2', unit: 'c. à café' },
        { name: 'Coriandre fraîche', quantity: '1', unit: 'bouquet' },
      ],
      steps: [
        'Faire dorer les morceaux d\'agneau dans l\'huile d\'olive chaude dans le tajine ou une cocotte.',
        'Ajouter les oignons émincés et faire suer 5 minutes. Incorporer toutes les épices et mélanger.',
        'Couvrir d\'eau à hauteur, ajouter le bâton de cannelle. Couvrir et cuire 1h30 à feu doux.',
        'Ajouter les pruneaux et le miel. Poursuivre la cuisson 20 minutes à découvert pour réduire la sauce.',
        'Faire dorer les amandes à sec dans une poêle. Servir le tajine parsemé d\'amandes et de coriandre fraîche.',
      ],
    },
    {
      title: 'Tiramisu classique',
      description: 'Le dessert italien par excellence — biscuits imbibés de café fort, crème mascarpone aérienne et nuage de cacao amer.',
      country: 'Italie',
      type: 'dessert',
      diet: ['vegetarien'],
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
      ingredients: [
        { name: 'Mascarpone', quantity: '500', unit: 'g' },
        { name: 'Œufs', quantity: '4', unit: '' },
        { name: 'Sucre', quantity: '100', unit: 'g' },
        { name: 'Biscuits à la cuillère', quantity: '300', unit: 'g' },
        { name: 'Café espresso fort', quantity: '300', unit: 'ml' },
        { name: 'Marsala ou rhum', quantity: '3', unit: 'c. à soupe' },
        { name: 'Cacao amer en poudre', quantity: '30', unit: 'g' },
      ],
      steps: [
        'Préparer le café et le laisser refroidir. Ajouter le marsala.',
        'Séparer les blancs des jaunes. Fouetter les jaunes avec le sucre jusqu\'à blanchiment, puis incorporer le mascarpone.',
        'Monter les blancs en neige ferme et les incorporer délicatement à la crème mascarpone.',
        'Tremper rapidement les biscuits dans le café et en tapisser le fond du plat. Étaler la moitié de la crème.',
        'Répéter l\'opération. Réfrigérer au moins 4h (idéalement une nuit). Saupoudrer de cacao avant de servir.',
      ],
    },
    {
      title: 'Gazpacho andalou',
      description: 'Soupe froide espagnole rafraîchissante à base de tomates mûres, concombre, poivron et ail. Parfaite pour l\'été.',
      country: 'Espagne',
      type: 'entree',
      diet: ['vegetarien', 'vegan', 'sans-gluten'],
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
      ingredients: [
        { name: 'Tomates bien mûres', quantity: '800', unit: 'g' },
        { name: 'Concombre', quantity: '1', unit: '' },
        { name: 'Poivron rouge', quantity: '1', unit: '' },
        { name: 'Ail', quantity: '2', unit: 'gousses' },
        { name: 'Huile d\'olive extra vierge', quantity: '80', unit: 'ml' },
        { name: 'Vinaigre de xérès', quantity: '2', unit: 'c. à soupe' },
        { name: 'Sel', quantity: '1', unit: 'c. à café' },
      ],
      steps: [
        'Épépiner et couper grossièrement les tomates, le concombre et le poivron.',
        'Mixer tous les légumes avec l\'ail, l\'huile d\'olive et le vinaigre pendant 2 minutes à vitesse maximale.',
        'Filtrer à travers une passoire fine en pressant bien. Assaisonner.',
        'Réfrigérer au moins 2 heures. Servir très frais avec un filet d\'huile d\'olive.',
      ],
    },
    {
      title: 'Pad Thaï aux crevettes',
      description: 'Le plat de rue thaïlandais emblématique — nouilles de riz sautées aux crevettes, œuf, cacahuètes et sauce acidulée.',
      country: 'Thaïlande',
      type: 'plat',
      diet: ['sans-gluten'],
      imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80',
      ingredients: [
        { name: 'Nouilles de riz larges', quantity: '200', unit: 'g' },
        { name: 'Crevettes décortiquées', quantity: '300', unit: 'g' },
        { name: 'Œufs', quantity: '2', unit: '' },
        { name: 'Pousses de soja', quantity: '150', unit: 'g' },
        { name: 'Sauce tamarin', quantity: '3', unit: 'c. à soupe' },
        { name: 'Sauce de poisson', quantity: '2', unit: 'c. à soupe' },
        { name: 'Sucre de palme', quantity: '1', unit: 'c. à soupe' },
        { name: 'Cacahuètes grillées', quantity: '60', unit: 'g' },
        { name: 'Citron vert', quantity: '2', unit: '' },
        { name: 'Oignons verts', quantity: '3', unit: '' },
      ],
      steps: [
        'Faire tremper les nouilles dans l\'eau tiède 30 minutes. Mélanger la sauce tamarin, la sauce de poisson et le sucre.',
        'Faire sauter les crevettes dans un wok très chaud avec l\'ail. Réserver.',
        'Dans le même wok, faire sauter les nouilles égouttées. Pousser sur le côté et brouiller les œufs.',
        'Ajouter la sauce et mélanger vivement. Incorporer les crevettes et les pousses de soja.',
        'Servir garni de cacahuètes concassées, oignons verts et quartiers de citron vert.',
      ],
    },
    {
      title: 'Curry de pois chiches',
      description: 'Un chana masala réconfortant et parfumé aux épices indiennes, riche en protéines végétales et totalement sans produits animaux.',
      country: 'Inde',
      type: 'plat',
      diet: ['vegetarien', 'vegan', 'sans-gluten', 'sans-lactose'],
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      ingredients: [
        { name: 'Pois chiches cuits', quantity: '800', unit: 'g' },
        { name: 'Tomates concassées', quantity: '400', unit: 'g' },
        { name: 'Oignon', quantity: '2', unit: '' },
        { name: 'Ail', quantity: '4', unit: 'gousses' },
        { name: 'Gingembre frais', quantity: '3', unit: 'cm' },
        { name: 'Cumin', quantity: '2', unit: 'c. à café' },
        { name: 'Coriandre moulue', quantity: '2', unit: 'c. à café' },
        { name: 'Garam masala', quantity: '1', unit: 'c. à café' },
        { name: 'Piment', quantity: '1', unit: '' },
        { name: 'Coriandre fraîche', quantity: '1', unit: 'bouquet' },
      ],
      steps: [
        'Faire revenir les oignons dans l\'huile jusqu\'à bien dorés (10-12 min). Ajouter l\'ail, le gingembre et le piment, cuire 2 min.',
        'Incorporer toutes les épices sèches et mélanger 1 minute.',
        'Ajouter les tomates concassées et cuire 10 minutes jusqu\'à réduction.',
        'Ajouter les pois chiches et un peu d\'eau. Laisser mijoter 15 minutes. Écraser quelques pois chiches pour épaissir la sauce.',
        'Ajuster l\'assaisonnement, saupoudrer de garam masala et de coriandre fraîche. Servir avec du riz basmati ou du pain naan.',
      ],
    },
    {
      title: 'Crème brûlée',
      description: 'Le grand classique de la pâtisserie française — une crème vanillée onctueuse sous une fine couche de caramel craquant.',
      country: 'France',
      type: 'dessert',
      diet: ['vegetarien', 'sans-gluten'],
      imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80',
      ingredients: [
        { name: 'Crème liquide entière', quantity: '500', unit: 'ml' },
        { name: 'Jaunes d\'œufs', quantity: '5', unit: '' },
        { name: 'Sucre', quantity: '100', unit: 'g' },
        { name: 'Gousse de vanille', quantity: '1', unit: '' },
        { name: 'Sucre roux (pour caraméliser)', quantity: '4', unit: 'c. à soupe' },
      ],
      steps: [
        'Préchauffer le four à 150°C. Fendre la gousse de vanille et la gratter dans la crème. Chauffer sans bouillir.',
        'Fouetter les jaunes avec le sucre jusqu\'à blanchiment.',
        'Verser la crème chaude sur les jaunes en filet, en fouettant doucement. Filtrer.',
        'Remplir les ramequins et cuire au bain-marie 45 minutes. La crème doit trembler légèrement au centre.',
        'Réfrigérer 4h minimum. Au moment de servir, saupoudrer de sucre roux et brûler au chalumeau.',
      ],
    },
    {
      title: 'Tacos al Pastor',
      description: 'Des tacos authentiques mexicains avec du porc mariné aux épices et à l\'ananas, cuits à la broche puis servis dans des tortillas de maïs.',
      country: 'Mexique',
      type: 'plat',
      diet: [],
      imageUrl: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800&q=80',
      ingredients: [
        { name: 'Porc (échine)', quantity: '800', unit: 'g' },
        { name: 'Ananas frais', quantity: '200', unit: 'g' },
        { name: 'Tortillas de maïs', quantity: '12', unit: '' },
        { name: 'Piments chipotle', quantity: '3', unit: '' },
        { name: 'Achiote (rocou)', quantity: '2', unit: 'c. à soupe' },
        { name: 'Oignon blanc', quantity: '1', unit: '' },
        { name: 'Coriandre fraîche', quantity: '1', unit: 'bouquet' },
        { name: 'Citron vert', quantity: '2', unit: '' },
        { name: 'Vinaigre de cidre', quantity: '3', unit: 'c. à soupe' },
        { name: 'Ail', quantity: '3', unit: 'gousses' },
      ],
      steps: [
        'Mixer les chipotle, l\'achiote, l\'ail, le vinaigre et les épices pour faire la marinade.',
        'Couper le porc en tranches fines, les enrober de marinade et réfrigérer 4h minimum.',
        'Cuire le porc dans une poêle bien chaude ou au grill. Sur les dernières minutes, ajouter des dés d\'ananas.',
        'Chauffer les tortillas directement sur la flamme ou dans une poêle sèche.',
        'Garnir les tortillas de porc, ananas, oignon émincé, coriandre et jus de citron vert.',
      ],
    },
    {
      title: 'Baklava',
      description: 'La pâtisserie ottomane aux mille feuilles — fines couches de pâte filo croustillante, fourrées de noix et d\'amandes, noyées de sirop de miel.',
      country: 'Turquie',
      type: 'dessert',
      diet: ['vegetarien'],
      imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80',
      ingredients: [
        { name: 'Pâte filo', quantity: '500', unit: 'g' },
        { name: 'Beurre fondu', quantity: '200', unit: 'g' },
        { name: 'Noix mélangées concassées', quantity: '400', unit: 'g' },
        { name: 'Miel', quantity: '200', unit: 'g' },
        { name: 'Sucre', quantity: '100', unit: 'g' },
        { name: 'Eau de rose', quantity: '2', unit: 'c. à soupe' },
        { name: 'Cannelle', quantity: '1', unit: 'c. à café' },
        { name: 'Eau', quantity: '100', unit: 'ml' },
      ],
      steps: [
        'Préchauffer le four à 180°C. Beurrer un grand plat.',
        'Mélanger les noix avec la cannelle et un peu de sucre.',
        'Déposer 10 feuilles de filo en les badigeonnant de beurre une par une. Étaler la moitié des noix.',
        'Ajouter 5 feuilles de filo beurrées, le reste des noix, puis terminer avec 10 feuilles beurrées. Découper en losanges.',
        'Cuire 35-40 min jusqu\'à dorure. Préparer un sirop avec miel, eau et sucre, y ajouter l\'eau de rose. Verser bouillant sur le baklava chaud.',
      ],
    },
    {
      title: 'Salade César',
      description: 'La salade américaine iconique — laitue romaine croquante, parmesan, croûtons dorés et la fameuse sauce crémeuse à l\'anchois.',
      country: 'États-Unis',
      type: 'entree',
      diet: ['vegetarien'],
      imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80',
      ingredients: [
        { name: 'Laitue romaine', quantity: '1', unit: 'grosse' },
        { name: 'Parmesan râpé', quantity: '80', unit: 'g' },
        { name: 'Pain de campagne', quantity: '3', unit: 'tranches' },
        { name: 'Jaune d\'œuf', quantity: '1', unit: '' },
        { name: 'Filets d\'anchois', quantity: '3', unit: '' },
        { name: 'Ail', quantity: '1', unit: 'gousse' },
        { name: 'Jus de citron', quantity: '2', unit: 'c. à soupe' },
        { name: 'Moutarde de Dijon', quantity: '1', unit: 'c. à café' },
        { name: 'Huile d\'olive', quantity: '80', unit: 'ml' },
        { name: 'Sauce Worcestershire', quantity: '1', unit: 'c. à café' },
      ],
      steps: [
        'Couper le pain en dés et les faire dorer au four avec de l\'huile et de l\'ail à 200°C pendant 10 minutes.',
        'Mixer les anchois avec l\'ail pour former une pâte. Ajouter le jaune d\'œuf, la moutarde, le jus de citron et la Worcestershire.',
        'Incorporer l\'huile en filet en fouettant pour émulsionner. Ajouter la moitié du parmesan. Assaisonner.',
        'Déchirer la laitue en morceaux. Mélanger avec la sauce juste avant de servir.',
        'Garnir avec les croûtons et le reste du parmesan en copeaux.',
      ],
    },
    {
      title: 'Moussaka grecque',
      description: 'Le plat familial grec par excellence — gratin d\'aubergines, viande d\'agneau aux épices et onctueuse béchamel gratinée.',
      country: 'Grèce',
      type: 'plat',
      diet: [],
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80',
      ingredients: [
        { name: 'Aubergines', quantity: '4', unit: '' },
        { name: 'Agneau haché', quantity: '600', unit: 'g' },
        { name: 'Tomates pelées', quantity: '400', unit: 'g' },
        { name: 'Oignon', quantity: '1', unit: '' },
        { name: 'Cannelle', quantity: '1', unit: 'c. à café' },
        { name: 'Lait entier', quantity: '500', unit: 'ml' },
        { name: 'Beurre', quantity: '50', unit: 'g' },
        { name: 'Farine', quantity: '50', unit: 'g' },
        { name: 'Parmesan', quantity: '80', unit: 'g' },
        { name: 'Muscade', quantity: '1', unit: 'pincée' },
      ],
      steps: [
        'Couper les aubergines en tranches épaisses, saler et laisser dégorger 30 min. Rincer, sécher et faire griller au four à 200°C.',
        'Faire revenir l\'oignon avec l\'agneau. Ajouter les tomates, la cannelle, le sel et poivre. Mijoter 20 min.',
        'Préparer la béchamel : fondre le beurre, ajouter la farine, puis le lait chaud en fouettant. Assaisonner avec muscade, sel.',
        'Dans un plat à gratin beurré, alterner couches d\'aubergines et de viande. Terminer avec les aubergines.',
        'Napper de béchamel, parsemer de parmesan. Cuire au four à 180°C pendant 45 minutes jusqu\'à dorure.',
      ],
    },
    {
      title: 'Matcha Latte',
      description: 'La boisson tendance des cafés japonais — thé matcha cérémoniel battu en mousse, adouci au lait végétal chaud et légèrement sucré.',
      country: 'Japon',
      type: 'boisson',
      diet: ['vegetarien', 'vegan', 'sans-gluten', 'sans-lactose'],
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80',
      ingredients: [
        { name: 'Poudre de matcha cérémoniel', quantity: '2', unit: 'c. à café' },
        { name: 'Lait d\'avoine', quantity: '250', unit: 'ml' },
        { name: 'Eau chaude (70°C)', quantity: '50', unit: 'ml' },
        { name: 'Sirop d\'agave', quantity: '1', unit: 'c. à soupe' },
      ],
      steps: [
        'Tamiser le matcha dans un bol pour éviter les grumeaux.',
        'Ajouter l\'eau à 70°C (jamais bouillante, ça amériore le matcha) et fouetter en mouvements en forme de W jusqu\'à obtenir une mousse.',
        'Chauffer le lait d\'avoine et le faire mousser avec un mousseur ou en le fouettant.',
        'Verser le lait dans une tasse, ajouter le sirop d\'agave, puis verser délicatement le matcha par-dessus.',
      ],
    },
  ]

  let created = 0
  for (const recipe of recipes) {
    const ingredientText = recipe.ingredients.map(i => i.name).join(' ')
    await prisma.recipe.create({
      data: { ...recipe, ingredientText, authorId: chef.id },
    })
    created++
    process.stdout.write(`\r🍽️  ${created}/${recipes.length} recettes créées…`)
  }

  console.log(`\n✅ Seed terminé — ${created} recettes ajoutées.`)
  console.log(`\n📧 Compte démo : chef@recettes.fr`)
  console.log(`🔑 Mot de passe : demo1234`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
