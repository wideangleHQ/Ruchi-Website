"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, ArrowRight, X, Utensils } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  category: "VEGETARIAN" | "NON-VEG";
  cookTime: string;
  servings: string;
  description: string;
  imageUrl: string;
  spiceUsed: string;
  ingredients: string[];
  instructions: string[];
}

export function RecipeShowcase() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const recipes: Recipe[] = [
    {
      id: "1",
      title: "Classic Restaurant-Style Dal Makhani",
      category: "VEGETARIAN",
      cookTime: "45 mins",
      servings: "4 Servings",
      description: "Rich, creamy, and deeply flavorful black lentils simmered with Ruchi Garam Masala and pure butter.",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
      spiceUsed: "Ruchi Special Garam Masala & Kasturi Methi",
      ingredients: [
        "1 cup Whole Black Lentils (Urad Dal)",
        "1/4 cup Kidney Beans (Rajma)",
        "2 tsp Ruchi Special Garam Masala",
        "1 tsp Ruchi Kashmiri Red Chilli Powder",
        "2 tbsp Butter & 3 tbsp Fresh Cream",
      ],
      instructions: [
        "Soak lentils and kidney beans overnight for 8 hours.",
        "Pressure cook with salt until soft.",
        "Simmer on low heat with Ruchi Kashmiri Chilli Powder, butter, and cream.",
        "Finish with Ruchi Garam Masala and serve piping hot with Naan.",
      ],
    },
    {
      id: "2",
      title: "Sattvik Punjabi Chole Bhature",
      category: "VEGETARIAN",
      cookTime: "1 hr 20 mins",
      servings: "6 Servings",
      description: "Tangy, spice-infused chickpea curry prepared with Sattvik Ruchi Chole Masala without onion or garlic.",
      imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
      spiceUsed: "Ruchi Sattvik Chole Masala",
      ingredients: [
        "2 cups Kabuli Chana (soaked)",
        "2 tbsp Ruchi Sattvik Chole Masala",
        "1 tsp Ruchi Turmeric Powder",
        "2 Tea bags for rich dark colour",
        "Fresh coriander and lemon juice",
      ],
      instructions: [
        "Boil chickpeas with tea bags and whole spices until tender.",
        "Prepare tomato pulp puree and cook with Ruchi Sattvik Chole Masala.",
        "Combine and simmer for 20 minutes for deep infusion.",
        "Serve hot with fluffy puffed Bhaturas.",
      ],
    },
    {
      id: "3",
      title: "Aromatic Chicken Dum Biryani",
      category: "NON-VEG",
      cookTime: "2 hrs",
      servings: "6 Servings",
      description: "Layered Basmati rice and marinated chicken slow-cooked to royal perfection with Ruchi Biryani Masala.",
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
      spiceUsed: "Ruchi Biryani Masala & Chicken Masala",
      ingredients: [
        "750g Chicken pieces",
        "3 cups Long Grain Basmati Rice",
        "3 tbsp Ruchi Biryani Masala",
        "1 cup Curd & Fresh Mint",
        "Saffron infused milk",
      ],
      instructions: [
        "Marinate chicken in curd, ginger-garlic paste, and Ruchi Biryani Masala for 2 hours.",
        "Par-boil Basmati rice with whole spices until 70% cooked.",
        "Layer marinated chicken and rice, seal tightly with dough (Dum).",
        "Slow cook on low flame for 45 minutes until fragrant.",
      ],
    },
  ];

  return (
    <section id="recipes" className="py-20 bg-white border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
              RECIPES & INSPIRATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight">
              From the Kitchen
            </h2>
            <p className="text-sm text-muted-text mt-1">
              Authentic Indian recipes to pair with Ruchi pure spices.
            </p>
          </div>

          <button
            onClick={() => setSelectedRecipe(recipes[0])}
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary-green hover:text-deep-green uppercase transition-colors"
          >
            <span>All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group cursor-pointer rounded-[12px] border border-border bg-white overflow-hidden hover:border-primary-green/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-soft-green">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-[6px] text-[10px] font-bold text-text uppercase tracking-wider shadow-2xs">
                    {recipe.category}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-text mb-2">
                    <Clock className="w-3.5 h-3.5 text-primary-green" />
                    <span>{recipe.cookTime}</span>
                    <span>•</span>
                    <span>{recipe.servings}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-text group-hover:text-primary-green transition-colors line-clamp-1 mb-2">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-muted-text leading-relaxed line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-transparent flex items-center justify-between">
                <span className="text-[11px] font-semibold text-primary-green flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" /> Made with {recipe.spiceUsed.split("&")[0]}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-text group-hover:text-primary-green group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedRecipe(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[12px] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-xs font-bold text-primary-green uppercase tracking-wider">
                  {selectedRecipe.category} • {selectedRecipe.cookTime}
                </span>
                <h3 className="font-serif text-2xl font-bold text-text mt-1">
                  {selectedRecipe.title}
                </h3>
                <p className="text-xs text-muted-text mt-1">{selectedRecipe.description}</p>
              </div>

              <div className="p-3 rounded-[8px] bg-soft-green border border-border/60 text-xs text-text font-medium">
                🌶️ Key Spice: <span className="font-bold text-primary-green">{selectedRecipe.spiceUsed}</span>
              </div>

              <div>
                <h4 className="font-serif text-base font-semibold text-text mb-2">Ingredients</h4>
                <ul className="list-disc list-inside text-xs text-muted-text space-y-1">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-base font-semibold text-text mb-2">Preparation Steps</h4>
                <ol className="list-decimal list-inside text-xs text-muted-text space-y-1.5">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
