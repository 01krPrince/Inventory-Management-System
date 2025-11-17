const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  // Define essential legal links for a single-line footer
  const essentialLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Support", href: "/support" },
  ];

  // Define your custom brand color
  const brandColor = "#0c5888";

  // Use a professional, slightly smaller font and subtle colors
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        {/* === 1. Copyright and Branding === */}
        <span className="mb-2 sm:mb-0 mr-4">
          &copy; {currentYear}{" "}
          {/* Use <span> or regular <b> instead of <p> for inline content */}
          <strong
            className="inline font-bold"
            style={{ color: brandColor }} // Apply the color directly to the brand name
          >
            Inventory
          </strong>
          . All Rights Reserved.
        </span>

        {/* === 2. Essential Links === */}
        <div className="flex space-x-4 md:space-x-6">
          {essentialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
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
