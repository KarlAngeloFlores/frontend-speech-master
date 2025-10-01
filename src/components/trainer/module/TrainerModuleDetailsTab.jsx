import { useEffect, useState } from "react";
import {
  Loader2,
  FileText,
  Upload,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  FileType,
  AlertCircle,
} from "lucide-react";
import moduleService from "../../../services/module.service";

const TrainerModuleDetailsTab = ({ module, onUpdate, onDelete }) => {
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [moduleContents, setModuleContents] = useState([]);
  const [file, setFile] = useState(null);

  /**
   * @FETCH_MODULE_CONTENTS
   */
  const fetchModuleContents = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await moduleService.getModule(id, true);
      setModuleData(response.data);
      setModuleContents(response.data.ModuleContents || []);
    } catch (error) {
      console.error("Error fetching module contents:", error);
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (module) {
      setModuleData(module);
      fetchModuleContents(module.id);
    }
  }, [module]);

  /**
   * @HANDLE_FILE_CHANGE
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please select a PDF or Word document");
        return;
      }
      setFile(selectedFile);
    }
  };

  /**
   * @UPLOAD_FILE
   */
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await moduleService.insertFile(module.id, file);
      await fetchModuleContents(module.id);
      setFile(null);
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /**
   * @DELETE_FILE
   */
  const handleDeleteFile = async (contentId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await moduleService.deleteFile(contentId);
      await fetchModuleContents(module.id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  /**
   * @OPEN_FILE
   */
  const handleOpen = async (id) => {
    try {
      const blob = await moduleService.getFileBlob(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to open file", error);
      alert("Failed to open file. Please try again.");
    }
  };

  /**
   * @FORMAT_FILE_SIZE
   */
  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  /**
   * @FORMAT_DATE
   */
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

  /**
   * @GET_FILE_ICON_COLOR
   */
  const getFileIconColor = (fileType) => {
    if (!fileType) return "text-gray-500";
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return "text-red-500";
    if (type.includes("doc")) return "text-blue-500";
    return "text-gray-500";
  };

  if (loading && !moduleData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading module contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium mb-2">Error loading module</p>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => module && fetchModuleContents(module.id)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Info with Actions */}
      {moduleData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 overflow-hidden wrap-break-word">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                {moduleData.title}
              </h2>
              {moduleData.description && (
                <p className="text-gray-700 mb-3">{moduleData.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Created on {formatDate(moduleData.created_at)}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 ml-4">
              <button
                onClick={() => onUpdate(moduleData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Edit className="w-4 h-4" />

              </button>
              <button
                onClick={() => onDelete(moduleData.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4 cursor-pointer">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-lg">Upload File</h3>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex-1 w-full">
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border-2 border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{file.name}</span> (
                {formatFileSize(file.size)})
              </p>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md w-full md:w-auto"
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
      </div>

      {/* Module Contents */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileType className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-lg">
            Module Contents
          </h3>
          {moduleContents.length > 0 && (
            <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              {moduleContents.length}{" "}
              {moduleContents.length === 1 ? "file" : "files"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading files...</span>
          </div>
        ) : moduleContents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No files uploaded yet
            </h4>
            <p className="text-gray-500 text-sm">
              Upload your first learning material using the form above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {moduleContents.map((content, index) => (
              <div
                key={content.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-all">
                    <FileText
                      className={`w-6 h-6 ${getFileIconColor(content.file_type)}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <p className="font-semibold text-gray-900 truncate">
                        {content.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="bg-white px-2 py-1 rounded border border-gray-200">
                        {content.file_type}
                      </span>
                      <span>{formatFileSize(content.file_size)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleOpen(content.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md hover:shadow-md cursor-pointer"
                    title="Open file in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Open</span>
                  </button>
                  <button
                    onClick={() => handleDeleteFile(content.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-md hover:shadow-md cursor-pointer"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {moduleContents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">
              {moduleContents.length}
            </p>
            <p className="text-sm text-gray-600">Total Files</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-700">
              {moduleContents.filter((c) => c.file_type?.includes("pdf")).length}
            </p>
            <p className="text-sm text-gray-600">PDF Documents</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">
              {moduleContents.filter((c) => c.file_type?.includes("doc")).length}
            </p>
            <p className="text-sm text-gray-600">Word Documents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerModuleDetailsTab;