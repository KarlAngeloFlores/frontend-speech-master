import { XCircle } from "lucide-react";
import React, { useState } from "react";
const PendingTraineeModal = ({ isOpen, onClose, trainee, onSuspend }) => {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSuspend = async () => {
    setLoading(true);
    try {
      if (confirmEmail.trim() === trainee.email.trim()) {
        await onSuspend(trainee.id);
        onClose();
      } else {
        setError("Email addresses do not match. Please type it exactly.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmEmail("");
    setError("");
    onClose();
  };

  const handleInputChange = (e) => {
    setConfirmEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 modal-animation">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-600">
            Set Trainee Inactive
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-yellow-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Confirmation Text */}
        <p className="text-gray-600 mb-4">
          Please confirm by typing the email address of the trainee:
        </p>

        <p className="font-semibold text-center text-blue-600 mb-4">
          {trainee.email}
        </p>
        
        {/* Input Field */}
        <input
          type="email"
          value={confirmEmail}
          onChange={handleInputChange}
          className={`border rounded-md p-2 w-full mt-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Confirm email"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        
        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 rounded-md px-4 py-2 mr-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSuspend}
            className={`bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white rounded-md px-4 py-2 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Suspending..." : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingTraineeModal;
