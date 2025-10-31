import React, { useEffect, useState } from "react";
import { XCircle, Loader2, CheckCircle, XIcon, AlertCircle } from "lucide-react";
import trainerService from "../../../services/trainer.service";

const ViewPerformanceModal = ({ isOpen, onClose, trainee }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await trainerService.getTraineePerformance(trainee.id);
      console.log(response);
      setPerformanceData(response.data);
    } catch (error) {
      setError("Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, trainee]);

  if (!isOpen) return null;

  const getGradeColor = (percentage) => {
    const numPercent = parseFloat(percentage);
    if (numPercent >= 80) return "text-green-600";
    if (numPercent >= 60) return "text-green-600";
    if (numPercent >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBg = (percentage) => {
    const numPercent = parseFloat(percentage);
    if (numPercent >= 80) return "bg-green-50 border-green-200";
    if (numPercent >= 60) return "bg-green-50 border-green-200";
    if (numPercent >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 modal-animation max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-700">Performance Overview</h2>
            <p className="text-gray-600 text-sm mt-1">{trainee?.first_name + " " + trainee?.last_name || "Trainee"}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            <p className="text-gray-600 mt-4">Loading performance data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error loading data</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Performance Data */}
        {!loading && !error && performanceData && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Quizzes Taken</p>
                <p className="text-2xl font-bold text-green-700">
                  {performanceData.quizzes_taken}/{performanceData.quizzes_total}
                </p>
              </div>
              <div className={`border rounded-lg p-4 ${getGradeBg(performanceData.average_grade)}`}>
                <p className="text-sm text-gray-600 mb-1">Average Grade</p>
                <p className={`text-2xl font-bold ${getGradeColor(performanceData.average_grade)}`}>
                  {performanceData.average_grade}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-700">
                  {Math.round((performanceData.quizzes_taken / performanceData.quizzes_total) * 100)}%
                </p>
              </div>
            </div>

            {/* Quiz Details */}
            <div className="overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quiz Details</h3>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {performanceData.details.map((quiz) => (
                  <div
                    key={quiz.quiz_id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      quiz.score !== null
                        ? getGradeBg(quiz.percentage)
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {quiz.score !== null ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XIcon className="w-5 h-5 text-gray-400" />
                          )}
                          <h4 className="font-semibold text-gray-800">
                            {quiz.quiz_title}
                          </h4>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          {quiz.score !== null ? (
                            <>
                              <p className="text-sm text-gray-600">
                                Score: <span className="font-medium">{quiz.score}/{quiz.total_points}</span>
                              </p>
                              <p className={`text-sm font-semibold ${getGradeColor(quiz.percentage)}`}>
                                {quiz.percentage}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              {quiz.percentage}
                            </p>
                          )}
                        </div>
                      </div>
                      {quiz.score !== null && (
                        <div className="ml-4">
                          <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm"
                            style={{
                              borderColor: parseFloat(quiz.percentage) >= 80 ? '#16a34a' :
                                          parseFloat(quiz.percentage) >= 60 ? '#2563eb' :
                                          parseFloat(quiz.percentage) >= 40 ? '#ca8a04' : '#dc2626'
                            }}>
                            {quiz.percentage.replace('%', '')}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPerformanceModal;