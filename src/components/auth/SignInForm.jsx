import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, CircleX } from 'lucide-react';
import { useState } from 'react';
import authService from "../../services/auth.service";
import "../../styles/animations.css";

const SignInForm = ({ setCurrentAuth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await authService.login(formData.email, formData.password);
      console.log(data);
      setSuccess(data?.message);

      if(data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      if (data?.role === 'trainer' && data?.status === 'verified') {
        navigate('/trainer/home');
      } else if (data?.role === 'trainee' && data?.status === 'verified') {
        navigate('/trainee/quizzes');
      } else {
        navigate('/trainee/pending');
      }
      
    } catch (error) {
      setError(error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">

        {/**modal */}
        <div className="bg-white p-8 shadow-2xl w-full max-w-md rounded-2xl transition-all duration-300 hover:shadow-lg modal-animation">
          {/* Logo/Header */}
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className='mr-1 font-bold text-2xl py-2 px-4 text-white from-blue-600 to-indigo-600 bg-gradient-to-r rounded-lg'>
              S
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-3xl">
              SpeechMaster
            </span>
          </div>
          {/* Welcome Text */}
          <div className="text-center mb-2">
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2> */}
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </div>
          {/* Form */}
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your password"
                value={formData.password}
                maxLength={100}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-right">
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>
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
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign In'
              )}
            </button>
            <div className="text-center text-sm mt-2">
              <span className="text-gray-600">Don't have an account? </span>
              <a
                onClick={() => setCurrentAuth('signup')}
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors cursor-pointer"
              >
                Sign Up
              </a>
            </div>
          </form>

      </div>
    </section>
  );
};

export default SignInForm;