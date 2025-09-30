import { FolderIcon, Edit, Trash2, Loader2 } from "lucide-react";

const TrainerModuleList = ({ modules, loading, handleShowDetailsModal, handleDeleteModule, handleOpenUpdateModule }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Module List</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="border-t hover:bg-gray-50">
                  <td
                    className="p-3 cursor-pointer"
                    onClick={() => handleShowDetailsModal(module)}
                  >
                    <div className="flex items-center gap-2  font-medium hover:underline hover:text-blue-600">
                      <FolderIcon className="w-5 h-5 text-blue-600" />
                      {module.title}
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 text-sm">
                    {new Date(module.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleOpenUpdateModule(module)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {modules.length === 0 && !loading && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    No modules created yet. Create your first module above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainerModuleList;
