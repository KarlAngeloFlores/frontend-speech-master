import React, { useState } from "react";
import { XCircle, Loader2, Plus } from "lucide-react";
import "../../../styles/animations.css";


const CreateModuleModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Module title cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onCreate(title, description);
      setTitle(""); 
      onClose(); // close modal after success
    } catch (err) {
      setError(err.message || "Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 modal-animation">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Create New Module</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-blue-600 transition"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Title
            </label>
            <input
              type="text"
              placeholder="Enter module title"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              disabled={loading}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              type="text"
              placeholder="Enter module description"
              value={description}
              maxLength={200}
              onChange={(e) => setDescription(e.target.value)}
              className=" resize-none w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-28"
              disabled={loading}
              required
            />
            
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModuleModal;
