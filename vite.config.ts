// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     svgr({
//       svgrOptions: {
//         icon: true,
//         // This will transform your SVG to a React component
//         exportType: "named",
//         namedExport: "ReactComponent",
//       },
//     }),
//   ],
// });
import { defineConfig, createLogger } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// --- PROFESSIONAL CLEAN BUILD CONFIGURATION ---

// 1. Create a custom logger
const logger = createLogger();
const originalWarn = logger.warn;

// 2. Override the warning function to filter out specific noise
logger.warn = (msg, options) => {
  // IGNORE: The specific CSS syntax error from simplebar/tailwind-scrollbar
  if (msg.includes('Unexpected ")" [css-syntax-error]')) return;
  if (msg.includes('Expected identifier but found')) return;
  
  // SHOW: All other legitimate warnings
  originalWarn(msg, options);
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  
  // 3. Attach our custom "silencer" logger
  customLogger: logger,

  // 4. Optimization settings
  build: {
    // Raises the warning limit to 1500kb so "Some chunks are larger" warning also disappears
    chunkSizeWarningLimit: 1500, 
  }
});