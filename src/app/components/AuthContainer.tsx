import React, { useEffect } from "react";
import localFont from "next/font/local";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import Image from "next/image";

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
  // This useEffect will initialize the theme based on system preference or user's saved preference
  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Check if user has saved a preference in localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className={`${satoshi.className} antialiased`}>
      <div className="flex flex-wrap items-center justify-center h-screen bg-white dark:bg-gray-800">
        {/* Left Side Image Container */}
        <motion.div
          className="h-screen p-[30px] bg-white dark:bg-gray-800 hidden lg:flex w-1/2"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="rounded-[20px] h-full w-full relative"
            layout // Animate layout change smoothly
          >
            <Image
              src="/images/test.png"
              alt="Test Image"
              layout="fill" // Ensures the image fills the container
              objectFit="contain" // Ensures the image maintains aspect ratio
              className="absolute right-0 rounded-[30px] h-full w-full "
            />
          </motion.div>
        </motion.div>

        {/* Right Side Form Container */}
        <motion.div
          className="bg-white dark:bg-gray-800 h-screen flex flex-col justify-center items-center p-8 lg:w-1/2"
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
