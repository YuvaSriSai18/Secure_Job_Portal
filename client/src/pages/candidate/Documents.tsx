import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPDF } from "@/utils/helpers";
import * as API from "@/apis/index";
import { useSelector } from "react-redux";

export interface UserDocument {
  _id?: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export default function CandidateDocuments() {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.auth.userData);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.getMyDocuments();
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload PDF
  const handleUpload = async () => {
    if (!file) return alert("Select a PDF");
    try {
      setLoading(true);
      const url = await uploadPDF(file, user._id);
      await API.uploadDocument({
        fileName: file.name,
        filePath: url,
        mimeType: file.type,
      });
      alert("Uploaded successfully ✅");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const handleDelete = async (docId: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      setLoading(true);
      await API.deleteDocument(docId);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">My Documents</h2>

      {/* Upload */}
      <div className="bg-white p-4 rounded-md shadow space-y-2">
        <Input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload PDF"}
        </Button>
      </div>

      {/* List Documents */}
      <div className="bg-white p-4 rounded-md shadow space-y-2">
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc._id || doc.filePath}
                className="flex justify-between items-center"
              >
                <span>{doc.fileName}</span>
                <div className="flex gap-2">
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(doc._id!)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
