import React, { useState } from "react";
import { Loader2, CheckCircle2, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/animations.css";

const ForgotForm = ({ onSubmit, loading: parentLoading }) => {

    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const isLoading = parentLoading ?? loading;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "password" || id === "confirmPassword") {
      const pw = id === "password" ? value : formData.password;
      const cpw = id === "confirmPassword" ? value : formData.confirmPassword;
      if (cpw && pw !== cpw) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (onSubmit) {
        await onSubmit(formData.password, formData.confirmPassword);
      }
      setSuccess("Password has been updated successfully!");
      setFormData({ password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate('/auth');
      }, 2000);

    } catch (err) {
      setError(
          err?.message ||
          "An error occurred updating the password"
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
          <span className="mr-1 font-bold text-2xl py-2 px-4 text-white bg-blue-600 rounded-lg">
            S
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-3xl">
            SpeechMaster
          </span>
        </div>
        {/* Title/Instructions */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm">
            Please enter your new password and confirm it.
          </p>
        </div>
        {/* Form */}
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={64}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Repeat new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={64}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          {error && (
            <div className="flex items-center justify-center text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <CircleX className="mr-2 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>{success}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || passwordError}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotForm;