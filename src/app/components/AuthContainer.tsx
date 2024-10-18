import React from "react";
import localFont from "next/font/local";
import { motion } from "framer-motion"; // Import Framer Motion for animations

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "100 200 300 400 500 600 700 800 900",
});

// Animation variants for the image container and form container
const containerVariants = {
  hidden: { opacity: 0, x: -100 }, // Hidden state: fade out and slide to the left
  visible: {
    opacity: 1,
    x: 0, // Visible state: fade in and slide to position
    transition: { type: "spring", stiffness: 60, delay: 0.3 },
  },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 60, delay: 0.5 },
  },
};

function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${satoshi.className} antialiased`}>
      <div className="flex flex-wrap items-center justify-center h-screen bg-white">
        {/* Left Side Image Container */}
        <motion.div
          className="h-screen p-[30px] bg-white hidden md:flex w-1/2"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="bg-secondary rounded-[30px] h-full w-full"
            layout // Animate layout change smoothly
          ></motion.div>
        </motion.div>

        {/* Right Side Form Container */}
        <motion.div
          className="bg-white h-screen flex flex-col justify-center items-center p-8 lg:w-1/2"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthContainer;
