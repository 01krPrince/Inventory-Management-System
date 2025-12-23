import React from "react";
import { motion } from "framer-motion";

import logo from "../assets/logo.jpg";

const Header: React.FC = () => {
  return (
    <motion.img
      className="h-auto w-auto cursor-pointer"
      src={logo}
      alt="Inventory Management System Logo"
      whileHover={{
        scale: 1.1,
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 10,
        },
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />
  );
};

export default Header;
