import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Heart,
  Leaf,
  Flame,
  ChefHat,
  UtensilsCrossed,
  ShieldCheck,
  ChevronDown,
  Info,
} from "lucide-react";

const ExploreKitchens = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Mock Data with "Real" Attributes ---
  const kitchens = [
    {
      id: 1,
      name: "Maa Ki Rasoi",
      chefName: "Mrs. Savitri Devi",
      chefImg:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
      coverImg:
        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviewCount: "1.2k",
      type: "Pure Veg",
      tags: ["Homely", "Less Oil", "North Indian"],
      nextMeal: {
        type: "Lunch",
        item: "Rajma Chawal + Jeera Aloo + Roti",
        time: "Order before 11:30 AM",
      },
      price: 89,
      distance: "1.2 km",
      isFssaiVerified: true,
      promoted: true,
    },
    {
      id: 2,
      name: "Protein & Power",
      chefName: "Chef Aryan",
      chefImg:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
      coverImg:
        "https://images.unsplash.com/photo-1543353071-087f9bc1f544?auto=format&fit=crop&q=80&w=800",
      rating: 4.6,
      reviewCount: "850",
      type: "Veg & Non-Veg",
      tags: ["Keto", "High Protein", "Salads"],
      nextMeal: {
        type: "Dinner",
        item: "Grilled Chicken Breast + Quinoa Salad",
        time: "Pre-order for Tonight",
      },
      price: 150,
      distance: "3.5 km",
      isFssaiVerified: true,
      promoted: false,
    },
    {
      id: 3,
      name: "South Spices Tiffins",
      chefName: "Mr. Venkat",
      chefImg:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
      coverImg:
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      reviewCount: "2.1k",
      type: "Pure Veg",
      tags: ["Authentic", "Spicy", "Pocket Friendly"],
      nextMeal: {
        type: "Lunch",
        item: "Curd Rice + Potato Fry + Sambar",
        time: "Closing Soon",
      },
      price: 75,
      distance: "0.8 km",
      isFssaiVerified: true,
      promoted: false,
    },
    {
      id: 4,
      name: "Bachelor's Feast",
      chefName: "Rohan's Kitchen",
      chefImg:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
      coverImg:
        "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800",
      rating: 4.3,
      reviewCount: "300",
      type: "Veg & Non-Veg",
      tags: ["Bulk Orders", "Late Night", "Spicy"],
      nextMeal: {
        type: "Dinner",
        item: "Egg Curry + Paratha + Rice",
        time: "Open till 11 PM",
      },
      price: 110,
      distance: "2.1 km",
      isFssaiVerified: false,
      promoted: false,
    },
  ];

  const categories = [
    "All",
    "Pure Veg",
    "Non-Veg",
    "Diet/Keto",
    "Jain",
    "Budget Friendly",
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* --- Sticky Header with Real Context --- */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Location Context */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Delivering to
                </p>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  Kankarbagh, Patna <ChevronDown className="w-4 h-4" />
                </h2>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for 'Rajma', 'Keto', or 'Mrs. Sharma'..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition text-sm font-medium"
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-orange-500"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- Main Grid Content --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Title */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Explore Kitchens
            </h1>
            <p className="text-sm text-gray-500">
              42 Kitchens serving in your area
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-orange-500">
            Sort by: Relevance <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {/* Changed gap to 6 for better spacing */}
          {kitchens.map((kitchen) => (
            // --- The "Real Touch" Kitchen Card ---
            <div
              key={kitchen.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
            >
              {/* Promoted Tag */}
              {kitchen.promoted && (
                <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                  Ad • Best Seller
                </div>
              )}

              {/* Favourite Heart */}
              <button className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur rounded-full text-gray-400 hover:text-red-500 hover:scale-110 transition shadow-sm">
                <Heart className="w-4 h-4 fill-current" />
              </button>

              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                  src={kitchen.coverImg}
                  alt={kitchen.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                {/* Real Touch: Live Status Overlay at bottom of image */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                  {/* Chef Avatar Overlapping Image */}
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg">
                    <img
                      src={kitchen.chefImg}
                      alt={kitchen.chefName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <p className="text-[10px] opacity-90 leading-none">
                      Head Chef
                    </p>
                    <p className="text-xs font-bold leading-tight">
                      {kitchen.chefName}
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                  {kitchen.rating} <Star className="w-3 h-3 ml-1 fill-white" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Header Info */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1 group-hover:text-orange-600 transition">
                      {kitchen.name}
                      {kitchen.isFssaiVerified && (
                        <ShieldCheck
                          className="w-4 h-4 text-blue-500"
                          title="FSSAI Verified"
                        />
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      {kitchen.type === "Pure Veg" ? (
                        <Leaf className="w-3 h-3 text-green-500" />
                      ) : (
                        <UtensilsCrossed className="w-3 h-3 text-red-500" />
                      )}
                      {kitchen.tags.join(" • ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{kitchen.distance}</p>
                    <p className="text-xs font-semibold text-gray-600">
                      25-30 min
                    </p>
                  </div>
                </div>

                {/* Dynamic Menu Highlight (The Real Touch) */}
                <div className="mt-4 bg-orange-50 rounded-xl p-3 border border-orange-100">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3" /> On the menu •{" "}
                      {kitchen.nextMeal.type}
                    </p>
                    <span className="text-[10px] text-orange-700 bg-orange-200 px-1.5 py-0.5 rounded font-medium">
                      {kitchen.nextMeal.time}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    "{kitchen.nextMeal.item}"
                  </p>
                </div>

                {/* Footer: Price & Action */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-400 line-through">
                      ₹{kitchen.price + 30}
                    </p>
                    <p className="text-lg font-extrabold text-gray-900">
                      ₹{kitchen.price}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        / meal
                      </span>
                    </p>
                  </div>
                  <button className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg group-hover:bg-orange-500 transition shadow-lg group-hover:shadow-orange-500/30">
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- Filter Sidebar Overlay (Demo) --- */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          ></div>
          <div className="relative w-80 bg-white h-full shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
              {/* Veg/Non-Veg Toggle */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Dietary Preference
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-green-500 text-green-600 bg-green-50 rounded-lg text-sm font-semibold">
                    Pure Veg
                  </button>
                  <button className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:border-gray-300">
                    Non-Veg
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Price per Meal
                </label>
                <input type="range" className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹50</span>
                  <span>₹200+</span>
                </div>
              </div>

              {/* Kitchen Type */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                  Kitchen Type
                </label>
                <div className="space-y-3">
                  {[
                    "Home Kitchen (Verified)",
                    "Cloud Kitchen",
                    "Mess/Canteen",
                  ].map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-orange-500 rounded"
                      />
                      <span className="text-sm text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreKitchens;
