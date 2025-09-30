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

const TrainerHomePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats] = useState({
    totalStudents: 5,
    totalQuizzes: 5,
    totalAttempts: 5,
    totalModules: 5,
  });

  const completionStatusData = [
    { name: "Completed", value: 400, color: "#4ade80" },
    { name: "In Progress", value: 300, color: "#fbbf24" },
    { name: "Not Started", value: 300, color: "#f87171" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarTrainer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">

        {/* Header */}
        <header className="px-8 py-6 bg-white shadow flex items-center justify-between gap-4">
          <div>
          <button
            className="md:hidden bg-white text-blue-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-7 h-7" />
          </button>
          <section>
            <h1 className="text-2xl font-bold text-blue-700">Home</h1>
            <p>Comprehensive insights into quiz performance and student progress</p>
          </section>
          </div>
          <Logout />
        </header>
        {/* Content */}
        <div className="p-8 flex-1 w-full">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
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
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quiz Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              {/* <tbody> ... </tbody> */}
            </table>
          </div>

                    <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quiz Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              {/* <tbody> ... </tbody> */}
            </table>
          </div>

                    <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quiz Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              {/* <tbody> ... </tbody> */}
            </table>
          </div>
          </div>
      </main>
    </div>
  );
};

export default TrainerHomePage;