import React from "react";
import { Ghost, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 shadow-2xl rounded-2xl max-w-md w-full flex flex-col items-center">
        <Ghost className="w-20 h-20 text-blue-400 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">404</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>
    </section>
  );
};

export default NotFoundPage;