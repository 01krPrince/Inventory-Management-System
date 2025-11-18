const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  // Define essential legal links for a single-line footer
  const essentialLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Support", href: "/support" },
  ];

  // Define your custom brand color and the developer name
  const brandColor = "#0c5888";
  const developerName = "Info Era Software Services Pvt. Ltd."; // Added developer name

  // Use a professional, slightly smaller font and subtle colors
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        {/* === 1. Copyright and Branding === */}
        {/* Updated span to include the developer name */}
        <span className="mb-2 sm:mb-0 mr-4 text-center sm:text-left">
          &copy; {currentYear}{" "}
          <strong className="inline font-bold" style={{ color: brandColor }}>
            Inventory
          </strong>
          . All Rights Reserved. Developed by{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {developerName}
          </span>
        </span>

        {/* === 2. Essential Links === */}
        <div className="flex space-x-4 md:space-x-6">
          {essentialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              // Tailwind class concatenation needs to be outside of bracket notation for dynamic values
              className={`
                text-gray-600 dark:text-gray-400 
                transition-colors duration-200 font-medium
                hover:text-[${brandColor}] dark:hover:text-[${brandColor}]
              `}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
