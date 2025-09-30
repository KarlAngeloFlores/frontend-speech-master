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

  const [hasSubmitted, setHasSubmitted] = useState(false);
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
            setHasSubmitted(true);

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
  return (<>
   <div className="w-full h-screen bg-blue-50 flex flex-col gap-4 justify-center px-2 ">
        {quizStatus === "notStarted" && (
          <div className="p-8 max-w-2xl w-full mx-auto text-center rounded-xl shadow-md shadow-blue-300 space-y-4 my-4 bg-linear-0 from-blue-400 to-blue-600 slide-in-up">
            <h2 className="text-xl font-semibold text-white">
              📝 Quiz Preparation Checklist
            </h2>
            <ul className="text-left list-disc list-inside space-y-1 text-green-50 text-lg">
              <li>✅ Ensure your microphone is working properly.</li>
              <li>🔇 Find a quiet place free from background noise.</li>
              <li>🎧 Use headphones if possible for clearer audio.</li>
              <li>📶 Make sure you have a stable internet connection.</li>
              <li>
                📱 Avoid switching tabs or using other apps during the quiz.
              </li>
              <li>
                🧘 Sit comfortably and stay focused throughout the session.
              </li>
            </ul>
            <button
              onClick={() => handleStartQuiz()}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer font-semibold"
            >
              Start Quiz
            </button>
          </div>
        )}

        {quizStatus === "inProgress" && (
          <>
            <div className="p-8 max-w-2xl w-full mx-auto text-center rounded-xl shadow-md shadow-blue-300 space-y-4 my-4 bg-linear-0 from-blue-400 to-blue-600 slide-in-up">
              <div className="flex justify-between">
                <p className="font-bold text-white">
                  Word {currentIndex + 1} of {words.length}
                </p>
                <p className="font-bold text-white">
                  Time Left: {timerSeconds}
                </p>
              </div>

              <div className="flex justify-center items-center gap-2">
                <p className="text-xl  text-white">Say this word</p>
                <p
                  className={`font-semibold px-2 py-1 ${
                    currentDifficulty === "Easy"
                      ? "bg-green-500 text-white "
                      : currentDifficulty === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500 text-white"
                  }
  `}
                >
                  {currentDifficulty}
                </p>
              </div>
              <div className="text-3xl font-semibold text-white mb-4">
                {currentWord}
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer disabled:bg-gray-400 flex items-center text-center justify-center gap-2"
                  onClick={startRecognition}
                  disabled={isListening}
                >
                  <Mic size={20} className=" animate-bounce" />
                  {isListening ? "Listening..." : "Start Speaking"}
                </button>
              </div>

              {recognizedWord && (
                <>
                  <div>
                    <p className="mt-4 px-4 py-2 rounded-md bg-yellow-500 text-white text-xl">
                      You said:{" "}
                      <span className="font-bold">{recognizedWord}</span>
                    </p>
                    {/* <p className="text-lg mt-2">{result}</p> */}
                  </div>
                </>
              )}

              {/**buttons */}
              <div className="flex justify-between">
                <div>
                  <button
                    onClick={() => handleSkipWord()}
                    disabled={!skipButton}
                    className=" disabled:bg-red-600 disabled:cursor-not-allowed cursor-pointer mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex gap-2 items-center justify-center"
                  >
                    {!skipButton ? (
                      <BanIcon size={16} className="animate-pulse" />
                    ) : (
                      ""
                    )}{" "}
                    Skip word
                  </button>
                </div>

                <div>
                  {isSubmitDisabled && (
                    <>
                      <button
                        disabled={currentWord !== recognizedWord}
                        onClick={() => proceedNextWord()}
                        className=" disabled:bg-red-600 disabled:cursor-not-allowed cursor-pointer mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex gap-2 items-center justify-center"
                      >
                        {currentWord !== recognizedWord ? (
                          <>
                            <BanIcon size={20} className="animate-pulse" />
                            Next Word
                          </>
                        ) : (
                          <>
                            Next Word{" "}
                            <ArrowRight size={20} className=" animate-pulse" />{" "}
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {!isSubmitDisabled && (
                    <>
                      <button
                        onClick={() => handleSubmitQuiz()}
                        className="bg-green-600 mt-4 px-6 py-3 text-white font-semibold rounded-md"
                      >
                        Submit Quiz
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {quizStatus === "submitting" && (
          <>
            <div className="p-8 max-w-2xl w-full mx-auto text-center rounded-2xl shadow-lg shadow-blue-300 space-y-6 my-6 bg-gradient-to-br from-blue-400 to-blue-600">
              {/* Loader Icon */}
              <div className="flex justify-center">
                <Loader2 className="w-14 h-14 text-yellow-300 animate-spin" />
              </div>

              <h2 className="text-2xl font-semibold text-green-300">
                Saving Quiz Scores...
              </h2>

              <p className="text-white">
                Please wait while we save your scores
              </p>

              {/* Loading dots */}
              <div className="flex justify-center gap-2 mt-4">
                <span className="w-3 h-3 bg-yellow-200 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-3 h-3 bg-yellow-200 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-3 h-3 bg-yellow-200 rounded-full animate-bounce"></span>
              </div>
            </div>
          </>
        )}

        {quizStatus === "completed" && (
          <>
            <div className="p-8 max-w-2xl flex flex-col items-center w-full mx-auto text-center rounded-2xl shadow-lg shadow-blue-300 space-y-6 my-6 bg-gradient-to-br from-blue-400 to-blue-600">
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="flex justify-center"
              >
                <Trophy className="w-14 h-14 text-yellow-300 drop-shadow-md" />
              </motion.div>

              <h2 className="text-2xl font-semibold text-green-300 flex justify-center items-center gap-2">
                Quiz Completed!
              </h2>

              <div className="text-lg space-y-2 text-white">
                <p>
                  Your score:{" "}
                  <span className="font-bold text-yellow-200">
                    {score}/{words.length}
                  </span>
                </p>
                <p>
                  Accuracy:{" "}
                  <span className="font-bold text-green-200">
                    {Math.round((score / words.length) * 100)}%
                  </span>
                </p>
              </div>

              {/* Stars animation */}
              <div className="flex justify-center gap-2">
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
                    <Star className="w-6 h-6 text-yellow-200" />
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSubmitQuiz()}
                className="mt-4 px-6 py-2 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer shadow-md"
              >
                Submit Quiz
              </motion.button>
            </div>
          </>
        )}
      </div>
  </>)
};

export default PronounceItFastPage;
