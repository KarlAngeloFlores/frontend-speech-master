import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';

const ChatArea = ({ selectedTrainee, selectedTraineeData, loadingConvo, messages, onSendMessage, onBackClick }) => {
  return (
    <div className='flex-1 flex flex-col bg-white overflow-hidden'>
      <ChatHeader selectedTrainee={selectedTrainee} selectedTraineeData={selectedTraineeData} onBackClick={onBackClick} />
      <ChatMessages loadingConvo={loadingConvo} messages={messages} />
      <MessageInput selectedTrainee={selectedTrainee} onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;
