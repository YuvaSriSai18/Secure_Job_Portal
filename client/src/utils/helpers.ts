import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadPDF = async (file: File, userId: string) => {
  if (!file || file.type !== "application/pdf") {
    throw new Error("Only PDF files allowed");
  }
  const fileRef = ref(storage, `documents/${userId}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
