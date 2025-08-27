import { useEffect, useState } from "react";
import * as API from "@/apis/index";
import { Button } from "@/components/ui/button";
import type { UserDocument } from "@/utils/types";
import { FiUpload } from "react-icons/fi";
import { uploadPDF } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { selectUserData } from "@/reducers/auth/authSlice";
export default function EmployeeDocuments() {
  const userData = useSelector(selectUserData)
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch uploaded documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.getMyDocuments();
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload PDF to Firebase & backend
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    if (file.type !== "application/pdf") return alert("Only PDF files allowed");

    try {
      setUploading(true);
      const userId = userData._id; // get currently logged-in user ID
      if (!userId) {
        alert("User ID not found. Please log in again.");
        setUploading(false);
        return;
      }
      const fileUrl = await uploadPDF(file, userId);

      // Save document info to backend
      const uploadedDoc = await API.uploadDocument({
        fileName: file.name,
        filePath: fileUrl,
        mimeType: file.type,
      });

      setDocuments((prev) => [...prev, uploadedDoc.data]);
      setFile(null);
      alert("Document uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Documents
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
        <label className="flex items-center gap-2 cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition">
          <FiUpload className="text-xl" />
          <span>{file ? file.name : "Choose a PDF file"}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
        </label>
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Error / Loading */}
      {loading && <p className="text-gray-500 text-center">Loading documents...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Documents List */}
      {documents.length === 0 ? (
        <p className="text-gray-500 text-center">No documents uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.filePath}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div className="truncate font-medium text-gray-800">{doc.fileName}</div>
              <a
                href={doc.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
