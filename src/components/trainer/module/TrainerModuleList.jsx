import React from "react";

const TrainerModuleList = ({
  modules,
  onOpenModule,
  onOpenUpdateModule,
  onDeleteModule,
  onArchiveModule,
  onRestoreModule,
  onViewHistoryModule,
  formatDate,
}) => {
  if (modules.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No modules yet
        </h3>
        <p className="text-gray-500 mb-6">
          Create your first training module to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left font-semibold text-gray-700">Title</th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Category
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Created
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Status
            </th>
            <th className="p-4 text-right font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr
              key={module.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td
                className="p-4 cursor-pointer"
                onClick={() => onOpenModule(module)}
              >
                <div className="font-medium text-green-600 hover:text-green-700 hover:underline max-w-32 min-w-32 truncate">
                  {module.title}
                </div>
              </td>
              <td className="p-4">
                <div className="text-gray-600 text-sm line-clamp-2 max-w-40 min-w-40 truncate">
                  {module.category || "No category"}
                </div>
              </td>
              <td className="p-4 text-gray-600 text-sm">
                {formatDate(module.created_at)}
              </td>
              <td className="p-4">
                <div
                  className={`text-sm font-medium ${
                    module.status === "archived"
                      ? "text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {module.status === "archived" ? "Archived" : "Active"}
                </div>
              </td>
              <td className="p-4">
                {module.status !== "archived" ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onOpenUpdateModule(module)}
                      className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    {/* <button
                    onClick={() => onDeleteModule(module)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium cursor-pointer"
                  >
                    Delete
                  </button> */}

                    <button
                      onClick={() => onArchiveModule(module)}
                      className="px-3 py-2 text-yellow-600 text-sm font-medium cursor-pointer"
                    >
                      Archive
                    </button>

                    <button
                      onClick={() => onViewHistoryModule(module)}
                      className="px-3 py-2 text-green-600 text-sm font-medium cursor-pointer"
                    >
                      View History
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onRestoreModule(module)}
                      className="px-3 py-2 text-green-600 text-sm font-medium cursor-pointer"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => onDeleteModule(module)}
                      className="px-3 py-2 text-red-600 text-sm font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                    <button onClick={() => onViewHistoryModule(module)} className="px-3 py-2 text-green-600 text-sm font-medium cursor-pointer">
                      View History
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerModuleList;
