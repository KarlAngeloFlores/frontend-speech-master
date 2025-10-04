import { useState } from 'react';
import { CheckCircle2, Loader2, CircleX } from 'lucide-react';
import authService from "../../services/auth.service";
import { useNavigate } from 'react-router-dom';
import "../../styles/animations.css";

const VerificationForm = ({ type, handleVerification, email }) => {
  const navigate = useNavigate();

  const purpose = {
    verify_account: {
      title: "Verify your account",
      button_text: "Verify",
      purpose: "account_verification",
    },
    change_password: {
      title: "Change password code",
      button_text: "Confirm",
      purpose: "password_reset",
    },
  };

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCodeChange = (e) => {
    setError("");
    const numericValue = e.target.value.replace(/\D/g, ""); 
    setCode(numericValue);
  }

  /**
   * @RESENDING_THE_CODE
   */
  const handleResend = async () => {
    setResending(true);
    setError(null);
    setSuccess(null);
    console.log(email);
    try {
      await authService.resendVerification(email, purpose[type].purpose);
      setSuccess("Verification code resent successfully");
    } catch (error) {
      setError(error.message || 'An error occurred while resending the verification code');
    } finally {
      setResending(false);
    }
  };

  /**
   * @SUBMITTING_THE_CODE
   */
    const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await handleVerification(code);
      console.log(result);
      setSuccess(result?.message || "Verification successful!");

      if (type === "verify_account") {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

    } catch (error) {
      setError(error.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    
<section className="min-h-screen w-full flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 shadow-2xl w-full max-w-md rounded-2xl transition-all duration-300 hover:shadow-lg modal-animation">
        {/* Logo/Header */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className='mr-1 font-bold text-2xl py-2 px-4 text-white bg-blue-600 rounded-lg'>
            S
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-3xl">
            SpeechMaster
          </span>
        </div>
        {/* Welcome Text */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{purpose[type].title}</h2>
          <p className="text-gray-600 text-sm">{purpose[type].description}</p>
        </div>
        {/* Form */}
        <form className="space-y-2" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center tracking-widest text-xl"
              placeholder="Enter code"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              minLength={6}
              required
            />
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
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Verify Email'
            )}
          </button>

          <div className="text-center text-sm mt-2">
            <span className="text-gray-600">Didn't receive a code? </span>
            <button
              type="button"
              disabled={resending}
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors disabled:opacity-50"
              onClick={handleResend}
            >
              {resending ? <Loader2 className="animate-spin h-4 w-4 inline-block" /> : "Resend"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-2">
            Check your spam folder if you don't see the email
          </p>
        </form>
      </div>
    </section>
  );
};

export default VerificationForm;