import { FileText, Download, X } from "lucide-react";

const FileViewerModal = ({ isOpen, viewerData, onClose }) => {
  if (!isOpen || !viewerData) return null;

  const handleCloseModal = () => {
    if (viewerData.blobUrl) URL.revokeObjectURL(viewerData.blobUrl);
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = viewerData.fileUrl;
    link.download = viewerData.fileName || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] min-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {viewerData.fileName}
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-1 hover:bg-gray-100 rounded transition cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {viewerData.fileType?.toLowerCase().includes("pdf") ? (
            <iframe
              src={viewerData.fileUrl}
              className="w-full h-full border-none"
              style={{ minHeight: "600px" }}
              title={viewerData.fileName}
            />
          ) : (viewerData.fileType?.toLowerCase().includes("doc") || viewerData.fileType?.toLowerCase().includes("docx")) ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                📄 Document Preview
              </p>
              <div className="bg-white p-8 rounded-lg inline-block">
                <FileText className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <p className="text-gray-700 font-semibold mb-2">
                  {viewerData.fileName}
                </p>
                <p className="text-gray-600 mb-4">
                  Word documents cannot be previewed in the browser.
                </p>
                <p className="text-sm text-gray-500">
                  Please download the file to view it in Microsoft Word or another compatible application.
                </p>
              </div>
            </div>
          ) : (viewerData.fileType?.toLowerCase().includes("jpg") || viewerData.fileType?.toLowerCase().includes("jpeg") || viewerData.fileType?.toLowerCase().includes("png") || viewerData.fileType?.toLowerCase().includes("gif") || viewerData.fileType?.toLowerCase().includes("webp")) ? (
            <div className="flex items-center justify-center min-h-[600px] p-6 bg-gray-100">
              <img
                src={viewerData.fileUrl}
                alt={viewerData.fileName}
                className="max-w-full max-h-[600px] rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <div className="p-6 text-center min-h-[600px] flex items-center justify-center">
              <div>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  This file type cannot be previewed in the browser.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please download the file to view it.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-2 justify-end">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
