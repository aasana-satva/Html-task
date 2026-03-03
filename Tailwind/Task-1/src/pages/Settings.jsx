import { useEffect, useState } from "react";

export default function Settings() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const handleThemeToggle = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    const nextTheme = nextIsDark ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextIsDark);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Settings
      </h2>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Theme switch (dark/light)
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={handleThemeToggle}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
            isDark ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              isDark ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
