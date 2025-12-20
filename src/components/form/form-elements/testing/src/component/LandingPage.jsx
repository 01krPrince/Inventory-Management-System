import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChefHat,
  Calendar,
  Truck,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Quote,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Smartphone,
  Users,
  Utensils,
} from "lucide-react";

// IMPORTANT: Ensure Footer.jsx exists in the same folder
import Footer from "./Footer";

// --- 1. Advanced Scroll Animation Component (Multi-Directional) ---
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
      { threshold: 0.15 } // Trigger a bit later for better effect
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Calculate transform based on direction
  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "-translate-x-20 opacity-0";
        case "right":
          return "translate-x-20 opacity-0";
        case "down":
          return "-translate-y-20 opacity-0";
        case "up":
        default:
          return "translate-y-20 opacity-0";
      }
    }
    return "translate-x-0 translate-y-0 opacity-100";
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${getTransformClass()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- 2. FAQ Item Component ---
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none hover:text-orange-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-orange-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

// --- 3. Main Landing Page ---
const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Data ---
  const kitchens = [
    {
      name: "Annapurna Kitchen",
      rating: 4.8,
      type: "North Indian",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Spice Route Tiffins",
      rating: 4.6,
      type: "South Indian",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Green Bowl Healthy",
      rating: 4.9,
      type: "Keto & Salads",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const plans = [
    {
      name: "The Trial",
      type: "Daily",
      price: "₹120",
      per: "/meal",
      features: [
        "Ideal for testing",
        "Standard Packaging",
        "Choose any kitchen",
      ],
      recommended: false,
    },
    {
      name: "Weekly Lite",
      type: "Weekly",
      price: "₹110",
      per: "/meal",
      features: [
        "5% Discount applied",
        "Fixed Menu Rotation",
        "Free Cancellation",
      ],
      recommended: true,
    },
    {
      name: "Pro Monthly",
      type: "Monthly",
      price: "₹99",
      per: "/meal",
      features: [
        "Best Value (15% off)",
        "Customizable Menu",
        "Priority Delivery",
      ],
      recommended: false,
    },
  ];

  const testimonials = [
    {
      name: "Riya Sharma",
      role: "Student, Kota",
      text: "Moving to Kota for studies was hard, but finding 'Ghar ka khana' wasn't. The weekly plan saved my life!",
    },
    {
      name: "Vikram Malhotra",
      role: "IT Professional",
      text: "I tried 3 different kitchens before settling on 'Maa Ki Rasoi'. The flexibility to pause when I travel is amazing.",
    },
    {
      name: "Anjali Gupta",
      role: "Banker",
      text: "Healthy, less oil, and on time. Exactly what I needed for my office lunches. Highly recommended!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">
      {/* --- Navigation --- */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <ChefHat className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">
                online<span className="text-orange-500">-food</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/explore"
                className="text-gray-600 hover:text-orange-500 font-medium transition"
              >
                Explore Kitchens
              </Link>
              <a
                href="#plans"
                className="text-gray-600 hover:text-orange-500 font-medium transition"
              >
                Subscriptions
              </a>
              <a
                href="#safety"
                className="text-gray-600 hover:text-orange-500 font-medium transition"
              >
                Safety
              </a>
              <button className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/30">
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg absolute w-full">
            <Link to="/explore" className="block text-gray-600 font-medium">
              Explore Kitchens
            </Link>
            <a href="#plans" className="block text-gray-600 font-medium">
              Subscriptions
            </a>
            <button className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1600"
            alt="Delicious Food"
            className="w-full h-full object-cover object-center lg:object-right"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/95 to-gray-50/20 lg:to-transparent"></div>
        </div>

        <RevealOnScroll direction="right">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
                <Star className="w-4 h-4 mr-2 fill-current" /> #1 Rated Tiffin
                Service App
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Homemade Food, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                  Delivered Daily.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Missing home food? Subscribe to affordable, healthy, and
                hygienic tiffin services from verified home chefs near you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/explore">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200">
                    Find Food Near Me <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-white transition shadow-sm hover:shadow-md">
                  View Sample Menus
                </button>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                      />
                    </div>
                  ))}
                </div>
                <p>
                  Trusted by{" "}
                  <span className="font-bold text-gray-800">10,000+</span> happy
                  students & professionals
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* --- NEW SECTION: Stats Bar (Slide Up) --- */}
      <section className="bg-orange-500 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-orange-400/50">
            {[
              {
                num: "500+",
                label: "Verified Kitchens",
                icon: <ChefHat className="w-6 h-6 mb-2 mx-auto opacity-80" />,
              },
              {
                num: "1.2M+",
                label: "Meals Served",
                icon: <Utensils className="w-6 h-6 mb-2 mx-auto opacity-80" />,
              },
              {
                num: "15+",
                label: "Cities Active",
                icon: <MapPin className="w-6 h-6 mb-2 mx-auto opacity-80" />,
              },
              {
                num: "4.8/5",
                label: "User Rating",
                icon: <Star className="w-6 h-6 mb-2 mx-auto opacity-80" />,
              },
            ].map((stat, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100} direction="up">
                <div className="flex flex-col items-center">
                  {stat.icon}
                  <h3 className="text-3xl md:text-4xl font-extrabold">
                    {stat.num}
                  </h3>
                  <p className="text-orange-100 text-sm uppercase tracking-wider font-semibold mt-1">
                    {stat.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll direction="down">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How it Works</h2>
              <p className="text-gray-500 mt-2">
                Get your tiffin started in 3 easy steps
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-orange-100 -z-10"></div>
            {[
              {
                icon: <MapPin />,
                title: "Choose Location",
                desc: "Enter your area to find verified home chefs nearby.",
              },
              {
                icon: <Calendar />,
                title: "Select Plan",
                desc: "Choose a daily, weekly, or monthly subscription plan.",
              },
              {
                icon: <Truck />,
                title: "Enjoy Meal",
                desc: "Get hot, fresh food delivered to your doorstep daily.",
              },
            ].map((step, idx) => (
              <RevealOnScroll key={idx} delay={idx * 200} direction="up">
                <div className="flex flex-col items-center text-center bg-white p-6">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-6 border-4 border-white shadow-xl transition-transform hover:scale-110 duration-300">
                    {React.cloneElement(step.icon, { className: "w-10 h-10" })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Trending Kitchens --- */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll direction="left">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Trending Kitchens</h2>
                <p className="text-gray-400">
                  Top-rated providers in your area this week.
                </p>
              </div>
              <Link
                to="/explore"
                className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 group"
              >
                View All{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {kitchens.map((kitchen, idx) => (
              <RevealOnScroll key={idx} delay={idx * 150} direction="up">
                <div className="bg-gray-800 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-orange-900/20 transition duration-300 border border-gray-700 hover:border-orange-500/50">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={kitchen.img}
                      alt={kitchen.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-orange-500 fill-current" />{" "}
                      {kitchen.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-1">{kitchen.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{kitchen.type}</p>
                    <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                      <span className="text-sm text-gray-300 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 45 mins
                      </span>
                      <button className="text-sm font-semibold text-orange-400 hover:text-white transition">
                        View Menu
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: Safety & Hygiene (Split Screen Scroll) --- */}
      <section id="safety" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image coming from Left */}
            <div className="lg:w-1/2 w-full">
              <RevealOnScroll direction="left">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full z-0"></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-100 rounded-full z-0"></div>
                  <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800"
                    alt="Safety Checks"
                    className="relative z-10 rounded-3xl shadow-2xl w-full object-cover h-[400px]"
                  />
                  <div className="absolute bottom-8 left-8 z-20 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShieldCheck className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">100% Verified</p>
                      <p className="text-xs text-gray-500">
                        FSSAI Registered Kitchens
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Text coming from Right */}
            <div className="lg:w-1/2 w-full">
              <RevealOnScroll direction="right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4">
                  <ShieldCheck className="w-4 h-4" /> Safety First
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                  Hygiene isn't just a feature, <br />
                  it's our promise.
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We take safety seriously. Every home kitchen partner undergoes
                  a rigorous 25-point quality audit before listing.
                </p>
                <ul className="space-y-4">
                  {[
                    "Daily Temperature Checks for Chefs",
                    "Mandatory Hair Nets & Gloves",
                    "Sanitized Kitchen Surfaces",
                    "Contactless Delivery Options",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700 font-medium"
                    >
                      <CheckCircle2 className="text-orange-500 w-5 h-5 flex-shrink-0" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* --- Pricing/Plans Section --- */}
      <section id="plans" className="py-24 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll direction="down">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Flexible Meal Plans
              </h2>
              <p className="text-lg text-gray-600">
                No long-term contracts. Pause when you travel.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <RevealOnScroll key={idx} delay={idx * 150} direction="up">
                <div
                  className={`relative p-8 rounded-3xl bg-white border ${
                    plan.recommended
                      ? "border-orange-500 shadow-2xl scale-105 z-10"
                      : "border-gray-200 shadow-lg"
                  } transition-all hover:-translate-y-2`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-md">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {plan.type}
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">{plan.per}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />{" "}
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 rounded-xl font-bold transition ${
                      plan.recommended
                        ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll direction="down">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
              What our customers say
            </h2>
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100} direction="up">
                <div className="bg-gray-50 p-8 rounded-2xl relative border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-orange-200 fill-current" />
                  <div className="flex items-center gap-1 mb-4 text-orange-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 relative z-10 font-medium leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/100?img=${idx + 32}`}
                        alt={t.name}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {t.name}
                      </h4>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <RevealOnScroll direction="up">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <FaqItem
                question="Can I pause my subscription?"
                answer="Yes! You can pause your subscription anytime via the app. The days you skip will be carried forward to the next billing cycle."
              />
              <FaqItem
                question="Is the food hygienic?"
                answer="Absolutely. Every kitchen partner is FSSAI registered and undergoes a strict hygiene audit every month."
              />
              <FaqItem
                question="Can I change my kitchen?"
                answer="Yes, you can switch kitchens weekly. We want you to enjoy a variety of tastes."
              />
              <FaqItem
                question="What if I don't like a meal?"
                answer="We offer a money-back guarantee for your first trial meal. If you don't like it, we refund it."
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- NEW SECTION: Mobile App CTA (Before Footer) --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="md:w-1/2 z-10 mb-10 md:mb-0">
              <RevealOnScroll direction="left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Food is better <br />{" "}
                  <span className="text-orange-500">on the app.</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                  Track your tiffin in real-time, manage subscriptions, and get
                  exclusive app-only discounts.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-orange-50 transition font-bold">
                    <Smartphone className="w-5 h-5" /> Download App
                  </button>
                </div>
              </RevealOnScroll>
            </div>

            <div className="md:w-1/2 relative z-10 flex justify-center md:justify-end">
              <RevealOnScroll direction="right" delay={200}>
                {/* Abstract Phone Mockup */}
                <div className="relative w-64 h-[500px] bg-gray-800 rounded-[3rem] border-8 border-gray-700 shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-800 flex flex-col">
                    <div className="h-full w-full bg-orange-500/10 flex items-center justify-center">
                      <ChefHat className="w-20 h-20 text-orange-500 opacity-50" />
                    </div>
                    {/* Fake App UI Elements */}
                    <div className="absolute bottom-0 w-full h-1/2 bg-white rounded-t-3xl p-4">
                      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                      <div className="w-full h-12 bg-orange-100 rounded-xl mb-3"></div>
                      <div className="w-full h-12 bg-gray-100 rounded-xl mb-3"></div>
                      <div className="w-2/3 h-12 bg-gray-100 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer Integration --- */}
      <Footer />
    </div>
  );
};

export default LandingPage;
