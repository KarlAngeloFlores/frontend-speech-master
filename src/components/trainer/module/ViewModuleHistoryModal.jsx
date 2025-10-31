import React, { useEffect, useState } from "react";
import { XCircle, History, Loader2, User, Calendar } from "lucide-react";
import moduleService from "../../../services/module.service";
import "../../../styles/animations.css";

const ViewModuleHistoryModal = ({ isOpen, onClose, module }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && module) {
        console.log(module.id)
      fetchModuleHistory();
    }
  }, [isOpen, module]);

  const fetchModuleHistory = async () => {
    setLoading(true);
    setError("");
    setHistoryData([]);
    try {
      const response = await moduleService.getModuleHistory(module.id);
      console.log(response)
      setHistoryData(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch module history");
      console.error("Error fetching module history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case "created":
        return "bg-green-100 text-green-800 border-green-300";
      case "updated":
        return "bg-green-100 text-green-800 border-green-300";
      case "deleted":
        return "bg-red-100 text-red-800 border-red-300";
      case "archived":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] modal-animation">
        {/* Header - Fixed */}
        <div className="flex justify-between items-start mb-6 p-8 pb-0">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Module History</h2>
              <p className="text-sm text-gray-500 mt-1">{module?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-3" />
              <p className="text-gray-600">Loading history...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium mb-3">Failed to load history</p>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={fetchModuleHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && historyData.length === 0 && (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No history yet
              </h3>
              <p className="text-gray-500">No actions have been recorded for this module.</p>
            </div>
          )}

          {/* History Timeline */}
          {!loading && !error && historyData.length > 0 && (
            <div className="space-y-4">
              {historyData.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {index !== historyData.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                  )}

                  {/* History entry */}
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center text-lg">
                        📝
                      </div>
                    </div>

                    {/* Entry content */}
                    <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border-2 border-gray-300">
                            {entry.action.charAt(0).toUpperCase() +
                              entry.action.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(entry.created_at)}
                        </p>
                      </div>

                      {/* User info */}
                      {entry.User && entry.User.email && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            {/* <p className="text-sm font-medium text-gray-900">
                              {entry.User.name || entry.User.email}
                            </p> */}
                            <p className="text-xs text-gray-500">
                              {entry.User.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer - Fixed */}
        {!loading && !error && historyData.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 px-8 pb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {historyData.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Total Actions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {
                  historyData.filter((h) =>
                    h.action?.toLowerCase().includes("created")
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600 mt-1">Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {new Set(historyData.map((h) => h.created_by)).size}
              </p>
              <p className="text-xs text-gray-600 mt-1">Contributors</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewModuleHistoryModal