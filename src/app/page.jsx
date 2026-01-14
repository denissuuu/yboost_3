"use client";

import Link from "next/link";
import React from "react";

const trendingTopics = [
    {
        title: "Pain au levain croustillant",
        replies: 42,
        author: "LolaBoulange",
        tag: "Boulangerie",
    },
    {
        title: "Batch-cooking veggie pour la semaine",
        replies: 31,
        author: "MarcoChef",
        tag: "Meal prep",
    },
    {
        title: "Secrets d'un ramen maison aromatique",
        replies: 19,
        author: "UmamiLab",
        tag: "World food",
    },
];

const featuredRecipes = [
    {
        title: "Tarte rustique aux poires",
        difficulty: "Facile",
        duration: "45 min",
        image: "https://images.unsplash.com/photo-1505253668822-42074d58a7bf?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Risotto crémeux au potimarron",
        difficulty: "Intermédiaire",
        duration: "35 min",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80",
    },
];

const categories = [
    { name: "Recettes express", color: "bg-orange-100 text-orange-700" },
    { name: "Desserts", color: "bg-pink-100 text-pink-700" },
    { name: "Vegan", color: "bg-emerald-100 text-emerald-700" },
    { name: "Street food", color: "bg-yellow-100 text-yellow-800" },
    { name: "Batch cooking", color: "bg-lime-100 text-lime-700" },
    { name: "Matériel & techniques", color: "bg-slate-100 text-slate-700" },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
                <section className="grid gap-6 rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/70 md:grid-cols-2">
                    <div className="space-y-5">
                        <p className="inline-flex items-center rounded-full bg-lime-100 px-3 py-1 text-sm font-semibold text-lime-700">
                            Nouveau · Forum Gourmand
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
                            Inspirez-vous et partagez vos meilleures idées cuisine.
                        </h1>
                        <p className="text-lg text-gray-600">
                            Découvrez les tendances, demandez des conseils express et gardez vos recettes favorites à portée de main.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="search"
                                placeholder="Rechercher une recette, un ingrédient..."
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-base text-gray-800 outline-none focus:border-lime-400"
                            />
                            <button className="rounded-2xl bg-gray-900 px-6 py-3 text-base font-medium text-white transition hover:bg-gray-800">
                                Explorer
                            </button>
                        </div>
                        <Link
                            href="/atelier"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-900 px-6 py-3 text-base font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
                        >
                            Découvrir l'atelier du jour <span aria-hidden>→</span>
                        </Link>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span> 120 sujets actifs aujourd'hui</span>
                            <span> 3 800 passionnés connectés</span>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-gradient-to-br from-orange-200 via-lime-100 to-white p-6">
                        <h2 className="text-xl font-semibold text-gray-900">Discussions qui montent</h2>
                        <div className="mt-4 space-y-4">
                            {trendingTopics.map((topic) => (
                                <article
                                    key={topic.title}
                                    className="rounded-2xl bg-white/90 p-4 shadow-sm shadow-gray-200"
                                >
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{topic.tag}</span>
                                        <span>{topic.replies} réponses</span>
                                    </div>
                                    <h3 className="mt-1 text-lg font-medium text-gray-900">{topic.title}</h3>
                                    <p className="text-sm text-gray-500">par {topic.author}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section className="grid gap-6 md:grid-cols-3">
                    {featuredRecipes.map((recipe) => (
                        <article
                            key={recipe.title}
                            className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-gray-200"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="space-y-2 p-5">
                                <p className="text-sm text-gray-500">Recette mise en avant</p>
                                <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>⏱ {recipe.duration}</span>
                                    <span>⭐ {recipe.difficulty}</span>
                                </div>
                                <button className="text-sm font-semibold text-lime-600 hover:text-lime-700">
                                    Voir le fil ➝
                                </button>
                            </div>
                        </article>
                    ))}

                    <article className="rounded-3xl border border-dashed border-gray-200 bg-gradient-to-br from-white to-lime-50 p-6 text-center md:flex md:flex-col md:justify-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-500">
                            Communauté
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                            Partagez vos astuces, gagnez des badges et inspirez la tribu.
                        </h3>
                        <p className="mt-3 text-base text-gray-600">
                            Lancez un sujet en quelques secondes : photo, ingrédients, question... et laissez la communauté réagir.
                        </p>
                        <button className="mt-6 rounded-2xl bg-lime-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-lime-600">
                            Créer un sujet
                        </button>
                    </article>
                </section>

                <section className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/60">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
                                Explorations rapides
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                                Parcourez le forum par univers culinaires
                            </h2>
                            <p className="mt-1 text-gray-600">
                                Trouvez instantanément les discussions qui correspondent à vos envies du moment.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <span
                                    key={category.name}
                                    className={`rounded-full px-4 py-2 text-sm font-medium ${category.color}`}
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}


