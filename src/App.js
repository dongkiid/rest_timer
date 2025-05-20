
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Timer from './components/Timer';
import Nametag from './pages/Nametag';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/nametag" element={<Nametag />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
