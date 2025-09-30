import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import QuizTaken from '../../components/trainee/QuizTaken';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorPage from '../ErrorPage';
import SweetAlert from '../../components/util/SweetAlert';
import { motion } from "framer-motion";
import quizTraineeService from '../../services/quizTrainee.service';
import {
  Clock,
  Mic,
  Loader2,
  Trophy,
  Star,
  Target,
  Award,
  Play,
} from "lucide-react";

const ShootTheWordPage = () => {

    const { quiz_id } = useParams();
const navigate = useNavigate();

  //page config
  const [isLoading, setIsLoading] = useState(false); //for fetching quiz data
  const [quizStatus, setQuizStatus] = useState("notStarted");

  const [errorPage, setErrorPage] = useState(null);
  const [isTaken, setIsTaken] = useState(false);

  const [quizInfo, setQuizInfo] = useState(null);
  const [words, setWords] = useState([]);
  const [score, setScore] = useState(0);

  //timestamps
  const [startedAt, setStartedAt] = useState(null); //started at

  //quiz configs
  const [timerSeconds, setTimerSeconds] = useState(0); //default to 0
  const WORD_EXPIRE_TIME = 10000;
  const [wordTimeLeft, setWordTimeLeft] = useState(100);
  const [isShooting, setIsShooting] = useState(false); //shooting effect
  const [isListening, setIsListening] = useState(false); //mic listening

  const [currentWord, setCurrentWord] = useState(""); //changes
  const [spokenWord, setSpokenWord] = useState(""); //changes

  const [attemptStatus, setAttemptStatus] = useState("")

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

  const renderIsListening = () => {
    if (isListening) {
      return 'Is listening';
    } else if (!isListening) {
      return 'Click to Speak';
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
      const spoken = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim()
        .replace(/[^a-z\s]/g, "");

      setSpokenWord(spoken);

      if(spoken === spokenWord) {
        setIsListening(false);
      }
      console.log(spoken);
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

  const handleFetchQuiz = async () => {
    try {
      setIsLoading(true);
      const data = await quizTraineeService.getQuiz(quiz_id);

      if(data?.status === 'pending') {
        setQuizStatus('completed');
      } else if(data?.status === 'completed') {
        setAttemptStatus('completed')
      }

      if (data.quiz_info && data.words) {
        setQuizInfo(data.quiz_info);
        const wordsOnly = data.words.map((el) => el.question_word);
        setWords(wordsOnly);
      }

      console.log(data);
      setIsTaken(data.is_taken);
    } catch (error) {
      console.log(error);
      setErrorPage({
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again later",
        statusCode: error.response?.status || 500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //fetches the data
  useEffect(() => {
    if (quiz_id) {
      handleFetchQuiz();
    }
  }, [quiz_id]);

  useEffect(() => {
    if (quizInfo) {
      setTimerSeconds(quizInfo.timer_seconds);
    }
  }, [quizInfo]);

  const handleStartQuiz = () => {
    //start quiz
    //timestamps
    const startedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    setStartedAt(startedAt); //datetime in mysql
    console.log("Quiz Started at:", startedAt);

    //game config
    setQuizStatus("inProgress");
    setScore(0);
    generateNewWord();
  };

  /**
   * @SUBMIT_QUIZ connects to backend api
   * @RETURNS_PENDING
   */

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

    } catch (error) {
      SweetAlert.showError("Error", error.response.data.message);
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

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const generateNewWord = () => {
    let availableWords = words.filter((word) => word !== currentWord);

    console.log(availableWords);
    if (availableWords.length === 0) {
      availableWords = [currentWord];
    }

    const newWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    setSpokenWord("");
    // random position inside canvas
    const randomTop = Math.floor(Math.random() * 70) + 10; // 10% - 80%
    const randomLeft = Math.floor(Math.random() * 70) + 10; // 10% - 80%
    setPosition({ top: randomTop, left: randomLeft });
  };

  useEffect(() => {
    if (quizStatus !== "inProgress") return;

    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 70) + 10; // 10% - 80%
      const randomLeft = Math.floor(Math.random() * 70) + 10; // 10% - 80%
      setPosition({ top: randomTop, left: randomLeft });
    }, 1000); // move every 1 second

    return () => clearInterval(interval);
  }, [quizStatus]);

  const proceedToNextWord = () => {
    generateNewWord();
    setSpokenWord(""); //clears the spoken word
    // setIsShooting(false);
  };

  //handles next word and scoring.
  useEffect(() => {
    if (spokenWord === currentWord && currentWord !== "") {
      console.log("correct");
      setScore((prev) => prev + 5); //add score if correct
      setIsShooting(true);
      setIsListening(false);
      setTimeout(() => setIsShooting(false), 800); // stop after 0.8s
      proceedToNextWord();
    } else {
      setSpokenWord(""); //reset word for next word to be available
    }
  }, [spokenWord, currentWord]);

  //handle word timer
  useEffect(() => {
    if (!currentWord || quizStatus !== "inProgress") return;

    const interval = 100; // update every 100ms
    const decrement = 100 / (WORD_EXPIRE_TIME / interval);

    let progress = 100;
    setWordTimeLeft(progress);

    const timer = setInterval(() => {
      progress -= decrement;
      if (progress <= 0) {
        clearInterval(timer);
        setWordTimeLeft(0);
        proceedToNextWord(); // Word expired
      } else {
        setWordTimeLeft(progress);
      }
    }, interval);

    return () => clearInterval(timer); // Clear on unmount or word change
  }, [currentWord, quizStatus]);

  //handles the clock timer of the whole quiz
  useEffect(() => {
    let interval;
    if (quizStatus === "inProgress" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setQuizStatus("completed");

            if(!hasSubmittedRef.current) {
                hasSubmittedRef.current = true;
                handleAnswerQuiz();
            }

            return 0;
          }

          return prev - 1; //keeps on deducting if prev value is less than or equal to 1.
        });
      }, 1000);
    }
    return () => {
    if (interval) clearInterval(interval);
  };
  }, [quizStatus, timerSeconds]);

  if(isLoading) return <LoadingScreen message={"Loading Quiz...."}/>
  if(errorPage) return <ErrorPage />

  if (attemptStatus === "completed") return <QuizTaken />;

  return (
    <>

      <div className="w-full h-screen bg-gray-50 flex flex-col gap-4 justify-center px-2 ">

        {quizStatus === "notStarted" && (
          <>
            <div className="p-8 max-w-2xl w-full mx-auto text-center rounded-lg shadow-md shadow-blue-300 space-y-4 my-4 bg-gradient-to-br from-blue-400 to-blue-600 slide-in-up">
              <h2 className="text-2xl font-bold mb-6 text-white">
                How to Play:
              </h2>
              <div className="text-left mb-8 space-y-4 max-w-lg mx-auto">
                <div className="flex items-start text-black bg-white bg-opacity-10 p-3 rounded-md backdrop-blur-sm">
                  <Target className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold">Read the words aloud</div>
                    <div className="text-sm opacity-90">
                      Words appear on screen - speak them clearly before they
                      disappear
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-black bg-white bg-opacity-10 p-3 rounded-md backdrop-blur-sm">
                  <Mic className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold">Allow microphone access</div>
                    <div className="text-sm opacity-90">
                      Your browser will ask for permission - click "Allow" to
                      start playing
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-black bg-white bg-opacity-10 p-3 rounded-md backdrop-blur-sm">
                  <Award className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold">
                      Score points for accuracy
                    </div>
                    <div className="text-sm opacity-90">
                      Each correctly spoken word earns you 5 points
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-black bg-white bg-opacity-10 p-3 rounded-lg backdrop-blur-sm">
                  <Clock className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold">Beat the timer</div>
                    <div className="text-sm opacity-90">
                      Words disappear after a few seconds - speak quickly!
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStartQuiz()}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Play className="inline mr-2" size={20} />
                Start Game
              </button>
            </div>
          </>
        )}

        {quizStatus === "inProgress" && (
          <div className="p-4 max-w-3xl w-full mx-auto text-center rounded-2xl shadow-xl shadow-blue-300 space-y-6 my-6 bg-gradient-to-br from-blue-400 to-blue-600 slide-in-up">
            {/* Score & Timer */}
            <div className="flex justify-between items-center mb-6 bg-blue-50/30 backdrop-blur-sm p-4 rounded-lg shadow-inner">
              <div className="flex flex-col items-center justify-center font-bold">
                <p className="text-3xl text-blue-900">{timerSeconds}s</p>
                <div className="flex items-center justify-center gap-2 h-full">
                  <Clock size={12} color="blue" />
                  <small className="text-blue-800">Time</small>
                </div>
              </div>
              <div className="flex flex-col items-center font-bold">
                <p className="text-3xl text-blue-900">{score}</p>
                <small className="text-blue-800">Score</small>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="canvas relative w-full h-64 bg-blue-50/40 backdrop-blur-sm rounded-lg border border-blue-200 shadow-md">
              {/* Word Target */}
              <div
                className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg sm:px-8 sm:py-4 px-4 py-2 text-center shadow-lg absolute transition-all ease-linear duration-500 animate-bounce border-4 border-red-300"
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="text-2xl font-extrabold mb-3 text-white drop-shadow-lg tracking-wide">
                  {currentWord}
                </div>

                {/* Word timer bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 rounded-b-md overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${Math.max(0, wordTimeLeft)}%` }}
                  ></div>
                </div>

                {/* Shooting effect */}
                {isShooting && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <span
                        key={deg}
                        className="shooting-line"
                        style={{ "--angle": `${deg}deg` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <p className="text-xl text-center font-semibold text-white drop-shadow-md">
              🎯 Read the word aloud to shoot!
            </p>

            {/* Mic button */}
            <div className="flex items-center justify-center">
              <button
                onClick={startRecognition}
                className="px-6 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-2 capitalize cursor-pointer"
              >
                <Mic size={20} color="white" /> {renderIsListening()}
              </button>
            </div>
          </div>
        )}

        {quizStatus === "submitting" && (
          <>
            <div className="p-8 max-w-2xl w-full mx-auto text-center rounded-2xl shadow-lg shadow-blue-300 space-y-6 my-6 bg-gradient-to-br from-blue-400 to-blue-600">
              {/* Loader Icon */}
              <div className="flex justify-center">
                <Loader2 className="w-14 h-14 text-yellow-300 animate-spin" />
              </div>

              <h2 className="text-2xl font-semibold text-green-300">
                Submitting Quiz...
              </h2>

              <p className="text-white">
                Please wait while we save your answers
              </p>

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
                  Your collected points:{" "}
                  <span className="font-bold text-yellow-200">{score}</span>
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
    </>
  );
}

export default ShootTheWordPage