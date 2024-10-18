import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { motion } from "framer-motion"; // Import Framer Motion for animations

// Animation variants for the header and profile section
const headerVariants = {
  hidden: { opacity: 0, y: -20 }, // Hidden state: fade out and slide up
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, delay: 0.3 },
  },
};

const profileVariants = {
  hidden: { opacity: 0, y: 20 }, // Hidden state: fade out and slide down
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, delay: 0.5 },
  },
};

const Layout = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  header?: string;
  desc?: string;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const data = localStorage.getItem("user");
      const temp = data ? JSON.parse(data) : null;
      setUser(temp);
    };
    getUser();
  }, []);

  return (
    <div className="flex-1 p-4 md:ml-56 bg-white">
      {/* Header Section */}
      <motion.div
        className="flex items-center justify-between mb-6 sm:mb-0 bg-white flex-col lg:flex-row pt-8 md:pt-0 md:px-2 lg:px-4 xl:px-6"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="md:mb-4">
          <p className="text-3xl font-bold text-dark">{props.header}</p>
          <p className="text-grey">{props.desc}</p>
        </div>

        {/* Profile Section */}
        <motion.div
          className="flex lg:flex-row flex-col items-center space-x-4 md:mt-0 mt-3 md:justify-center lg:justify-end xl:justify-end"
          initial="hidden"
          animate="visible"
          variants={profileVariants}
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <Image
              src={"/images/user.png"}
              alt="User Image"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-dark font-medium">{user?.name}</p>
            <p className="text-sm text-[#1E1E1E4F]">HR Manager</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto md:px-4">{children}</div>
    </div>
  );
};
export default Layout;
