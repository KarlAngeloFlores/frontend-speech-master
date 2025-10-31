import React from 'react';
import { Menu, X } from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';

const TraineeList = ({ trainees, loading, selectedTrainee, onSelectTrainee, mobileOpen, setMobileOpen }) => {
  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden ${
        mobileOpen ? 'absolute left-0 top-0 h-full z-50' : 'hidden sm:flex'
    }`}>
      {/* Header with Menu Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Your Trainees</h2>
        <button
            onClick={() => setMobileOpen(false)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
            <X size={20} />
        </button>
      </div>

      {/* Trainees List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <LoadingScreen />
        ) : trainees && trainees.length > 0 ? (
            <div className="space-y-1 p-2">
              {trainees.map((trainee) => (
                  <div
                      key={trainee.id}
                      onClick={() => {
                          onSelectTrainee(`${trainee.first_name} ${trainee.last_name}`, trainee);
                          setMobileOpen(false);
                      }}
                      className={`p-3 cursor-pointer rounded-lg transition ${
                          selectedTrainee === `${trainee.first_name} ${trainee.last_name}`
                              ? 'bg-green-100 border-l-4 border-green-700'
                              : 'hover:bg-gray-50'
                      }`}
                  >
                      <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                              {trainee.first_name?.charAt(0).toUpperCase()}{trainee.last_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                              <p className="font-medium text-gray-800">{trainee.first_name} {trainee.last_name}</p>
                              <p className="text-sm text-gray-500">{trainee.email}</p>
                          </div>
                      </div>
                  </div>
              ))}
            </div>
        ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No trainees available</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TraineeList;
