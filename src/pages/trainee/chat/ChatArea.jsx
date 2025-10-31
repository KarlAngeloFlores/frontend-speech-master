import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';

const ChatArea = ({ selectedTrainer, loadingConvo, messages, onSendMessage, onBackClick }) => {
    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <ChatHeader selectedTrainer={selectedTrainer} onBackClick={onBackClick} />
            <ChatMessages messages={messages} loading={loadingConvo} />
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default ChatArea;
