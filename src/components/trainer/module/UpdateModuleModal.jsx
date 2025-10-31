import React, { useState, useEffect } from "react";
import { XCircle, Loader2, Edit3 } from "lucide-react";
import "../../../styles/animations.css"

const UpdateModuleModal = ({ isOpen, onClose, onUpdate, module }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // preload module title when modal opens
  useEffect(() => {
    if (module) {
      setTitle(module.title || "");
      setCategory(module.category || "");
    }
  }, [module]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim()) {
      setError("Missing inputs");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onUpdate(title, category);
      onClose();
    } catch (error) {
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setTitle(module?.title || "");
    setCategory(module?.category || "");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 modal-animation">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">Update Module</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-green-600 transition cursor-pointer"
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
              placeholder="Enter new module title"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              disabled={loading}
              required
            />
            
          </div>
                    <div>
            {/**Dropdown */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              type="text"
              placeholder="Enter module category"
              value={category}
              maxLength={100}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              disabled={loading}
              required
            >
              <option value="">Select category</option>
              <option value="Vocabulary">Vocabulary</option>
              <option value="Pronunciation">Pronunciation</option>
              <option value="Grammar">Grammar</option>

            </select>
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
            className="flex-1 px-4 py-2 bg-gradient-to-r bg-green-600 text-white rounded-lg hover:from-green-700 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                Update
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModuleModal;