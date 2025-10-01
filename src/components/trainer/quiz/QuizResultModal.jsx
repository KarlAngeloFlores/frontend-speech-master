import React, { useEffect, useState } from "react";
import {
  XCircle,
  Trophy,
  Users,
  Clock,
  Calendar,
  Award,
  Loader2,
} from "lucide-react";

import quizTrainerService from "../../../services/quizTrainer.service";

const QuizResultModal = ({ onClose, isOpen, quiz }) => {

  const [quizId, setQuizId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if(isOpen && quiz) {
      console.log('OPENED RESULT MODAL');
      console.log(quiz);
      setQuizId(quiz.id);
    }
  }, [isOpen, quiz]);

  const handleShowQuizResult = async () => {
    try {
      const data = await quizTrainerService.getQuizResult(quizId);
      console.log(data);

      const rankedQuizResults = [...data.quiz_results].sort((a, b) => {
        if (a.score === null && b.score === null) return 0; // both null, keep order
        if (a.score === null) return 1; // a is null -> move a after b
        if (b.score === null) return -1; // b is null -> move b after a
        return b.score - a.score; // normal descending sort
      });

      setResults(rankedQuizResults);
      setInfo(data.quiz_info);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (quizId && isOpen) {
      handleShowQuizResult();
    }
  }, [quizId, isOpen]);

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";

    return "text-red-600 bg-red-50";
  };

  const getTotalPoints = (info) => {
    if(info.type === "shoot_the_word") {
      return 'N/A Collective Points'
    } else if (info.type === "pronounce_it_fast") {
      return info.total_points
    }
  }

  const getScoreBadgeColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not taken";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreSummary = (info, results) => {

    const takenQuizzes = results.filter((result) => result.taken_at !== null);

    if(info.type === 'pronounce_it_fast') {
      if (takenQuizzes.length === 0) return 0;
      const totalScore = takenQuizzes.reduce(
      (sum, result) => sum + result.score,
      0
    );

    return (totalScore / takenQuizzes.length).toFixed(1);

    } else if (info.type === 'shoot_the_word') {

      const avarageScore = takenQuizzes.reduce((sum, result) => sum + result.score, 0);
      return Number((avarageScore / takenQuizzes.length));

    };
  };

  const getScore = (result, info) => {
  if (result.score === null || result.score === undefined) {
    return (
      <span className="bg-gray-50 text-gray-600 inline-flex items-center px-3 py-1 rounded-full">
        N/A
      </span>
    );
  }

  const displayScore =
    info?.type === "pronounce_it_fast"
      ? `${result.score}/${info ? info.total_points : "?"}`
      : result.score;

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100">
      {displayScore}
    </span>
  );
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden slide-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Quiz Results</h2>
              {info && (
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-1">
                    <Trophy size={16} />
                    {info.title}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {results.length} Students
                  </span>
                </div>
              )}
            </div>
            <button
              className="text-white hover:text-gray-200 transition-colors cursor-pointer"
              onClick={onClose}
            >
              <XCircle size={28} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 size={24} className="text-blue-600" />
          </div>
        ) : (
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Statistics Cards */}
            {info && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">
                        Total Points
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        {getTotalPoints(info)}
                      </p>
                    </div>
                    <Award className="text-blue-500" size={24} />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    {info.type === "pronounce_it_fast" ? (
                      <>
                        <div>
                          <p className="text-green-600 text-sm font-medium">
                            Average Score
                          </p>
                          <p className="text-2xl font-bold text-green-800">
                            {getScoreSummary(info, results)}
                          </p>
                        </div>
                        <Trophy className="text-green-500" size={24} />
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-green-600 text-sm font-medium">
                            Average collected score
                          </p>
                          <p className="text-2xl font-bold text-green-800">
                            {getScoreSummary(info, results)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">
                        Time Limit
                      </p>
                      <p className="text-2xl font-bold text-orange-800">
                        {Math.floor(info.timer_seconds)}s
                      </p>
                    </div>
                    <Clock className="text-orange-500" size={24} />
                  </div>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Student Scores
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Rank
                      </th>
                      <th className="text-left p-4 font-medium text-gray-700">
                        Student
                      </th>
                      <th className="text-center p-4 font-medium text-gray-700">
                        Score
                      </th>

                      {info.type === "pronounce_it_fast" ? (
                        <th className="text-center p-4 font-medium text-gray-700">
                          Percentage
                        </th>
                      ) : (
                        <></>
                      )}

                      {/* <th className="text-center p-4 font-medium text-gray-700">Status</th> */}
                      <th className="text-left p-4 font-medium text-gray-700">
                        Taken At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => {
                      const percentage = info
                        ? ((result.score / info.total_points) * 100).toFixed(1)
                        : 0;
                      const fullName = `${result.first_name} ${result.last_name}`;
                      return (
                        <tr
                          key={result.user_id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              {result.taken_at ? (
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                    index === 0
                                      ? "bg-yellow-500"
                                      : index === 1
                                      ? "bg-gray-400"
                                      : "bg-yellow-600"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                                  {result.taken_at ? index + 1 : "-"}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {result.first_name.charAt(0)}
                                {result.last_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {fullName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {result.user_id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            {getScore(result, info)}
                          </td>

                          {info.type === "pronounce_it_fast" ? (
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  {
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        info
                                          ? getScoreBadgeColor(
                                              result.score,
                                              info.total_points
                                            )
                                          : "bg-gray-400"
                                      }`}
                                      style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                      }}
                                    ></div>
                                  }
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          ) : (
                            <></>
                          )}

                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar size={14} />
                              {formatDate(result.taken_at)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultModal;
