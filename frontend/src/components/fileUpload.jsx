"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils"; // your existing utility for class merging
import { motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};
const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const fileTypeLabel = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "pdf":
      return "PDF";
    case "txt":
      return "Text";
    case "docx":
      return "Word";
    default:
      return ext.toUpperCase() || "File";
  }
};

export const FileUpload = ({ onChange, idToken }) => {
  const [filenames, setFilenames] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch the current list of filenames on mount
  useEffect(() => {
    if (!idToken) {
      // No token yet—skip
      return;
    }
    fetchFileList();
  }, []);

  const ACCEPTED_MIME_TYPES = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
  };

  const fetchFileList = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/uploads`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch file list");
      }
      const data = await res.json();
      setFilenames(data.filenames || []);
      onChange && onChange(data.filenames || []);
    } catch (err) {
      console.error(err);
      setError("Could not load uploaded files");
      setFilenames([]);
      onChange && onChange([]);
    }
  };

  // Handle a new file drop or selection
  const handleFileChange = async (newFiles) => {
    if (!newFiles.length) return;
    const file = newFiles[0];

    // Check MIME type client-side before uploading
    if (!Object.keys(ACCEPTED_MIME_TYPES).includes(file.type)) {
      setError("Unsupported file type. Only PDF, DOCX, and TXT allowed.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      // Refresh the list immediately
      await fetchFileList();
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: false,
    noClick: true,
    accept: ACCEPTED_MIME_TYPES,
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles),
    onDropRejected: (fileRejections) => {
      setError("Unsupported file type. Only PDF, DOCX, and TXT allowed.");
    },
  });

  // 3. Remove a file
  const removeFile = async (filenameToRemove) => {
    setError(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/upload/${encodeURIComponent(filenameToRemove)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Deletion failed");
      }
      // Refresh the list
      await fetchFileList();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not delete file");
    }
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block h-full w-full cursor-pointer overflow-hidden rounded-lg pb-5 pt-10"
      >
        <input
          {...getInputProps({
            accept: ".pdf,.docx,.txt",
          })}
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              handleFileChange(Array.from(e.target.files));
            }
          }}
          className="hidden"
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Upload files
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
            Drag or drop your files here or click to upload
          </p>

          <div className="relative mx-auto mt-10 max-h-[75vh] w-full max-w-xl overflow-y-auto px-7 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-900 dark:scrollbar-thumb-neutral-500">
            {/* Show any error */}
            {error && (
              <div className="mb-2 text-center text-red-600">{error}</div>
            )}

            {/* Show "Uploading..." placeholder */}
            {uploading && (
              <div className="mb-4 text-center text-gray-500">Uploading…</div>
            )}

            {/* List each filename with a delete button */}
            {filenames.length > 0 &&
              filenames.map((fname, idx) => (
                <div className="mb-4 flex items-center" key={fname + idx}>
                  <motion.div
                    key={`file-${idx}`}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className={cn(
                      "relative z-40 mx-auto flex w-full flex-col items-start justify-between overflow-hidden rounded-md bg-white p-4 md:h-16 dark:bg-neutral-900",
                      "shadow-sm",
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                      >
                        {fname}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white"
                      >
                        {fileTypeLabel(fname)}
                      </motion.p>
                    </div>
                  </motion.div>

                  <div className="ml-4 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fname);
                      }}
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition duration-200 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                </div>
              ))}

            {/* If no files and not uploading, show upload prompt */}
            {!filenames.length && !uploading && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-neutral-600"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!filenames.length && !uploading && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        }),
      )}
    </div>
  );
}
