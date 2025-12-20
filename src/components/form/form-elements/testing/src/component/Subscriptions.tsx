import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Info,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Utensils,
  ArrowRight,
} from "lucide-react";
import Footer from "./Footer";

// --- Reusable Reveal Animation (Same as Landing Page) ---
const RevealOnScroll = ({ children, delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "-translate-x-10 opacity-0";
        case "right":
          return "translate-x-10 opacity-0";
        case "up":
        default:
          return "translate-y-10 opacity-0";
      }
    }
    return "translate-0 opacity-100";
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${getTransformClass()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SubscriptionPage = () => {
  // --- State ---
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [addOns, setAddOns] = useState({}); // { id: quantity }

  // --- Mock Data ---
  const planDetails = {
    kitchenName: "Annapurna Kitchen",
    kitchenImg:
      "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800",
    chefImg:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
    planName: "Weekly Lite (Lunch)",
    rating: 4.8,
    basePrice: 660, // 6 days * 110
    daysCount: 6,
    type: "Pure Veg",
    features: ["6 Lunches (Mon-Sat)", "Free Delivery", "Skip any day"],
  };

  const weeklyMenu = {
    Mon: {
      main: "Rajma Masala",
      side: "Jeera Aloo",
      bread: "4 Rotis",
      rice: "Steam Rice",
    },
    Tue: {
      main: "Kadhi Pakoda",
      side: "Bhindi Fry",
      bread: "4 Rotis",
      rice: "Jeera Rice",
    },
    Wed: {
      main: "Dal Makhani",
      side: "Mix Veg",
      bread: "4 Rotis",
      rice: "Peas Pulao",
    },
    Thu: {
      main: "Chole",
      side: "Aloo Gobhi",
      bread: "4 Rotis",
      rice: "Plain Rice",
    },
    Fri: {
      main: "Paneer Butter Masala",
      side: "Dal Tadka",
      bread: "4 Rotis",
      rice: "Jeera Rice",
    },
    Sat: {
      main: "Khichdi Special",
      side: "Begun Bhaja",
      bread: "Papad & Curd",
      rice: "-",
    },
  };

  const exploreItems = [
    {
      id: 101,
      name: "Gulab Jamun (2 pcs)",
      price: 40,
      img: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 102,
      name: "Extra Curd (100ml)",
      price: 20,
      img: "https://images.unsplash.com/photo-1567332217033-22c95af44929?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 103,
      name: "Roasted Papad (2 pcs)",
      price: 10,
      img: "https://plus.unsplash.com/premium_photo-1695297515025-a7b203c947ce?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: 104,
      name: "Fruit Salad Bowl",
      price: 60,
      img: "https://images.unsplash.com/photo-1511690656952-34342d5c2899?auto=format&fit=crop&q=80&w=300",
    },
  ];

  // --- Handlers ---
  const updateAddOn = () => {
    // mid, change
    // setAddOns((prev) => {
    //   const currentQty = prev[id] || 0;
    //   const newQty = Math.max(0, currentQty + change);
    //   if (newQty === 0) {
    //     const { [id]: _, ...rest } = prev;
    //     return rest;
    //   }
    //   return { ...prev, [id]: newQty };
    // });
  };

  const calculateTotal = () => {
    // let total = planDetails.basePrice;
    // exploreItems.forEach((item) => {
    //   if (addOns[item.id])
    //     total += item.price * addOns[item.id] * planDetails.daysCount; // Assuming add-on is for every day of the plan
    // });
    // return total;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* --- Simple Navbar for Checkout Flow --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />{" "}
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Step 2 of 3
            </span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- LEFT COLUMN: Customization --- */}
          <div className="lg:w-2/3 space-y-8">
            {/* 1. Selected Plan Card */}
            <RevealOnScroll direction="right">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gray-900 relative">
                  <img
                    src={planDetails.kitchenImg}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute -bottom-10 left-6">
                    <img
                      src={planDetails.chefImg}
                      alt="Chef"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                    {planDetails.type}
                  </div>
                </div>
                <div className="pt-12 pb-6 px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {planDetails.kitchenName}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Star className="w-4 h-4 text-orange-500 fill-current" />
                        <span className="font-semibold text-gray-800">
                          {planDetails.rating}
                        </span>{" "}
                        • North Indian • 1.2km away
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-500">Selected Plan</p>
                      <p className="text-xl font-bold text-orange-600">
                        {planDetails.planName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {planDetails.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-green-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </RevealOnScroll>

            {/* 2. Menu Preview (Tabs) */}
            <RevealOnScroll direction="up" delay={100}>
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-500" /> What's on
                    the menu?
                  </h2>
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 font-medium">
                    Rotating Menu
                  </span>
                </div>

                {/* Day Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
                  {Object.keys(weeklyMenu).map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`min-w-[3.5rem] py-2 rounded-xl text-sm font-bold transition-all ${
                        selectedDay === day
                          ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Menu Content */}
                <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between border-b border-orange-200 pb-2">
                      <span className="text-gray-500 text-sm">Main Course</span>
                      <span className="font-bold text-gray-800">
                        {/* {weeklyMenu[selectedDay].main} */}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-orange-200 pb-2">
                      <span className="text-gray-500 text-sm">
                        Seasonal Veg
                      </span>
                      <span className="font-bold text-gray-800">
                        {/* {weeklyMenu[selectedDay].side} */}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-orange-200 pb-2">
                      <span className="text-gray-500 text-sm">Breads</span>
                      <span className="font-bold text-gray-800">
                        {/* {weeklyMenu[selectedDay].bread} */}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Rice</span>
                      <span className="font-bold text-gray-800">
                        {/* {weeklyMenu[selectedDay].rice} */}
                      </span>
                    </div>
                  </div>
                  {/* Visual decoration */}
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-orange-100 p-1 shadow-inner shrink-0 hidden sm:block">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/706/706195.png"
                      alt="Thali"
                      className="w-full h-full object-contain opacity-80"
                    />
                  </div>
                </div>
              </section>
            </RevealOnScroll>

            {/* 3. Explore More / Add-ons */}
            <RevealOnScroll direction="up" delay={200}>
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-500" /> Add Extras to
                  your Daily Meal
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {exploreItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition bg-white"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          ₹{item.price} / day
                        </p>
                      </div>
                      {/* {addOns[item.id] ? ( */}
                      <div className="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
                        <button
                          // onClick={() => updateAddOn(item.id, -1)}
                          className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-3 text-center">
                          {/* {addOns[item.id]} */}
                        </span>
                        <button
                          // onClick={() => updateAddOn(item.id, 1)}
                          className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {/* ) : ( */}
                      <button
                        //   onClick={() => updateAddOn(item.id, 1)}
                        className="px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 uppercase"
                      >
                        Add
                      </button>
                      {/* )} */}
                    </div>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          </div>

          {/* --- RIGHT COLUMN: Price & Checkout (Sticky) --- */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <RevealOnScroll direction="left" delay={300}>
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 text-white flex justify-between items-center">
                    <h3 className="font-bold">Bill Summary</h3>
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-bold">
                      {planDetails.daysCount} Days
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Base Price */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subscription Total</span>
                      <span className="font-medium">
                        ₹{planDetails.basePrice}
                      </span>
                    </div>

                    {/* Add-ons List */}
                    {Object.keys(addOns).length > 0 && (
                      <div className="border-t border-dashed border-gray-200 pt-3 space-y-2">
                        {exploreItems
                          //   .filter((i) => addOns[i.id])
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-xs text-gray-500"
                            >
                              <span>
                                {/* {item.name} (x{addOns[item.id]}) */}
                              </span>
                              <span>
                                ₹
                                {item.price *
                                  //   addOns[item.id] *
                                  planDetails.daysCount}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Fees & Taxes */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        Delivery Fee <Info className="w-3 h-3 text-gray-400" />
                      </span>
                      <span className="text-green-600 font-bold text-xs uppercase">
                        Free
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Charges</span>
                      <span className="font-medium">₹24</span>
                    </div>

                    {/* Discount Banner */}
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-800">
                          Use code 'TIFFIN20'
                        </p>
                        <p className="text-[10px] text-green-600">
                          Save ₹50 on this order
                        </p>
                      </div>
                      <button className="ml-auto text-xs font-bold text-green-700 hover:underline">
                        APPLY
                      </button>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Grand Total</p>
                        <p className="text-2xl font-extrabold text-gray-900">
                          {/* ₹{calculateTotal() + 24} */}
                        </p>
                      </div>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2">
                        Pay Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Safe & Secure Payment
                  </div>
                </div>
              </RevealOnScroll>

              {/* Assurance Card */}
              <RevealOnScroll direction="up" delay={400}>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Easy Scheduling
                    </p>
                    <p className="text-xs text-gray-500">
                      Pause or cancel dates after booking.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </main>

      <RevealOnScroll>
        <Footer />
      </RevealOnScroll>
    </div>
  );
};

export default SubscriptionPage;
