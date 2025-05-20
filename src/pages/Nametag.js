import React, { useState, useEffect } from 'react';
import GlobalHeader from '../components/GlobalHeader';

// 기본 메시지 목록 (삭제 불가능한 항목)
const defaultMessages = [
  { text: "지금은 휴식 중이에요 😴" },
  { text: "10분 후 말 걸어주세요 ☕" },
  { text: "생각 정리 중이에요 🧠" }
];

function Nametag() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // localStorage에서 메시지 불러오기 (없거나 빈 배열이면 기본 메시지 사용)
  useEffect(() => {
    const savedMessages = localStorage.getItem('customMessages');
    let messageList = [];
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        messageList = Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultMessages;
      } catch (e) {
        messageList = defaultMessages;
      }
    } else {
      messageList = defaultMessages;
    }
    setMessages(messageList);

    // 이전에 선택한 메시지가 저장되어 있으면 사용, 없으면 첫번째 메시지 선택
    const savedSelected = localStorage.getItem('selectedNametag');
    if (savedSelected) {
      const found = messageList.find(msg => msg.text === savedSelected);
      setSelectedMessage(found ? found : messageList[0]);
    } else {
      setSelectedMessage(messageList[0]);
    }
  }, []);

  // messages 변경 시 localStorage에 저장
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('customMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // selectedMessage 변경 시 localStorage에 저장
  useEffect(() => {
    if (selectedMessage) {
      localStorage.setItem('selectedNametag', selectedMessage.text);
    }
  }, [selectedMessage]);

  // 전체화면 모드 토글 (브라우저 fullscreen API 사용)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`전체화면 활성화 오류: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // 새 메시지 추가 기능
  const addNewMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsgObj = { text: newMessage.trim() };
      const updatedMessages = [...messages, newMsgObj];
      setMessages(updatedMessages);
      setSelectedMessage(newMsgObj);
      setNewMessage("");
      setShowAddForm(false);
    }
  };

  // 메시지 삭제 (기본 메시지는 삭제 불가)
  const deleteMessage = (index) => {
    if (index < defaultMessages.length) return;
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
    if (selectedMessage.text === messages[index].text) {
      setSelectedMessage(updatedMessages[0]);
    }
  };

  // selectedMessage가 아직 null이면 Loading 표시
  if (!selectedMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-300">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isFullscreen ? 'bg-black' : 'bg-white dark:bg-gray-900'}`}>
      {!isFullscreen && <GlobalHeader />}
      
      {!isFullscreen && (
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            전체화면 보기
          </button>
        </div>
      )}
      
      <div className={`flex-grow flex items-center justify-center ${isFullscreen ? 'px-4' : 'p-8'}`}>
        <div className={`text-center ${isFullscreen ? 'w-full h-full flex flex-col items-center justify-center' : ''}`}>
          <h1 className={`${isFullscreen ? 'text-7xl' : 'text-5xl'} font-bold mb-8 ${isFullscreen ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {selectedMessage.text}
          </h1>
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="mt-8 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              전체화면 종료
            </button>
          )}
        </div>
      </div>
      
      {!isFullscreen && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">메시지 선택</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedMessage(message);
                  }}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer ${
                    selectedMessage.text === message.text 
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="pr-6 text-gray-900 dark:text-white">{message.text}</p>
                  {index >= defaultMessages.length && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(index);
                      }}
                      className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-red-500 text-xl"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {showAddForm ? (
              <div className="mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="새 메시지 입력..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-3"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addNewMessage}
                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    disabled={!newMessage.trim()}
                  >
                    추가하기
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMessage("");
                    }}
                    className="flex-1 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    취소하기
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAddForm(true);
                }}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                + 새 메시지 추가
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Nametag;