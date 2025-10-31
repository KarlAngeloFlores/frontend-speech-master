import React from "react";
import { Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

const PendingPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      console.log(result);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Account Approval Pending
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Your account is currently under review and needs to be approved by a
          trainer.
        </p>

        {/* Status Steps */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Account created successfully</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-4 h-4 border-2 border-green-600 rounded-full mr-3 flex-shrink-0 animate-pulse"></div>
            <span className="text-green-700">Waiting for trainer approval</span>
          </div>
        </div>

        {/* Refresh Button (optional) */}
        {/* <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Refresh Status
        </button> */}

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingPage;