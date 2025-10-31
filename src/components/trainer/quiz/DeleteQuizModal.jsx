import React, { useState } from "react";
import { XCircle } from "lucide-react";
import "../../../styles/animations.css";

const DeleteQuizModal = ({ isOpen, onClose, onDelete, quiz }) => {
  const [confirmTitle, setConfirmTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
    if (confirmTitle.trim() === quiz.title.trim()) {
      await onDelete?.(quiz.id);
      setConfirmTitle("");
      setError("");
      onClose();
    } else {
      setError("Quiz title does not match. Please type it exactly.");
    }
    } catch (error) {
      setError(error.message || 'Something went wrong. Try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmTitle("");
    setError("");
    onClose();
  };

  const handleInputChange = (e) => {
    setConfirmTitle(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 modal-animation">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">Delete Quiz</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-red-600 transition"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Confirmation Text */}
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this quiz? This action cannot be
          undone. To confirm, please type the quiz title below:
        </p>
        <p className="font-semibold text-center text-green-600 mb-4">
          {quiz.title}
        </p>

        {/* Input for confirmation */}
        <div className="mb-4">
          <input
            type="text"
            value={confirmTitle}
            onChange={handleInputChange}
            maxLength={100}
            placeholder="Type quiz title here"
            className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={confirmTitle.trim() !== quiz.title.trim() || loading}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
              confirmTitle.trim() === quiz.title.trim()
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            { loading ? 'Deleting...' : 'Delete' }
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuizModal;