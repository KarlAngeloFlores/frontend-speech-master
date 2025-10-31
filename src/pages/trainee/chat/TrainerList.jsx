import React from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';

const TrainerList = ({ trainers, loading, selectedTrainer, onSelectTrainer, mobileOpen, setMobileOpen, onBackClick }) => {
    return (
        <div className={`w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden ${
            mobileOpen ? 'absolute left-0 top-0 h-full z-50' : 'hidden sm:flex'
        }`}>
            {/* Header with Back Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    {/* <button
                        onClick={() => {
                            setMobileOpen(false);
                            onBackClick?.();
                        }}
                        className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} />
                    </button> */}
                    <h2 className="text-lg font-semibold text-gray-800">Your Trainers</h2>
                </div>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Trainers List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <LoadingScreen />
                ) : trainers && trainers.length > 0 ? (
                    <div className="space-y-1 p-2">
                        {trainers.map((trainer) => (
                            <div
                                key={trainer.id}
                                onClick={() => {
                                    onSelectTrainer(`${trainer.first_name} ${trainer.last_name}` || trainer.email, trainer);
                                    setMobileOpen(false);
                                }}
                                className={`p-3 cursor-pointer rounded-lg transition ${
                                    selectedTrainer === (`${trainer.first_name} ${trainer.last_name}` || trainer.email)
                                        ? 'bg-green-100 border-l-4 border-green-700'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {/* Avatar */}
                                    <div className="min-w-10 min-h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                                        {(trainer.first_name || trainer.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{trainer.first_name || trainer.email}</p>
                                        <p className="text-sm text-gray-500">{trainer.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No trainers available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerList;
