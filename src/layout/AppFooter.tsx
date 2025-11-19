const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  const essentialLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Support", href: "/support" },
  ];

  const brandColor = "#0c5888";

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span className="mb-2 sm:mb-0 mr-4 text-center sm:text-left">
          &copy; {currentYear}{" "}
          <strong className="inline font-bold" style={{ color: brandColor }}>
            Inventory
          </strong>
          . All Rights Reserved. Developed by
          <a target="_blank" href="https://infoerasoftware.com/">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {" "}
              Info Era Software Services Pvt. Ltd.
            </span>
          </a>
        </span>

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
