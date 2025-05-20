import React, { useState, useEffect } from 'react';
import QuoteDisplay from './QuoteDisplay';
import GlobalHeader from './GlobalHeader';

function RestMode({ onRestComplete, restTimeMinutes }) {
  const [timeLeft, setTimeLeft] = useState(restTimeMinutes * 60);
  const [restMessage, setRestMessage] = useState("");

  // 휴식 메시지 설정
  useEffect(() => {
    const restMessages = [
      "시냅스 안정 중...💤",
      "뉴런 재정렬 중입니다 🤖"
    ];
    setRestMessage(restMessages[Math.floor(Math.random() * restMessages.length)]);
  }, []);

	
  // 타이머 자동 실행
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 시간이 0이 되면 자동으로 집중 모드로 돌아가기
  useEffect(() => {
    if (timeLeft === 0) {
      onRestComplete();
    }
  }, [timeLeft, onRestComplete]);

  // 시간 포맷 함수 (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <GlobalHeader />
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-3xl font-bold text-center mb-6">휴식 시간</h1>
          
          {/* 휴식 메시지 */}
          <div className="text-xl text-blue-600 dark:text-blue-400 mb-6">
            {restMessage}
          </div>
          
          {/* 남은 시간 표시 */}
          <div className="text-4xl font-bold mb-8">
            {formatTime(timeLeft)}
          </div>
          
          {/* 명언 표시 */}
          <div className="mb-10 w-full max-w-lg">
            <QuoteDisplay />
          </div>
          
          {/* 집중 모드로 돌아가기 버튼 */}
          <button
            onClick={onRestComplete}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 text-lg"
          >
            집중 모드에 다시 돌입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestMode;