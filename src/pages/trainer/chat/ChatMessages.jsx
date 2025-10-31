import React, { useEffect, useRef } from 'react';

const ChatMessages = ({ loadingConvo, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col min-h-0'>
      {loadingConvo ? (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-3'></div>
            <p className='text-gray-500'>Loading conversation...</p>
          </div>
        </div>
      ) : messages && messages.length > 0 ? (
        <div className='space-y-4'>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'trainer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                  msg.sender === 'trainer'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className='text-sm break-words'>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === 'trainer' ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <p className='text-gray-500 font-medium'>No messages yet</p>
            <p className='text-gray-400 text-sm mt-1'>Start the conversation!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
