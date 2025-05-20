import React, { useState, useEffect, useRef } from 'react';

// Brain activation areas
const activationAreas = [
  "감정 조절 영역", // 수정된 부분
  "창의력 폭발 영역",
  "집중력 최대화 영역",
  "기억력 향상 영역",
  "문제 해결 영역",
  "언어 처리 영역"
];

function BrainVisual({ progress }) {
  const [activationArea, setActivationArea] = useState("");
  const [showAreaSelector, setShowAreaSelector] = useState(false);
  const audioRef = useRef(null);
  
  // Load selected area from localStorage or set random one
  useEffect(() => {
    const savedArea = localStorage.getItem('brainActivationArea');
    if (savedArea) {
      setActivationArea(savedArea);
    } else {
      // Set random activation area
      const randomArea = activationAreas[Math.floor(Math.random() * activationAreas.length)];
      setActivationArea(randomArea);
      localStorage.setItem('brainActivationArea', randomArea);
    }
  }, []);
  
  const getBrainImage = () => {
    if (progress >= 100) return '/assets/brain/brain_100.png';
    if (progress >= 75) return '/assets/brain/brain_75.png';
    if (progress >= 50) return '/assets/brain/brain_50.png';
    if (progress >= 25) return '/assets/brain/brain_25.png';
    return '/assets/brain/brain_0.png';
  };
  
  // Play sound when reaching 100%
  useEffect(() => {
    if (progress >= 100 && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, [progress]);
  
  const selectActivationArea = (area) => {
    setActivationArea(area);
    localStorage.setItem('brainActivationArea', area);
    setShowAreaSelector(false);
  };

  return (
    <div className="relative w-64 mx-auto">
      <audio ref={audioRef} src="/assets/audio/connect.mp3" />
      
      {/* Brain activation area text */}
      <div 
        className="text-center text-sm mb-2 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-primary"
        onClick={() => setShowAreaSelector(!showAreaSelector)}
      >
        오늘의 활성화 부위: {activationArea} ▼
      </div>
      
      {/* Area selector dropdown */}
      {showAreaSelector && (
        <div className="absolute top-6 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
          {activationAreas.map((area, index) => (
            <div 
              key={index}
              onClick={() => selectActivationArea(area)}
              className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                area === activationArea ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              {area}
            </div>
          ))}
        </div>
      )}
      
      {/* Brain image */}
      <img
        src={getBrainImage()}
        alt="Brain Progress"
        className={`w-full h-64 object-contain ${progress >= 75 && progress < 100 ? 'animate-pulse' : ''}`}
        onError={(e) => {
          e.target.src = '/assets/brain/brain_0.png';
        }}
      />
    </div>
  );
}

export default BrainVisual;