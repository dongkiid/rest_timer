import React from 'react';

function GlobalFooter() {
  return (
    <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
      RESTIMER가 지금까지 뉴런 {localStorage.getItem('neuronCount') || 0}개 연결을 도와줬습니다.
    </footer>
  );
}

export default GlobalFooter;