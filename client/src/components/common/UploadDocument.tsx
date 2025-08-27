// pages/common/UploadDocument.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPDF } from "@/utils/helpers";
import * as API from "@/apis/index";
import { useSelector } from "react-redux";

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.auth.userData);

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
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload PDF"}
      </Button>
    </div>
  );
}
