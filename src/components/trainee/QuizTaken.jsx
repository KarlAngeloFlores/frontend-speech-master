import React, { useState, useEffect } from 'react';
import { CheckCircle, RotateCcw, Home, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizTaken = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleGoHome = () => {
    navigate('/trainee/quizzes');
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>


      <div className={`text-center max-w-2xl mx-auto transition-all duration-1000 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Main Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Message */}
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Quiz Already Taken
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            You have already completed this quiz. Each quiz can only be taken once 
            to ensure fair evaluation and maintain the integrity of the results.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">Quiz Status</span>
          </div>
          <p className="text-blue-700 text-sm">
            Your quiz submission has been recorded and is being processed. 
            You can check your results in the dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleGoHome}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg min-w-[160px] cursor-pointer"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Corner indicator */}
      <div className="absolute top-6 right-6 text-blue-400 text-xs font-medium tracking-wider">
        COMPLETED
      </div>
    </div>
  );
};

export default QuizTaken;