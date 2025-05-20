import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Settings() {
  const [settings, setSettings] = useState({
    neuralMode: true,
    theme: 'light',
    workTime: 50,  // in minutes
    restTime: 10   // in minutes
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Apply theme
    if (JSON.parse(savedSettings)?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Apply theme change
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);
  
  const toggleNeuralMode = () => {
    setSettings(prev => ({
      ...prev,
      neuralMode: !prev.neuralMode
    }));
  };
  
  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };
  
  const handleTimeChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSettings(prev => ({
        ...prev,
        [type]: value
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            ✕
          </Link>
        </div>
        
        <div className="space-y-6">
          {/* Timer Settings */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Work Time (minutes)</label>
                <input 
                  type="number" 
                  value={settings.workTime}
                  onChange={(e) => handleTimeChange(e, 'workTime')}
                  min="1"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block mb-2">Rest Time (minutes)</label>
                <input 
                  type="number" 
                  value={settings.restTime}
                  onChange={(e) => handleTimeChange(e, 'restTime')}
                  min="1"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          
          {/* Toggle Settings */}
          <div className="flex items-center justify-between">
            <span className="text-lg">Neural Mode</span>
            <button 
              onClick={toggleNeuralMode}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                settings.neuralMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  settings.neuralMode ? 'translate-x-7' : ''
                }`} 
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg">Dark Mode</span>
            <button 
              onClick={toggleTheme}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                settings.theme === 'dark' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  settings.theme === 'dark' ? 'translate-x-7' : ''
                }`} 
              />
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <Link 
            to="/" 
            className="block w-full py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90"
          >
            저장 및 타이머로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Settings;