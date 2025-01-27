import React, { useState, useEffect, useRef } from 'react';
import ChatMessages from '../ChatMessages/ChatMessages'; // Импортируем компонент ChatMessages
import './ChatWidget.scss';

const ChatWidget = ({ onClose }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 20 });
  const [size, setSize] = useState({ width: 300, height: 400 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState({ active: false, corner: null });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.userSelect = 'none';
  };

  const handleResizeMouseDown = (e, corner) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал handleMouseDown
    setResizing({ active: true, corner });
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
    } else if (resizing.active) {
      // Изменение размера виджета
      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      const minWidth = 300;
      const minHeight = 400;

      switch (resizing.corner) {
        case 'bottom-right':
          newWidth = e.clientX - position.x;
          newHeight = e.clientY - position.y;
          break;
        case 'bottom-left':
          newWidth = position.x + size.width - e.clientX;
          newHeight = e.clientY - position.y;
          newX = e.clientX;
          break;
        case 'top-right':
          newWidth = e.clientX - position.x;
          newHeight = position.y + size.height - e.clientY;
          newY = e.clientY;
          break;
        case 'top-left':
          newWidth = position.x + size.width - e.clientX;
          newHeight = position.y + size.height - e.clientY;
          newX = e.clientX;
          newY = e.clientY;
          break;
        case 'left':
          newWidth = position.x + size.width - e.clientX;
          newX = e.clientX;
          break;
        case 'right':
          newWidth = e.clientX - position.x;
          break;
        case 'top':
          newHeight = position.y + size.height - e.clientY;
          newY = e.clientY;
          break;
        case 'bottom':
          newHeight = e.clientY - position.y;
          break;
        default:
          break;
      }

      // Ограничиваем размеры
      if (newWidth < minWidth) {
        newWidth = minWidth;
        if (resizing.corner === 'bottom-left' || resizing.corner === 'top-left' || resizing.corner === 'left' || resizing.corner === 'right') {
          newX = position.x + size.width - minWidth;
        }
      }
      if (newHeight < minHeight) {
        newHeight = minHeight;
        if (resizing.corner === 'top-right' || resizing.corner === 'top-left' || resizing.corner === 'top' || resizing.corner === 'bottom') {
          newY = position.y + size.height - minHeight;
        }
      }

      // Ограничиваем максимальные размеры (по размеру окна)
      if (newWidth > window.innerWidth - newX) newWidth = window.innerWidth - newX;
      if (newHeight > window.innerHeight - newY) newHeight = window.innerHeight - newY;

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing({ active: false, corner: null });
    document.body.style.userSelect = 'auto';
  };

  // Привязываем обработчики событий к document
  useEffect(() => {
    if (dragging || resizing.active) {
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
          <button onClick={onClose}>×</button>
        </div>
      </div>
      <ChatMessages messages={[]} /> {/* Используем компонент ChatMessages */}
      <div className="chat-widget__footer">
        <textarea placeholder="Введите сообщение..." />
        <button>Отправить</button>
      </div>

      {/* Ресайзеры для изменения размера */}
      <div
        className="chat-widget__resizer chat-widget__resizer--bottom-right"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
      />
      <div
        className="chat-widget__resizer chat-widget__resizer--bottom-left"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
      />
      <div
        className="chat-widget__resizer chat-widget__resizer--top-right"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
      />
      <div
        className="chat-widget__resizer chat-widget__resizer--top-left"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
      />
      <div
        className="chat-widget__resize chat-widget__resize--left"
        onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
      />
      <div
        className="chat-widget__resize chat-widget__resize--right"
        onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
      />
      <div
        className="chat-widget__resize chat-widget__resize--bottom"
        onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
      />
      <div
        className="chat-widget__resize chat-widget__resize--top"
        onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
      />
    </div>
  );
};

export default ChatWidget;