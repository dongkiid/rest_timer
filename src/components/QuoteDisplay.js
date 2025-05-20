import React, { useState, useEffect } from 'react';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';

// 명언 목록
const quotes = [
  {
    text: "휴식은 게으름이 아니라 지혜입니다.",
    author: "존 러빈스"
  },
  {
    text: "휴식이 있는 삶은 음악에서 쉼표가 있는 것과 같다.",
    author: "루드비히 반 베토벤"
  },
  {
    text: "잠시 멈추어 숨을 고르는 것도 달리기의 한 부분이다.",
    author: "몰리 셔"
  },
  {
    text: "휴식 없는 삶은 무덤으로 가는 지름길이다.",
    author: "E. 조셉 코스만"
  },
  {
    text: "당신의 마음이 쉴 때, 당신은 가장 강해집니다.",
    author: "파울로 코엘료"
  },
  {
    text: "휴식은 새로운 시작을 위한 준비입니다.",
    author: "짐 론"
  },
  {
    text: "가끔은 아무것도 하지 않는 것이 무언가를 하는 것보다 생산적일 수 있다.",
    author: "달라이 라마"
  },
  {
    text: "휴식은 다음 산을 오르기 위한 에너지를 충전하는 시간이다.",
    author: "오프라 윈프리"
  }
];

function QuoteDisplay() {
  const [quote, setQuote] = useState(null);
  
  useEffect(() => {
    // 랜덤 명언 선택
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);
  
  if (!quote) return null;
  
  return (
    <div className="w-full"><GlobalHeader />
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">
          "{quote.text}"
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          - {quote.author}
        </p>
      </div>
	<GlobalFooter />
    </div>
  );
}

export default QuoteDisplay;