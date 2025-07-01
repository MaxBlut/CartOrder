import { useEffect, useState } from "react";

/*
needs the following code in the html file :

    <script>
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    </script>

*/

const DarkModeBtn = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setIsDarkMode(!isDarkMode);
  };
  return (
    <button
      id="toggleDark"
      onClick={() => {
        toggleTheme();
      }}
      className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-gray-300 hover:bg-gray-400 p-2 rounded mb-2"
    >
      Toggle Dark Mode
    </button>
  );
};

export default DarkModeBtn;
