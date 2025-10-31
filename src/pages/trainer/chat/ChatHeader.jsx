import React from 'react';
import { Phone, Video, Info } from 'lucide-react';

const ChatHeader = ({ selectedTrainee }) => {
    return (
        <div className="border-b border-gray-200 p-4 bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Trainee Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-lg">
                        {selectedTrainee?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{selectedTrainee}</h3>
                        <p className="text-xs text-green-600">Online</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">

                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
