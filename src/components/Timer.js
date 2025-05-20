import React, { useState, useEffect, useRef } from 'react';
import BrainVisual from './BrainVisual';
import RestMode from './RestMode';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';

function Timer() {
  const DEFAULT_SETTINGS = {
    workTime: 50,
    restTime: 10,
    neuralMode: true,
    theme: 'light'
  };

  const getSettings = () => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  };

  const initialSettings = getSettings();
  const [settings, setSettings] = useState(initialSettings);
  const [neuronEnabled, setNeuronEnabled] = useState(initialSettings.neuralMode);
  const [showSettings, setShowSettings] = useState(false);
  const [tempWorkTime, setTempWorkTime] = useState(initialSettings.workTime);
  const [tempRestTime, setTempRestTime] = useState(initialSettings.restTime);
  const workTimeSeconds = settings.workTime * 60;
  const restTimeSeconds = settings.restTime * 60;

  const [time, setTime] = useState(workTimeSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorking, setIsWorking] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completionMessage, setCompletionMessage] = useState('');
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showRestMode, setShowRestMode] = useState(false);
  const [neuronCount, setNeuronCount] = useState(() => parseInt(localStorage.getItem('neuronCount')) || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isWorking) {
      const total = workTimeSeconds;
      const elapsed = total - time;
      const newProgress = (elapsed / total) * 100;
      setProgress(Math.min(Math.max(newProgress, 0), 100));
    }
  }, [time, workTimeSeconds, isWorking]);

  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time <= 0 && isWorking) {
      completeWork();
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isWorking]);

  const completeWork = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play error:", e));
    }
    const newNeuronCount = neuronCount + 1;
    setNeuronCount(newNeuronCount);
    localStorage.setItem('neuronCount', newNeuronCount);
    const messages = [
      "당신의 전두엽이 활짝 열렸어요!",
      "지금 완전 두뇌 풀가동!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCompletionMessage(randomMessage);
    setTimeout(() => {
      setShowRestMode(true);
      setCompletionMessage('');
    }, 3000);
  };

  const handleRestComplete = () => {
    setShowRestMode(false);
    setIsWorking(true);
    setTime(workTimeSeconds);
    setProgress(0);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setShowPauseConfirm(false);
  };

  const pauseTimer = () => {
    setShowPauseConfirm(true);
  };

  const confirmPause = () => {
    setIsRunning(false);
    setShowPauseConfirm(false);
  };

  const cancelPause = () => {
    setShowPauseConfirm(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(workTimeSeconds);
    setProgress(0);
    setCompletionMessage('');
    setShowPauseConfirm(false);
  };

  const toggleNeuron = () => {
    const newState = !neuronEnabled;
    setNeuronEnabled(newState);
    const newSettings = { ...settings, neuralMode: newState };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const openSettings = () => {
    setTempWorkTime(settings.workTime);
    setTempRestTime(settings.restTime);
    setShowSettings(true);
  };

  const saveSettings = () => {
    const workMin = Math.min(Math.max(parseInt(tempWorkTime) || 25, 1), 120);
    const restMin = Math.min(Math.max(parseInt(tempRestTime) || 5, 1), 60);
    const newSettings = { ...settings, workTime: workMin, restTime: restMin };
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
    setShowSettings(false);
    setTime(workMin * 60);
    setProgress(0);
    setIsRunning(false);
  };

  if (showRestMode) {
    return <RestMode onRestComplete={handleRestComplete} restTimeMinutes={settings.restTime} />;
  }

  const dynamicColor = `hsl(${Math.max(120 - (progress * 120) / 100, 0)}, 70%, 50%)`;
  const size = 256;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />
      
      {/* 모달: 일시정지 확인 */}
      {showPauseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">
              조금만 더 집중하면 휴식시간에 도달할 수 있어요!
            </h3>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={confirmPause}
                className="flex-1 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                그래도 잠깐 정지하기
              </button>
              <button
                onClick={cancelPause}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                계속 집중하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 설정 변경 */}
      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity duration-500">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">설정 변경</h2>
            <div className="mb-4">
              <label className="block mb-1">작업 시간 (분):</label>
              <input
                type="number"
                value={tempWorkTime}
                onChange={(e) => setTempWorkTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">휴식 시간 (분):</label>
              <input
                type="number"
                value={tempRestTime}
                onChange={(e) => setTempRestTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSettings(false)}
                className="btn bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                취소
              </button>
              <button onClick={saveSettings} className="btn btn-primary">
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 완료 메시지 */}
      {completionMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">{completionMessage}</h2>
            <div className="animate-bounce text-4xl">🎉</div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 영역: 타이머 및 뉴런 기능 */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* 타이머 영역 */}
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mb-4">집중 시간</h1>
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                집중: {settings.workTime}분 / 휴식: {settings.restTime}분
              </span>
              <button onClick={openSettings} className="btn btn-primary">
                설정 변경
              </button>
            </div>
            <div className="relative w-64 h-64">
              <svg width={size} height={size} className="transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={dynamicColor}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease, stroke 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                {formatTime(time)}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              {!isRunning ? (
                <button onClick={startTimer} className="btn btn-green">
                  시작
                </button>
              ) : (
                <button onClick={pauseTimer} className="btn btn-yellow">
                  일시정지
                </button>
              )}
              <button onClick={resetTimer} className="btn btn-red">
                리셋
              </button>
            </div>
          </div>

          {/* 뉴런 활성화 영역 */}
          <div className="flex flex-col items-center w-64">
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-3xl font-bold">뉴런 활성화</h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={neuronEnabled}
                  onChange={toggleNeuron}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-primary"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
            {neuronEnabled && (
              <div className="w-full">
                <BrainVisual progress={progress} />
              </div>
            )}
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
}

export default Timer;