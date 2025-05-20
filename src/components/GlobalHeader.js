import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function GlobalHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md transition-colors duration-500">
      <div className="text-xl font-bold">
        <Link to="/">RESTIMER</Link>
      </div>
      <div className="flex items-center space-x-4">
        {location.pathname === '/' ? (
          <Link
            to="/nametag"
            className="btn btn-primary"
          >
            태그 띄우기
          </Link>
        ) : (
          <Link to="/" className="btn btn-primary">
            타이머로 돌아가기
          </Link>
        )}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-300"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

export default GlobalHeader;