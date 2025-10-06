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
  CheckCircle2,
} from "lucide-react";

const ShootTheWordPage = () => {

  const { quiz_id } = useParams();
const navigate = useNavigate();

  //page config
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false); //for fetching quiz data
  const [quizStatus, setQuizStatus] = useState("notStarted");

  const [errorPage, setErrorPage] = useState(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        setScore(data.score || 0);
        


      } else if(data?.status === 'completed') {
        setAttemptStatus('completed')
      }

      if (data.quiz_info && data.words) {
        setQuizInfo(data.quiz_info);
        const wordsOnly = data.words.map((el) => el.question_word);
        setWords(wordsOnly);
        
      }

      console.log(data);
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
      setTotalPoints(quizInfo.total_points); //setting total points coming from database;
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

const handleAnswerQuiz = async (finalScore = score) => {
  try {
    if (hasSubmittedRef.current) return; // prevent multiple submits
    hasSubmittedRef.current = true;

    setQuizStatus("submitting");

    const completedAt = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const takenAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    console.log("Quiz Completed at:", completedAt);

    const result = await quizTraineeService.answerQuiz(
      quiz_id,
      finalScore,   // ✅ use final score passed in OR fallback to current score
      takenAt,
      startedAt,
      completedAt
    );
    console.log(result);

    setTimeout(() => {
      setQuizStatus("completed");
    }, 2000);
  } catch (error) {
    SweetAlert.showError("Error", error.response?.data?.message || "Something went wrong");
  }
};



  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {

        const response = await quizTraineeService.submitQuiz(quiz_id);
        setIsSubmitted(true);

        SweetAlert.showSuccess(
          "Quiz Submitted",
          "Quiz Submitted Successfully",
          () => navigate("/trainee/quizzes")
        );
    
    } catch (error) {
        console.log(error);
        SweetAlert.showError(error.message || "Something went wrong. Try again later");
    } finally {
      setIsSubmitting(false)
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
  };

useEffect(() => {
  if (spokenWord === currentWord && currentWord !== "") {
    console.log("correct");

    setScore((prev) => {
      const newScore = prev + 5;

      if (newScore >= totalPoints) {
        setQuizStatus("completed");

        if (!hasSubmittedRef.current) {
          handleAnswerQuiz(totalPoints); // ✅ pass capped score
        }

        return totalPoints;
      }

      return newScore;
    });

    setIsShooting(true);
    setIsListening(false);
    setTimeout(() => setIsShooting(false), 800);
    proceedToNextWord();
  } else {
    setSpokenWord("");
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

  useEffect(() => {
  let interval;
  if (quizStatus === "inProgress" && timerSeconds > 0) {
    interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setQuizStatus("completed");

          if (!hasSubmittedRef.current) {
            handleAnswerQuiz(score); // ✅ ensure latest score submitted
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
}, [quizStatus, timerSeconds, score]);


  if(isLoading) return <LoadingScreen message={"Loading Quiz...."}/>
  if(errorPage) return <ErrorPage />

  if (attemptStatus === "completed") return <QuizTaken />;

  return (
    <>

      <div className="w-full min-h-screen bg-slate-50 flex flex-col gap-4 justify-center px-4 py-8">

        {quizStatus === "notStarted" && (
          <>
            <div className="p-8 max-w-3xl w-full mx-auto rounded-xl shadow-lg bg-white border border-slate-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Shoot The Word
                </h1>
                <p className="text-slate-600">
                  Test your pronunciation skills with this voice-activated game
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  How to Play
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        Read Words Aloud
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Words will appear on the screen. Speak them clearly and accurately before they disappear. Each word has a time limit shown by the green progress bar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        Enable Microphone Access
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Your browser will request permission to use your microphone. Click "Allow" when prompted. Without microphone access, you won't be able to play the game.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        Earn Points
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Each correctly pronounced word earns you 5 points. Your goal is to score as many points as possible before time runs out.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        Beat the Clock
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        You have a limited time to complete the quiz. Keep an eye on the timer at the top of the screen and speak quickly but clearly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Quiz Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Points Available</p>
                    <p className="text-2xl font-bold text-blue-600">{totalPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Points Per Word</p>
                    <p className="text-2xl font-bold text-blue-600">5</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => handleStartQuiz()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-md transition-all duration-200 hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5" />
                  Start Quiz
                </button>
              </div>
            </div>
          </>
        )}

        {quizStatus === "inProgress" && (
          <div className="p-6 max-w-4xl w-full mx-auto rounded-xl shadow-lg bg-white border border-slate-200">
            {/* Score & Timer */}
            <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Time Remaining</p>
                  <p className="text-2xl font-bold text-slate-800">{timerSeconds}s</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-slate-600 font-medium text-right">Current Score</p>
                  <p className="text-2xl font-bold text-blue-600 text-right">{score} / {totalPoints}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="canvas relative w-full h-80 bg-slate-100 rounded-lg border-2 border-slate-300 shadow-inner mb-6">
              {/* Word Target */}
              <div
                className="bg-red-600 rounded-lg px-8 py-4 text-center shadow-xl absolute transition-all ease-linear duration-500 animate-bounce border-4 border-red-400"
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="text-3xl font-bold text-white tracking-wide">
                  {currentWord}
                </div>

                {/* Word timer bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 rounded-b-md overflow-hidden">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
              <p className="text-lg font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Speak the word clearly to score points
              </p>
            </div>

            {/* Mic button */}
            <div className="flex items-center justify-center">
              <button
                onClick={startRecognition}
                disabled={isListening}
                className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-all flex items-center justify-center gap-3 text-lg cursor-pointer disabled:cursor-not-allowed"
              >
                <Mic size={24} /> {renderIsListening()}
              </button>
            </div>
          </div>
        )}

        {quizStatus === "submitting" && (
          <>
            <div className="p-12 max-w-md w-full mx-auto text-center rounded-xl shadow-lg bg-white border border-slate-200">
              <div className="flex justify-center mb-6">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Submitting Quiz
              </h2>

              <p className="text-slate-600">
                Please wait while we save your results...
              </p>
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
              
              <p className="text-slate-600 mb-8">
                Great job! Here are your results
              </p>

              <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">Your Score</p>
                  <p className="text-4xl font-bold text-blue-600">{score}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Total Scores</p>
                  <p className="text-2xl font-semibold text-slate-700">{totalPoints}</p>
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
                disabled={isSubmitting || isSubmitted}
                className="w-full px-6 py-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-semibold text-lg disabled:cursor-not-allowed cursor-pointer disabled:bg-blue-800"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? 'Submitting' : 'Submit Quiz'}
              </motion.button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ShootTheWordPage