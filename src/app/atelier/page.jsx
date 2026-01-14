    "use client";

import Link from "next/link";
import React from "react";

const workshopSteps = [
  "Infuser un bouillon au kombu pendant 20 minutes",
  "Émincer finement les shiitakés puis les faire revenir",
  "Assembler le bol : nouilles ramen, garniture et huile parfumée",
];

export default function AtelierPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-lime-50 to-white text-gray-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-500">
            Atelier du jour
          </p>
          <h1 className="text-4xl font-semibold">Ramen végétal parfumé</h1>
          <p className="text-gray-600">
            Suivez les étapes partagées par la communauté pour réussir un ramen maison riche en umami sans bouillon animal.
          </p>
        </header>

        <section className="rounded-3xl bg-white p-8 shadow-xl shadow-lime-100">
          <h2 className="text-2xl font-semibold">Étapes clés</h2>
          <ol className="mt-4 space-y-3 text-lg text-gray-700">
            {workshopSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-lime-500 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <button className="mt-6 w-full rounded-2xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-gray-800">
            Participer à la discussion
          </button>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">
            Besoin d'une autre inspiration ? Revenez à l'accueil pour parcourir toutes les discussions et recettes.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-900 px-6 py-3 text-base font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
