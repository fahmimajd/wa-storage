import React, { useState } from 'react';
import axios from 'axios';

function Files() {
  const [senderNumber, setSenderNumber] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.post('http://10.11.10.10:5000/api/files', { senderNumber });
      setFiles(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch files: ' + err.message);
    }
  };

  const deleteFile = async (filePath) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete('http://10.11.10.10:5000/api/delete', {
          data: { file_path: filePath },
        });
        setFiles(files.filter((file) => file.file_path !== filePath));
        setPreviewFile(null);
      } catch (err) {
        setError('Failed to delete file: ' + err.message);
      }
    }
  };

  const previewFileHandler = (filePath) => {
    setPreviewFile(filePath);
  };

  const getPreviewFile = () => {
    return files.find((f) => f.file_path === previewFile);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Files</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={senderNumber}
            onChange={(e) => setSenderNumber(e.target.value)}
            placeholder="Enter your number (e.g., 628123456789)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchFiles}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Show Files
          </button>
        </div>

        {/* Daftar File */}
        <ul className="space-y-4">
          {files.map((file) => (
            <li key={file.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <span className="text-gray-700">{file.file_name}</span>
              <div className="space-x-2">
                <button
                  onClick={() => previewFileHandler(file.file_path)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Preview
                </button>
                <a
                  href={`http://10.11.10.10:5000/download?file_path=${encodeURI(file.file_path)}`}
                  download={file.file_name}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Download
                </a>
                <button
                  onClick={() => deleteFile(file.file_path)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              {(() => {
                const preview = getPreviewFile();
                return preview ? (
                  <img
                    src={`http://10.11.10.10:5000/storage/${senderNumber}/${preview.file_name}`}
                    alt="Preview"
                    className="max-w-full max-h-[70vh] mx-auto"
                    onError={() => setError('Failed to load preview')}
                  />
                ) : (
                  <p className="text-red-500">File not found for preview</p>
                );
              })()}
              <button
                onClick={() => setPreviewFile(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;