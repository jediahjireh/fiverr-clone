// You need to import your FileRouter from your API.
// This assumes your FileRouter is in app/api/uploadthing/core.ts
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { UploadThingError } from "uploadthing/server";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

// This utility function is for direct client-side upload if needed,
// but UploadButton/Dropzone are preferred for UI integration.
export async function uploadFile(file: File): Promise<string> {
  try {
    const res = await uploadFiles("imageUploader", {
      files: [file],
      // input: undefined, // No specific input needed for this uploader
    });

    if (!res || res.length === 0) {
      throw new UploadThingError({
        code: "BAD_REQUEST",
        message: "No file uploaded or invalid response from UploadThing",
      });
    }

    return res[0].url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}
