import { ArrowRight, Check, Mic, WholeWord } from 'lucide-react'
// import NavHeader from '../components/NavHeader'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Check className="w-6 h-6 text-white" />,
      title: "Practice Exercises",
      description: "Practice your pronunciation through activities.",
    },
    {
      icon: <Mic className="w-6 h-6 text-white" />,
      title: "Practice Reading Skills and Pronunciation",
      description: "Improve your reading skills and pronunciation through AI practice.",
    },
    {
      icon: <WholeWord className="w-6 h-6 text-white" />,
      title: "Enhance Vocabulary",
      description: "Search, learn, and listen to words to enhance your vocabulary.",
    }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Navigation */}
      {/* <NavHeader /> */}

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className='mr-1 font-bold text-2xl py-2 px-4 text-white from-blue-600 to-indigo-600 bg-gradient-to-r rounded-lg'>
              S
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-bold text-4xl md:text-5xl">
              SpeechMaster
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Practice Speech<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice your vocabulary, pronunciation, and reading skills while having fun improving your English
            skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/auth')}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center shadow-md"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything you need to <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                practice your skills
              </span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Enhance your skills with different features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-all hover:scale-105 shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
  <div className="max-w-4xl mx-auto text-center">
    <h3 className="text-3xl font-bold mb-4">Ready to start improving your English?</h3>
    <p className="mb-8 text-lg">Sign up now and join the learners on SpeechMaster!</p>
    <button
      onClick={() => navigate('/auth')}
      className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg shadow-md hover:bg-blue-100 transition"
    >
      Join Now
    </button>
  </div>
</section>

<section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-4xl mx-auto">
    <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h3>
    <div className="space-y-6">
      {/* <div>
        <h4 className="font-semibold text-blue-700">Is SpeechMaster free?</h4>
        <p className="text-gray-700">Yes! You can get started for free. Premium features may be added in the future.</p>
      </div> */}
      <div>
        <h4 className="font-semibold text-blue-700">Do I need a microphone?</h4>
        <p className="text-gray-700">A microphone is recommended for pronunciation practice, but other features work without one.</p>
      </div>
      {/* Add more questions as needed */}
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-blue-200 pt-6 text-center text-gray-600">
            <p>&copy; 2025 SpeechMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;