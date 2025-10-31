import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
    const [messageText, setMessageText] = useState('');

    const handleSend = () => {
        if (messageText.trim()) {
            onSendMessage(messageText);
            setMessageText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex gap-3 items-end">

                <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows="3"
                    style={{ maxHeight: '120px' }}
                />

                <button
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="p-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-full transition"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
