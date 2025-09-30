import React, { useState } from 'react'
import { XCircle } from "lucide-react";

const CreateQuizModal = ({ isOpen, onClose, onCreate }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedQuizType, setSelectedQuizType] = useState("");
  const [quizTimer, setQuizTimer] = useState(0);

  const [questions, setQuestions] = useState([
    { question_word: "", difficulty: "Easy" },
  ]);
  const [nonDifQuestions, setNonDifQuestions] = useState([
    { question_word: "" },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleNonDifQuestionChange = (index, field, value) => {
    const updatedQuestions = [...nonDifQuestions];
    updatedQuestions[index][field] = value;
    setNonDifQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_word: "", difficulty: "Easy" }]);
  };

  const addNonDifQuestion = () => {
    setNonDifQuestions([...nonDifQuestions, { question_word: "" }]);
  };

  const resetFields = () => {
        // Optionally reset fields
        setQuizTitle("");
        setSelectedQuizType("");
        setQuizTimer(0);
        setQuestions([{ question_word: "", difficulty: "Easy" }]);
        setNonDifQuestions([{ question_word: "" }]);
        onClose?.();
  }

  //handle create
  const handleCreate = async () => {

    try {

    let totalPoints; 
    let payloadQuestions;

    if(selectedQuizType === "pronounce_it_fast") {
        totalPoints = questions.length;
        payloadQuestions = questions;
    } else if (selectedQuizType === "shoot_the_word") {
        totalPoints = null; //collective 
        payloadQuestions = nonDifQuestions;
    }

        await onCreate?.(selectedQuizType, quizTitle, totalPoints, quizTimer, payloadQuestions);
        resetFields();

    } catch (error) {
        console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Create New Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-600 transition"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
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
                Quiz Timer (seconds)
              </label>
              <input
                type="number"
                min="0"
                value={quizTimer}
                onChange={(e) => setQuizTimer(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Time limit (e.g. 60 for 1 min)"
                required
              />
            </div>
          </div>

          {/* Questions */}
          {selectedQuizType === "pronounce_it_fast" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions
              </label>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-2"
                  >
                    <input
                      type="text"
                      value={q.question_word}
                      maxLength={50}
                      onChange={(e) =>
                        handleQuestionChange(index, "question_word", e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter question text"
                    />
                    <select
                      value={q.difficulty}
                      onChange={(e) =>
                        handleQuestionChange(index, "difficulty", e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Another Question
              </button>
            </div>
          )}

          {selectedQuizType === "shoot_the_word" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions
              </label>
              <div className="space-y-3">
                {nonDifQuestions.map((q, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={q.question_word}
                      maxLength={50}
                      onChange={(e) =>
                        handleNonDifQuestionChange(index, "question_word", e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter question text"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addNonDifQuestion}
                type="button"
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Another Question
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              type="button"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
            >
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizModal;