import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget/ChatWidget';
import './App.scss';

function App() {
  const [isChatVisible, setIsChatVisible] = useState(false); // Состояние видимости чата

  const toggleChat = () => {
    setIsChatVisible((prev) => !prev); // Переключаем видимость чата
  };

  return (
    <div className="App">
      <h1>Chat Widget Example</h1>
      {/* Кнопка для открытия/закрытия чата */}
      <button className="chat-toggle-button" onClick={toggleChat}>
        {isChatVisible ? 'Скрыть чат' : 'Показать чат'}
      </button>
      {/* Виджет чата */}
      {isChatVisible && <ChatWidget onClose={() => setIsChatVisible(false)} />}
    </div>
  );
}

export default App;