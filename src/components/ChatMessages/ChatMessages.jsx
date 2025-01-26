import React from 'react';
import './ChatMessages.scss';

const ChatMessages = ({ messages }) => {
  const messagesEndRef = React.useRef(null);

  // Прокрутка к последнему сообщению
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-messages__message ${message.isUser ? 'chat-messages__message--user' : 'chat-messages__message--other'}`}
        >
          {message.text}
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* Референс для прокрутки */}
    </div>
  );
};

export default ChatMessages;