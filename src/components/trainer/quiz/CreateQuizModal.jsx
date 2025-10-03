import React, { useState } from "react";
import { XCircle } from "lucide-react";

const CreateQuizModal = ({ isOpen, onClose, onCreate }) => {
  const [error, setError] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedQuizType, setSelectedQuizType] = useState("");
  const [quizTimer, setQuizTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([
    { question_word: "", difficulty: "Easy" },
  ]);
  const [nonDifQuestions, setNonDifQuestions] = useState([
    { question_word: "" },
  ]);

  const sanitizeWord = (value) => {
  // force lowercase, remove disallowed chars
  return value.toLowerCase().replace(/[^a-z'-]/g, "");
};

const handleQuestionChange = (index, field, value) => {
  const updatedQuestions = [...questions];
  updatedQuestions[index][field] = sanitizeWord(value);
  setQuestions(updatedQuestions);
};

const handleNonDifQuestionChange = (index, field, value) => {
  const updatedQuestions = [...nonDifQuestions];
  updatedQuestions[index][field] = sanitizeWord(value);
  setNonDifQuestions(updatedQuestions);
};
  const addQuestion = () => {
    setQuestions([...questions, { question_word: "", difficulty: "Easy" }]);
  };

  const addNonDifQuestion = () => {
    setNonDifQuestions([...nonDifQuestions, { question_word: "" }]);
  };

  const resetFields = () => {
    setQuizTitle("");
    setSelectedQuizType("");
    setQuizTimer(0);
    setQuestions([{ question_word: "", difficulty: "Easy" }]);
    setNonDifQuestions([{ question_word: "" }]);
    setError("");
    onClose?.();
  };

const validateFields = () => {
  if (!quizTitle.trim()) {
    setError("Quiz title is required.");
    return false;
  }
  if (quizTitle.trim().length < 3) {
    setError("Quiz title must be at least 3 characters long.");
    return false;
  }
  if (!selectedQuizType) {
    setError("Please select a quiz type.");
    return false;
  }
  if (!quizTimer || quizTimer <= 0) {
    setError("Please enter a valid timer (greater than 0).");
    return false;
  }

  if (selectedQuizType === "pronounce_it_fast") {
    if (questions.length === 0) {
      setError("At least 1 question is required.");
      return false;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question_word.trim()) {
        setError(`Question ${i + 1} cannot be empty.`);
        return false;
      }
    }
  }

  if (selectedQuizType === "shoot_the_word") {
    if (nonDifQuestions.length === 0) {
      setError("At least 1 question is required.");
      return false;
    }
    for (let i = 0; i < nonDifQuestions.length; i++) {
      if (!nonDifQuestions[i].question_word.trim()) {
        setError(`Question ${i + 1} cannot be empty.`);
        return false;
      }
    }
  }

  setError(""); // clear errors if all good
  return true;
};


  const handleCreate = async () => {
    setLoading(true);
    try {
      if (!validateFields()) return;

      let totalPoints;
      let payloadQuestions;

      if (selectedQuizType === "pronounce_it_fast") {
        totalPoints = questions.length;
        payloadQuestions = questions;
      } else if (selectedQuizType === "shoot_the_word") {
        totalPoints = nonDifQuestions.length * 5;
        payloadQuestions = nonDifQuestions;
      }

      await onCreate?.(
        selectedQuizType,
        quizTitle,
        totalPoints,
        quizTimer,
        payloadQuestions
      );
      resetFields();
    } catch (error) {
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[90vh] max-h-[600px]">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700">Create New Quiz</h2>
          <button
            onClick={resetFields}
            className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Basic Info - Fixed */}
        <div className="px-6 pt-4 pb-2 space-y-3">
          {/* Quiz Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              value={quizTitle}
              maxLength={100}
              onChange={(e) => setQuizTitle(e.target.value)}
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter quiz title"
              required
            />
          </div>

          {/* Quiz Type and Timer */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Type
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={selectedQuizType}
                onChange={(e) => setSelectedQuizType(e.target.value)}
              >
                <option value="">Select quiz type</option>
                <option value="pronounce_it_fast">Pronounce it fast</option>
                <option value="shoot_the_word">Shoot the Word</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timer (sec)
              </label>
              <input
                type="number"
                min="0"
                value={quizTimer}
                onChange={(e) => setQuizTimer(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g. 60"
                required
              />
            </div>
          </div>
        </div>

        {/* Scrollable Questions Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Questions */}
          {selectedQuizType === "pronounce_it_fast" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Questions
              </label>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50"
                  >
                    <input
                      type="text"
                      value={q.question_word}
                      maxLength={50}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "question_word",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="Enter word"
                    />
                    <select
                      value={q.difficulty}
                      onChange={(e) =>
                        handleQuestionChange(index, "difficulty", e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                ))}
              </div>
              <button
                onClick={addQuestion}
                type="button"
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Another Question
              </button>
            </div>
          )}

          {selectedQuizType === "shoot_the_word" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Questions
              </label>
              <div className="space-y-3">
                {nonDifQuestions.map((q, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <input
                      type="text"
                      value={q.question_word}
                      maxLength={50}
                      onChange={(e) =>
                        handleNonDifQuestionChange(
                          index,
                          "question_word",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="Enter word"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addNonDifQuestion}
                type="button"
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Another Question
              </button>
            </div>
          )}

          {selectedQuizType === "" && (
            <div className="text-center py-8 text-gray-500">
              Select a quiz type to add questions
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 rounded-lg mt-4">
          <button
            type="button"
            onClick={resetFields}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            type="button"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizModal;