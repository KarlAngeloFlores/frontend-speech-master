import { useState, useEffect, useRef } from "react";
import quizTraineeService from "../../services/quizTrainee.service";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import LoadingScreen from "../../components/LoadingScreen";
import {
  BanIcon,
  ArrowRight,
  Mic,
  Trophy,
  Home,
  Star,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import QuizTaken from "../../components/trainee/QuizTaken";
import SweetAlert from "../../components/util/SweetAlert";

const PronounceItFastPage = () => {

  const { quiz_id } = useParams();
  const navigate = useNavigate();

  /**
   * @MIC_PERMISSION 
   * */
  const [micPermission, setMicPermission] = useState("prompt"); // 'granted', 'denied', 'prompt'
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" })
        .then((status) => {
          setMicPermission(status.state);

          // Listen for changes in permission
          status.onchange = () => {
            setMicPermission(status.state);
          };
        })
        .catch((err) => console.error(err));
    }
  }, []);

    //page config
  const [isLoading, setIsLoading] = useState(false);
  const [errorPage, setErrorPage] = useState(null);
  const [attemptStatus, setAttemptStatus] = useState(null);

    //quiz data
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [quizInfo, setQuizInfo] = useState([]);
  const [words, setWords] = useState([]);

    const [score, setScore] = useState(0); //score to quiz
      //timestamps
  const [startedAt, setStartedAt] = useState(null); //started at
    //quiz!!!!
  const [quizStatus, setQuizStatus] = useState("notStarted");
  const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
  const [recognizedWord, setRecognizedWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("");

    const [isListening, setIsListening] = useState(false);

      const isLastIndex = currentIndex === words.length - 1;

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [nextButton, setNextButton] = useState(false);
  const [skipButton, setSkipButton] = useState(true);

  /**
   * @FETCH_QUIZ_DATA from backend api
   */

  const handleFetchQuiz = async () => {
    setIsLoading(true);
    try {

        const response = await quizTraineeService.getQuiz(quiz_id);
        console.log(response);

        setAttemptStatus(response.status);

        if(response?.status === 'pending') {
            setQuizStatus('completed')
            setScore(response.score)
        } else if (response?.status === 'completed') {
            setAttemptStatus('completed')
        }
        
        setQuizInfo(response.quiz_info);
        setWords(response.words);
        
    } catch (error) {
        setErrorPage(error.message || "An error occured. Try again later");
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    if(quiz_id) {
        handleFetchQuiz();
    }
  }, [quiz_id]);

  /**
   * 
   * 
   * @QUIZ_LOGIC
   * 
   * 
   */

    useEffect(() => {
        if(quizInfo) {
            setTimerSeconds(quizInfo.timer_seconds);
        }
    }, [quizInfo])

    useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[currentIndex].question_word);
      setCurrentDifficulty(words[currentIndex].difficulty);
    }
  }, [words, currentIndex]); //if there are changes on index, current word will be changed too

  useEffect(() => {
    if (currentIndex < words.length - 1) {
      setSkipButton(true);
    } else if (currentIndex === words.length - 1) {
      setSkipButton(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === words.length - 1 && recognizedWord === currentWord) {
      setIsSubmitDisabled(false);
    }
  }, [currentIndex, recognizedWord, currentWord]);

  const handleStartQuiz = () => {
    const startedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    console.log("Quiz Started at:", startedAt);
    setStartedAt(startedAt); //datetime in mysql
    setQuizStatus("inProgress");
  };

  const hasSubmittedRef = useRef(false);

  const handleAnswerQuiz = async () => {
    try {
      setQuizStatus("submitting");

    setTimeout(() => {
        setQuizStatus("completed");
      }, 2000);
      

      const completedAt = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const takenAt = new Date().toISOString().slice(0, 19).replace("T", " ");

      console.log("Quiz Completed at:", completedAt);

      const result = await quizTraineeService.answerQuiz(
        quiz_id,
        score,
        takenAt,
        startedAt,
        completedAt
      );
      console.log(result);

      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
        
        const response = await quizTraineeService.submitQuiz(quiz_id);
        console.log(response);

        setTimeout(() => {
        SweetAlert.showSuccess(
          "Quiz Submitted",
          "Quiz Submitted Successfully",
          () => navigate("/trainee/quizzes")
        );
      }, 2000);

    } catch (error) {
        console.log(error);
        SweetAlert.showError(error.message || "Something went wrong. Try again later");
    }
  }

  // skip current word
  const handleSkipWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setRecognizedWord("");
      setNextButton(false);
    } else {
      setSkipButton(false);
    }
  };

  const proceedNextWord = async () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setRecognizedWord("");
      setNextButton(false);
    }
  };

  const startRecognition = () => {
    if (micPermission === "denied") {
      alert(
        "Microphone access denied. Please enable it in your browser settings."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript
        .toLowerCase()
        .trim()
        .replace(/[^a-z\s]/g, "");

      setRecognizedWord(spoken);

      if (spoken === currentWord.toLowerCase()) {
        setIsListening(false);
        setScore((prev) => prev + 1);
        setNextButton(true); //enabled when proceeding
        setSkipButton(false); //disabled when proceeding
      }

      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      if (event.error === "not-allowed") {
        alert(
          "Microphone access blocked. Please allow microphone use in your browser."
        );
      }
      setIsListening(false);
    };
  };

useEffect(() => {
  let interval;
  if (quizStatus === "inProgress" && timerSeconds > 0) {
    interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (!hasSubmittedRef.current) {
            hasSubmittedRef.current = true; // instantly lock

            // First: save answers (pending)
            handleAnswerQuiz();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [quizStatus, timerSeconds]);

  
  if(attemptStatus === "completed") return <QuizTaken />
  if(isLoading) return <LoadingScreen message={"Loading Quiz...."}/>
  if(errorPage) return <ErrorPage />
return (
  <>
    <div className="w-full min-h-screen bg-slate-50 flex flex-col gap-4 justify-center px-4 py-8">
      {quizStatus === "notStarted" && (
        <div className="p-8 max-w-3xl w-full mx-auto rounded-xl shadow-lg bg-white border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mic className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Pronounce It Fast
            </h1>
            <p className="text-slate-600">
              Test your pronunciation skills one word at a time
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Before You Start
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold">Test your microphone</span> - Ensure it's working properly before starting
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold">Find a quiet environment</span> - Background noise may affect recognition
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold">Use headphones</span> - Optional but recommended for clearer audio
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold">Stable internet connection</span> - Required for speech recognition
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold">Stay focused</span> - Avoid switching tabs or apps during the quiz
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold">Get comfortable</span> - Sit in a comfortable position and relax
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Quiz Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Words</p>
                <p className="text-2xl font-bold text-blue-600">{words.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Time Limit</p>
                <p className="text-2xl font-bold text-blue-600">{timerSeconds}s</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => handleStartQuiz()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-md transition-all duration-200 hover:shadow-lg inline-flex items-center gap-2"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {quizStatus === "inProgress" && (
        <>
          <div className="p-6 max-w-3xl w-full mx-auto rounded-xl shadow-lg bg-white border border-slate-200">
            {/* Progress Header */}
            <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-sm text-slate-600 font-medium">Progress</p>
                <p className="text-xl font-bold text-slate-800">
                  Word {currentIndex + 1} of {words.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 font-medium">Time Remaining</p>
                <p className="text-xl font-bold text-blue-600">{timerSeconds}s</p>
              </div>
            </div>

            {/* Word Display */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-lg text-slate-700">Pronounce this word:</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    currentDifficulty === "Easy"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : currentDifficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {currentDifficulty}
                </span>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-6">
                <p className="text-4xl font-bold text-blue-600">{currentWord}</p>
              </div>

              {/* Microphone Button */}
              <button
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto text-lg font-semibold shadow-md"
                onClick={startRecognition}
                disabled={isListening}
              >
                <Mic size={24} className={isListening ? "animate-bounce" : ""} />
                {isListening ? "Listening..." : "Start Speaking"}
              </button>
            </div>

            {/* Recognition Result */}
            {recognizedWord && (
              <div className="mb-6">
                <div className={`p-4 rounded-lg border-2 ${
                  recognizedWord === currentWord.toLowerCase()
                    ? "bg-green-50 border-green-300"
                    : "bg-yellow-50 border-yellow-300"
                }`}>
                  <p className="text-center text-lg">
                    <span className="text-slate-600">You said: </span>
                    <span className="font-bold text-slate-800">{recognizedWord}</span>
                  </p>
                  {recognizedWord === currentWord.toLowerCase() && (
                    <p className="text-center text-green-600 font-semibold mt-2">
                      Correct! ✓
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSkipWord()}
                disabled={!skipButton}
                className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {!skipButton && <BanIcon size={16} />}
                Skip Word
              </button>

              <div>
                {isSubmitDisabled && (
                  <button
                    disabled={currentWord.toLowerCase() !== recognizedWord}
                    onClick={() => proceedNextWord()}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {currentWord.toLowerCase() !== recognizedWord ? (
                      <>
                        <BanIcon size={20} />
                        Next Word
                      </>
                    ) : (
                      <>
                        Next Word
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                )}

                {!isSubmitDisabled && (
                  <button
                    onClick={() => handleAnswerQuiz()}
                    className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-md"
                  >
                    Finish Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {quizStatus === "submitting" && (
        <>
          <div className="p-12 max-w-md w-full mx-auto text-center rounded-xl shadow-lg bg-white border border-slate-200">
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Saving Your Scores
            </h2>

            <p className="text-slate-600 mb-6">
              Please wait while we save your results...
            </p>

            <div className="flex justify-center gap-2">
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        </>
      )}

      {quizStatus === "completed" && (
        <>
          <div className="p-8 max-w-md w-full mx-auto text-center rounded-xl shadow-lg bg-white border border-slate-200">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-blue-600" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Quiz Completed!
            </h2>

            <p className="text-slate-600 mb-8">Excellent work! Here are your results</p>

            <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-1">Your Score</p>
                <p className="text-4xl font-bold text-blue-600">
                  {score} / {words.length}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Accuracy Rate</p>
                <p className="text-2xl font-semibold text-green-600">
                  {Math.round((score / words.length) * 100)}%
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: i * 0.3,
                  }}
                >
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmitQuiz()}
              className="w-full px-6 py-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-semibold text-lg"
            >
              Submit Quiz
            </motion.button>
          </div>
        </>
      )}
    </div>
  </>
);
};

export default PronounceItFastPage;
