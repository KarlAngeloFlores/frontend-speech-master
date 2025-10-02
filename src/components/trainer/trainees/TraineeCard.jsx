import React from "react";
import {
  User,
  Mail,
  Calendar,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import "../../../styles/animations.css";

const TraineeCard = ({ trainee, onAccept, onDelete, onView }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  const getFullName = (firstName, lastName, middleName) =>
    [firstName, middleName, lastName].filter(Boolean).join(" ");

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden modal-animation">
      {/* Header with Avatar and Status */}
      <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="min-w-16 min-h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
              {getInitials(trainee.first_name, trainee.last_name)}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {getFullName(
                  trainee.first_name,
                  trainee.last_name,
                  trainee.middle_name
                )}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {trainee.status === "verified" ? (
              <UserCheck className="w-6 h-6" />
            ) : (
              <UserX className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Status Badge */}
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              trainee.role === "trainee"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {trainee.status === "verified"
              ? "Active trainee"
              : "Pending Approval"}
          </span>
        </div>

        {/* Name Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">First Name:</span>
            <span className="font-medium">{trainee.first_name}</span>
          </div>
          {trainee.middle_name && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Middle Name:</span>
              <span className="font-medium">{trainee.middle_name}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Name:</span>
            <span className="font-medium">{trainee.last_name}</span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-2 text-gray-700 pt-2 border-t">
          <Mail className="w-4 h-4 text-blue-500" />
          <span className="text-sm truncate">{trainee.email}</span>
        </div>

        {/* Created At */}
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" />
          <div>
            <span className="block">
              Created: {formatDate(trainee.created_at)}
            </span>
          </div>
        </div>

        {/* Action Buttons Pending */}
        {trainee.status === "pending" && (
          <button
            onClick={() => onAccept(trainee)}
            className="w-full mt-4 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Accept Application</span>
          </button>
        )}

        {/**Action Buttons Active */}
        {trainee.status === "verified" && (
          <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-3">
            <button
              onClick={() => onDelete(trainee)}
              className="w-full sm:w-auto mt-4 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white text-nowrap cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => onView(trainee)}
              className="w-full sm:w-auto mt-4 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white text-nowrap cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>View Performance</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraineeCard;
