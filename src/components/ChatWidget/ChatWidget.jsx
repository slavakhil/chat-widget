import React, { useState, useEffect } from 'react';
import ChatMessages from '../ChatMessages/ChatMessages'; // Импортируем новый компонент
import './ChatWidget.scss';

const ChatWidget = ({ onClose }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 20 }); // Начальная позиция (справа сверху)
  const [size, setSize] = useState({ width: 300, height: 400 }); // Начальные размеры
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]); // Сообщения
  const [inputValue, setInputValue] = useState(''); // Текст в поле ввода

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.userSelect = 'none';
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал handleMouseDown
    setResizing(true);
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      // Перемещение виджета
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      // Ограничиваем перемещение по горизонтали
      if (newX < 0) newX = 0;
      if (newX + size.width > window.innerWidth) newX = window.innerWidth - size.width;

      // Ограничиваем перемещение по вертикали
      if (newY < 0) newY = 0;
      if (newY + size.height > window.innerHeight) newY = window.innerHeight - size.height;

      setPosition({ x: newX, y: newY });
    } else if (resizing) {
      // Изменение размера виджета
      let newWidth = e.clientX - position.x;
      let newHeight = e.clientY - position.y;

      // Минимальные размеры
      const minWidth = 300;
      const minHeight = 400;

      // Ограничиваем размеры
      if (newWidth < minWidth) newWidth = minWidth;
      if (newHeight < minHeight) newHeight = minHeight;

      // Ограничиваем максимальные размеры (по размеру окна)
      if (newWidth > window.innerWidth - position.x) newWidth = window.innerWidth - position.x;
      if (newHeight > window.innerHeight - position.y) newHeight = window.innerHeight - position.y;

      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    document.body.style.userSelect = 'auto';
  };

  // Привязываем обработчики событий к document
  useEffect(() => {
    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing]);

  // Обработчики для кнопок
  const handleClear = () => {
    setMessages([]); // Очищаем сообщения
  };

  // Отправка сообщения
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(), // Уникальный ID для сообщения
        text: inputValue,
        isUser: true, // Сообщение от пользователя
      };
      setMessages((prev) => [...prev, newMessage]); // Добавляем сообщение
      setInputValue(''); // Очищаем поле ввода

      // Имитация ответа от другого пользователя
      setTimeout(() => {
        const responseMessage = {
          id: Date.now() + 1,
          text: 'Это ответ от другого пользователя!',
          isUser: false,
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 1000);
    }
  };

  return (
    <div
      className="chat-widget"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <div className="chat-widget__header">
        <div
          className="chat-widget__header-drag-area"
          onMouseDown={handleMouseDown}
        >
          Chat
        </div>
        <div className="chat-widget__header-actions">
          <button
            className="chat-widget__header-button"
            onClick={handleClear}
          >
            Очистить
          </button>
          <button
            className="chat-widget__header-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
      <ChatMessages messages={messages} /> {/* Используем новый компонент */}
      <div className="chat-widget__footer">
        <input
          type="text"
          className="chat-widget__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Введите сообщение..."
        />
        <button
          className="chat-widget__send-button"
          onClick={handleSendMessage}
        >
          Отпр
        </button>
      </div>
      <div
        className="chat-widget__resizer"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

export default ChatWidget;