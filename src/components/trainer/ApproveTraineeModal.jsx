import { XCircle, UserCheck } from "lucide-react";
import "../../styles/animations.css";

const ApproveTraineeModal = ({ isOpen, onClose, onConfirm, trainee }) => {
  if (!isOpen || !trainee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 modal-animation">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Approve trainee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-700 mb-4 text-center">
          Are you sure you want to approve{" "}
          <span className="font-semibold text-blue-600">
            {trainee.first_name} {trainee.last_name}
          </span>
          ? This will give them access as an active trainee.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(trainee.id)}
            className="flex-1 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 transition"
          >
            <UserCheck size={18} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveTraineeModal;
