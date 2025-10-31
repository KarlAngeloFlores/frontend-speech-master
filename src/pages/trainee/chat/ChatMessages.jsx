import React, { useEffect, useRef } from 'react';

const ChatMessages = ({ messages, loading }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        <p className="mt-4 text-gray-500">Loading conversation...</p>
                    </div>
                </div>
            ) : messages && messages.length > 0 ? (
                <>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'trainee' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                    msg.sender === 'trainee'
                                        ? 'bg-green-500 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'trainee' ? 'text-green-100' : 'text-gray-500'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
            )}
        </div>
    );
};

export default ChatMessages;
