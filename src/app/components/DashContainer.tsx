// "use client"; // Marking this component as a client component
// import React from "react";

// import { useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import localFont from "next/font/local";
// import Image from "next/image";
// import { navs } from "../data";
// import NavItem from "../components/NavItem";

// const satoshi = localFont({
//   src: "../fonts/Satoshi-Variable.ttf",
//   variable: "--font-satoshi",
//   weight: "100 200 300 400 500 600 700 800 900",
// });

// export default function DashContainer({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/auth/signin");
//     }
//   }, [router]);

//   const pathname = usePathname();

//   return (
//     <div className={`${satoshi.className}`}>
//       <div className="flex min-h-screen bg-white">
//         <aside className="w-64 bg-gray-100 shadow-md my-7 mx-4 rounded-[15px] flex flex-col items-center fixed h-[95%] md:w-48 lg:w-64 xl:w-80">
//           <div className="p-6 flex gap-2 items-center justify-center">
//             <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
//               <Image
//                 src="/images/logo.png"
//                 alt="logo"
//                 width={36}
//                 height={36}
//                 className="object-contain"
//               />
//             </div>
//             <div className="text-2xl text-dark font-bold">GTCO</div>
//           </div>
//           <nav className="mt-10 w-full px-8">
//             <ul>
//               {navs.map((nav, index) => (
//                 <NavItem
//                   text={nav.name}
//                   key={index}
//                   href={
//                     nav.name === "Dashboard"
//                       ? "/dashboard"
//                       : `/dashboard/${nav.name.toLowerCase()}`
//                   }
//                   active={
//                     (pathname === "/dashbaord" && nav.name === "Dashboard") ||
//                     pathname
//                       .split("/")
//                       .splice(2)
//                       .includes(nav.name.toLowerCase())
//                   }
//                   icon={nav.icon}
//                 />
//               ))}
//             </ul>
//           </nav>
//         </aside>
//         <div className="flex-1 overflow-y-auto md:p-4 lg:p-8 xl:p-12">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import localFont from "next/font/local";
// import Image from "next/image";
// import { navs } from "../data";
// import NavItem from "../components/NavItem";

// const satoshi = localFont({
//   src: "../fonts/Satoshi-Variable.ttf",
//   variable: "--font-satoshi",
//   weight: "100 200 300 400 500 600 700 800 900",
// });

// export default function DashContainer({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/auth/signin");
//     }
//   }, [router]);

//   const pathname = usePathname();

//   return (
//     <div className={`${satoshi.className}`}>
//       <div className="flex min-h-screen bg-white text-ellipsis text-black">
//         <button
//           className="md:hidden absolute top-7 z-20 left-3 p-2 rounded-[5px]"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           )}
//         </button>
//         <aside
//           className={`${
//             isOpen ? "block" : "hidden"
//           } md:block z-10 bg-gray-100 shadow-md my-7 mx-4 rounded-[10px] flex flex-col items-center fixed h-[93%] w-64 `}
//         >
//           <div className="p-6 flex gap-2 items-center justify-center">
//             <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
//               <Image
//                 src="/images/logo.png"
//                 alt="logo"
//                 width={36}
//                 height={36}
//                 className="object-contain"
//               />
//             </div>
//             <div className="text-2xl text-dark font-bold">GTCO</div>
//           </div>
//           <nav className="mt-10 w-full px-6">
//             <ul>
//               {navs.map((nav, index) => (
//                 <NavItem
//                   text={nav.name}
//                   key={index}
//                   href={
//                     nav.name === "Dashboard"
//                       ? "/dashboard"
//                       : nav.name === "Logout"
//                         ? "/auth/signin"
//                         : `/dashboard/${nav.name.toLowerCase()}`
//                   }
//                   active={
//                     (pathname === "/dashbaord" && nav.name === "Dashboard") ||
//                     pathname
//                       .split("/")
//                       .splice(2)
//                       .includes(nav.name.toLowerCase())
//                   }
//                   icon={nav.icon}
//                 />
//               ))}
//             </ul>
//           </nav>
//         </aside>
//         <div className="flex-1 overflow-y-auto px-0 md:pl-10 pt-12 xl:ml-0">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import localFont from "next/font/local";
import Image from "next/image";
import { navs } from "../data";
import NavItem from "../components/NavItem";
import { motion } from "framer-motion";

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
      <div className="flex min-h-screen bg-white text-black relative">
        {/* Hamburger button for mobile */}
        <motion.button
          className="md:hidden absolute top-7 z-20 left-3 p-2 rounded-[5px]"
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
          className={`z-10 bg-gray-100 shadow-md my-7 mx-4 rounded-[15px] flex flex-col items-center fixed h-[93%] w-64 ${
            isOpen ? "block" : "hidden"
          } md:block`}
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
            <div className="text-2xl text-dark font-bold">GTCO</div>
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
