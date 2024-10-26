import React, { useState } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import localFont from "next/font/local";
import Image from "next/image";
import { navs } from "../data";
import NavItem from "../components/NavItem";
import { motion } from "framer-motion";
import Modal from "./Modal";

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "100 200 300 400 500 600 700 800 900",
});

export default function DashContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  const pathname = usePathname();

  // Sidebar animation variants
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 }, // Hidden state: slide out to the left and fade out
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 }, // Visible state: slide in and fade in
    },
  };

  // Button fade in/out animation
  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2 } },
  };

  return (
    <div className={`${satoshi.className}`}>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="rounded-lg text-center max-w-sm">
          {/* Success Icon */}
          <Image
            src="/images/warn.png"
            alt="Warning Icon"
            className="h-20 mb-4 mx-auto"
            width={80} // Set an explicit width (adjust as needed)
            height={80} // Set an explicit height (adjust as needed)
          />
          {/* Success Message */}
          <h2 className="text-2xl font-semibold mb-2">Log Out</h2>
          <p className="text-gray-600 mb-6 w-[75%] mx-auto">
            Are you sure you would like to log out at this time?
          </p>
          {/* Go Home Button */}
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                router.push("/auth/signin");
              }}
              className="bg-[#D92D20] text-white py-2 cursor-pointer px-4 rounded-[5px] w-full"
            >
              Log Out
            </button>
            <button
              onClick={handleCloseModal}
              className="border-[#D5D7DA] border text-[#666666] dark:text-white py-2 cursor-pointer px-4 rounded-[5px] w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className="flex min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white relative">
        {/* Hamburger button for mobile */}
        <motion.button
          className="md:hidden fixed top-7 z-20 left-3 p-2 rounded-[5px] bg-white dark:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </motion.button>
        {/* Sidebar with Framer Motion for both opening and closing animations */}
        <motion.aside
          className={`z-10 bg-gray-100 dark:bg-gray-700 shadow-md my-7 mx-4 rounded-[15px] flex flex-col items-center fixed h-[93%] w-64 ${
            isOpen ? "block" : "hidden"
          } sm:block`}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          variants={sidebarVariants}
        >
          {/* Logo and branding */}
          <div className="p-6 pt-10 flex gap-2 items-center justify-start">
            <div className="w-9 h-9 bg-gray-200 overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="text-2xl text-dark dark:text-white font-bold">
              GTCO
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 w-full px-6">
            <ul>
              {navs.map((nav, index) => (
                <NavItem
                  text={nav.name}
                  key={index}
                  href={
                    nav.name === "Dashboard"
                      ? "/dashboard"
                      : nav.name === "Logout"
                        ? "/auth/signin"
                        : `/dashboard/${nav.name.toLowerCase()}`
                  }
                  active={
                    (pathname === "/dashbaord" && nav.name === "Dashboard") ||
                    pathname
                      .split("/")
                      .splice(2)
                      .includes(nav.name.toLowerCase())
                  }
                  icon={nav.icon}
                />
              ))}
              <li
                className={`px-4 py-2 h-12 my-1 rounded-r-[10px] dark:text-white  text-gray-700 hover:bg-secondary dark:hover:text-primary cursor-pointer`}
                onClick={handleOpenModal}
              >
                <div className="flex gap-2 items-center">
                  <i className={`fas fa-door-open mr-2`}></i>
                  Logout
                </div>
              </li>
            </ul>
          </nav>
        </motion.aside>
        {/* Main content area */}
        <motion.div
          className="flex-1 overflow-y-auto px-0 md:pl-10 pt-12 xl:ml-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 50 },
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
