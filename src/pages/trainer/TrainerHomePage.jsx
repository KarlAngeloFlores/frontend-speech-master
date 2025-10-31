import React, { useState } from "react";
import SidebarTrainer from "../../components/SidebarTrainer";
import { Menu, BarChart3, CheckCircle, Users } from "lucide-react";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Logout } from "../../components/auth/Logout";
import trainerService from "../../services/trainer.service";
import { useEffect } from "react";
import LoadingScreen from "../../components/LoadingScreen"
import ErrorPage from "../ErrorPage";
import "../../styles/animations.css"

const TrainerHomePage = () => {

    const getCompPercentage = (attempts, studentCount) => {
    if (studentCount === 0) return 0; // avoid division by zero
    const percentage = (attempts / studentCount) * 100;
    return percentage.toFixed(2);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [perCompletion, setPerCompletion] = useState([]);
  const [stats, setStats] = useState({
    totalTrainees: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    totalModules: 0,
  });

const [completionStatusData, setCompletionStatusData] = useState([]);

useEffect(() => {
  if (stats.totalTrainees > 0 && stats.totalQuizzes > 0) {
    const totalPossibleAttempts = stats.totalTrainees * stats.totalQuizzes;
    const completed = stats.totalAttempts;
    const notStarted = totalPossibleAttempts - completed;

    setCompletionStatusData([
      {
        name: "Completed",
        value: completed,
        percentage:
          totalPossibleAttempts > 0
            ? ((completed / totalPossibleAttempts) * 100).toFixed(2)
            : 0,
        color: "#4ade80", // green
      },
      {
        name: "Unanswered Quizzes By Participants",
        value: notStarted,
        percentage:
          totalPossibleAttempts > 0
            ? ((notStarted / totalPossibleAttempts) * 100).toFixed(2)
            : 0,
        color: "#f87171", // red
      },
    ]);
  }
}, [stats]);

  /**
   * @FETCH_DATA_HOME_PAGE
   */

  const fetchData = async (showLoading = false) => {
    if(showLoading) setLoading(true);
    try {
      
      const response = await trainerService.getHome();
      console.log(response);
      setStats(response.stats);
      setPerCompletion(response.completion);

    } catch (error) {
      console.log(error);
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      if(showLoading) setLoading(false);
    }
  }

useEffect(() => {
  // Initial fetch
  fetchData(true);

  // Poll every 1 minute
  const interval = setInterval(() => {
    fetchData(false);
  }, 60000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);
}, []);

  //polling

  if(loading) return <LoadingScreen message={"Loading data...."} />
  if(error) return <ErrorPage />

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarTrainer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">

        {/* Header */}
        <header className="sm:px-8 sm:py-6 px-4 py-3  bg-white shadow flex items-center justify-between gap-4">
          <div className="flex gap-2">
          <button
            className="md:hidden bg-white text-green-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-7 h-7" />
          </button>
          <section>
            <h1 className="text-2xl font-bold text-green-700">Progress Reports</h1>
            <p>Comprehensive insights into quiz performance and trainees progress</p>
          </section>
          </div>
          <Logout />
        </header>
        {/* Content */}
        <div className="sm:p-8 p-4 flex-1 w-full modal-animation">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quiz Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trainees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTrainees}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Modules</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalModules}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quiz Completion Status
              </h3>
              {stats.totalQuizzes !== 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={completionStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-red-600">Data is incomplete or not available</p>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quiz Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Quiz Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              
            {/* Body */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {perCompletion.length > 0 ? (
                perCompletion.map((comp, index) => {
                  const percentage = getCompPercentage(
                    comp.completed_attempts,
                    stats.totalTrainees
                  );

                  // Color coding for progress bar
                  const barColor =
                    percentage < 30
                      ? "bg-red-500"
                      : percentage < 70
                      ? "bg-yellow-500"
                      : "bg-green-500";

                  return (
                    <tr
                      key={`comp-${index}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {comp.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-800">
                          {comp.completed_attempts}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-48 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`${barColor} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-700 mt-1 font-medium">
                          {percentage}%
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No Quiz Available
                  </td>
                </tr>
              )}
            </tbody>
              
            </table>
          </div>
          </div>
      </main>
    </div>
  );
};

export default TrainerHomePage;