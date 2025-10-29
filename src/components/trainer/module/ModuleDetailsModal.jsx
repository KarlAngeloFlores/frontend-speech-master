import { useEffect, useState } from "react";
import { XCircle, Upload, Loader2, FileText } from "lucide-react";
import moduleService from "../../../services/module.service";
import "../../../styles/animations.css";

const ModuleDetailsModal = ({ data, isOpen, onClose }) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen && data) {
      setModule(data);
      fetchModuleContents(data.id);
    }
  }, [isOpen, data]);

  const fetchModuleContents = async (id) => {
    setLoading(true);
    try {
      const response = await moduleService.getModule(id, true);
      setModule(response.data);
    } catch (error) {
      console.error("Error fetching module contents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await moduleService.insertFile(module.id, file);
      await fetchModuleContents(module.id); // refresh list
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  /**
   * @FUNCTION_FOR_FILE_DELETION_INSIDE_MODULE
   * @param {} contentId 
   * @returns 
   */
  const handleDelete = async (contentId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await moduleService.deleteFile(contentId);
      await fetchModuleContents(module.id); // refresh list
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /**
   * @FOR_FILES
   */
const handleOpen = async (id, fileType) => {
  try {
    const blob = await moduleService.getFileBlob(id);
    const url = URL.createObjectURL(blob);
    
    // Check if it's an image
    if (fileType.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      // For images, you could either:
      // Option A: Open in new tab (like current behavior)
      window.open(url, "_blank");
      
      // Option B: Show in a lightbox/modal within the app
      // (would require additional state and UI)
    } else {
      // For PDFs/docs, open in new tab
      window.open(url, "_blank");
    }
  } catch (err) {
    console.error("Failed to open file", err);
  }
};

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl sm:p-8 p-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{module.title}</h2>
            <p className="text-sm text-gray-500">
              Created: {new Date(module.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
            aria-label="Close modal"
          >
            <XCircle size={28} />
          </button>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-gray-200 rounded-lg p-6 bg-blue-50 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Upload File</h3>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.tiff,.ico"
              onChange={handleFileChange}
              className="border-2 border-gray-500 p-2 rounded-lg w-full md:flex-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload
                </>
              )}
            </button>
          </div>
          {file && (
            <p className="mt-3 text-sm text-gray-700">
              Selected: {file.name} ({formatFileSize(file.size)})
            </p>
          )}
        </div>

        {/* Contents Section */}
        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-4">Module Contents</h3>
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : !module.ModuleContents || module.ModuleContents.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No files uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {module.ModuleContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">{content.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {content.file_type} • {formatFileSize(content.file_size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-3">
                    <button
                      onClick={() => handleOpen(content.id, content.file_type)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailsModal;