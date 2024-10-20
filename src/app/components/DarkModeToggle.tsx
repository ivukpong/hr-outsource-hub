import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // This useEffect will initialize the theme based on system preference or user's saved preference
  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Check if user has saved a preference in localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // This function toggles the dark mode manually and saves the user's choice
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light"); // Save user preference
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Save user preference
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2">
      {isDarkMode ? "🌞 Light Mode" : "🌜 Dark Mode"}
    </button>
  );
}
