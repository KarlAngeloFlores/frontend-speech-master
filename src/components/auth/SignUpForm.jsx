import { CheckCircle2, Loader2, CircleX, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import authService from "../../services/auth.service";
import "../../styles/animations.css";

const SignUpForm = ({ setCurrentAuth, setEmail, setPassword, setToken }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <- new state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Regex for names (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]*$/;

    if (["first_name", "middle_name", "last_name"].includes(id)) {
      if (!nameRegex.test(value)) return; // block invalid input
    }

    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "confirm_password" || id === "password") {
      validatePasswords(
        id === "password" ? value : formData.password,
        id === "confirm_password" ? value : formData.confirm_password
      );
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { confirm_password, ...signUpData } = formData;
      const result = await authService.register(
        signUpData.email,
        signUpData.first_name, signUpData.last_name, signUpData.middle_name
      );
      setEmail(signUpData.email);
      setPassword(signUpData.password);
      setToken(result.token);

      setSuccess(true);
      setCurrentAuth('verify');

    } catch (error) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 shadow-2xl w-full max-w-md rounded-2xl transition-all duration-300 hover:shadow-lg modal-animation">
        {/* Logo/Header */}
        <div className="flex justify-center items-center mb-2">
          <span className='mr-1 font-bold text-2xl py-2 px-4 text-white from-blue-600 to-indigo-600 bg-gradient-to-r rounded-lg'>
            S
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-3xl">
            SpeechMaster
          </span>
        </div>
        {/* Welcome Text */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-600 text-sm">Sign up to get started</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="first_name">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="last_name">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="middle_name">
              Middle Name
            </label>
            <input
              type="text"
              id="middle_name"
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Middle Name (Optional)"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-10 text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1 relative">
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirm_password">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm_password"
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={20}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-3 top-10 text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {error && (
            <div className="flex items-center justify-center text-red-600 bg-red-50 p-2 rounded-lg text-sm">
              <CircleX className="mr-2 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>Account created successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || passwordError}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center text-sm mt-2">
            <span className="text-gray-600">Already have an account? </span>
            <a
              onClick={() => setCurrentAuth('signin')}
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors cursor-pointer"
            >
              Sign In
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpForm;
