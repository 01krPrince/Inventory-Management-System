import {
  ChefHat,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Smartphone,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 font-sans border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Top Section: Brand & Apps --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-800 pb-12 mb-12 gap-8">
          {/* Brand Logo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
                <ChefHat className="text-white w-8 h-8" />
              </div>
              <span className="font-extrabold text-3xl tracking-tight text-white">
                online<span className="text-orange-500">-food</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Order fresh, homemade tiffins from the best local chefs. Healthy
              food, delivered daily to your doorstep.
            </p>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center gap-3 bg-gray-900 border border-gray-700 hover:border-orange-500 px-5 py-3 rounded-xl transition-all duration-300 group">
              <Smartphone className="w-8 h-8 text-gray-400 group-hover:text-white transition" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  Get it on
                </p>
                <p className="text-sm font-bold text-white group-hover:text-orange-400 transition">
                  Google Play
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-gray-900 border border-gray-700 hover:border-orange-500 px-5 py-3 rounded-xl transition-all duration-300 group">
              <div className="w-8 h-8 flex items-center justify-center">
                {/* Apple Icon Placeholder */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 text-gray-400 group-hover:text-white"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.03 4.1-1.03 2.63.13 3.73 1.25 4.35 2.18-3.56 2.06-2.81 7.22.95 8.78-.69 1.76-1.52 3.16-2.48 4.3zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  Download on the
                </p>
                <p className="text-sm font-bold text-white group-hover:text-orange-400 transition">
                  App Store
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* --- Middle Section: Links Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Column 1 */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-xs">
              Company
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Online-Food Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Bug Bounty
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Corporate Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-xs">
              Contact
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Help & Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Partner with us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Ride with us
                </a>
              </li>
              <li className="flex items-center gap-2 pt-2 text-gray-500">
                <Mail className="w-4 h-4" /> support@onlinefood.com
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-xs">
              Legal
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Refund & Cancellation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 hover:pl-1 transition-all"
                >
                  Offer Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-xs">
              Social Links
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-orange-500 hover:scale-110 transition-all shadow-lg shadow-black/20"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 transition-all shadow-lg shadow-black/20"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all shadow-lg shadow-black/20"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-sky-500 hover:scale-110 transition-all shadow-lg shadow-black/20"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-8 bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-2 font-bold uppercase">
                Newsletter
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-950 text-sm p-2 rounded-l-md border border-gray-700 focus:outline-none focus:border-orange-500"
                />
                <button className="bg-orange-500 px-3 rounded-r-md text-white font-bold text-xs hover:bg-orange-600">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Cities Section (Big Footprint like Swiggy) --- */}
        <div className="border-t border-gray-800 pt-8 pb-8">
          <h4 className="text-gray-500 font-bold uppercase text-xs mb-4">
            We deliver to
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
            {[
              "Patna",
              "Delhi NCR",
              "Mumbai",
              "Bangalore",
              "Pune",
              "Hyderabad",
              "Chennai",
              "Kolkata",
              "Ahmedabad",
              "Chandigarh",
              "Jaipur",
              "Lucknow",
              "Indore",
              "Bhopal",
              "Kota",
              "Ranchi",
              "Surat",
              "Vadodara",
              "Ludhiana",
            ].map((city, i) => (
              <span
                key={i}
                className="hover:text-white cursor-pointer transition"
              >
                {city}
              </span>
            ))}
            <span className="text-orange-500 cursor-pointer font-bold">
              See all 400+ cities
            </span>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 online-food Technologies Pvt. Ltd.
          </p>

          {/* THE SIGNATURE 😎 */}
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full border border-gray-800 hover:border-orange-500/50 transition duration-300">
            <span className="text-sm font-medium text-gray-300">
              Developed by{" "}
              <a
                href="https://www.linkedin.com/in/01krPrince"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:underline"
              >
                01krPrince
              </a>{" "}
              😎 with <span className="text-red-500 animate-pulse">❤</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
