import React, { useState } from "react";
import { Loader2, CheckCircle2, CircleX } from "lucide-react";
import "../../styles/animations.css";

const EmailForm = ({ onSend, loading: parentLoading }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // local loading if parent doesn't supply
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const isLoading = parentLoading ?? loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // If a callback is provided, use it. Otherwise, just simulate success.
      if (onSend) {
        await onSend(email);
      }
      setSuccess("Verification code sent to your email!");
    } catch (error) {
      setError(
          error?.message || "An error occurred sending the verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 shadow-2xl w-full max-w-md rounded-2xl transition-all duration-300 hover:shadow-lg modal-animation">
        {/* Logo/Header */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="mr-1 font-bold text-2xl py-2 px-4 text-white from-blue-600 to-indigo-600 bg-gradient-to-r rounded-lg">
            S
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-3xl">
            SpeechMaster
          </span>
        </div>
        {/* Instructions */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Verification Code</h2>
          <p className="text-gray-600 text-sm">
            Enter your email address to receive a verification code.
          </p>
        </div>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="flex items-center justify-center text-red-600 bg-red-50 p-3 rounded-lg">
              <CircleX className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>{success}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Send Code"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EmailForm;