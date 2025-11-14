// src/components/Upload.jsx
import React, { useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload, MdClose, MdPlayArrow } from "react-icons/md";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per file
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function fileIsValid(file) {
  if (!file) return false;
  if (!ACCEPTED_TYPES.includes(file.type)) return false;
  if (file.size > MAX_FILE_SIZE) return false;
  return true;
}

export default function Upload() {
  const [files, setFiles] = useState([]); // { file, previewUrl, type }
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const processFiles = useCallback((fileList) => {
    setError("");
    const incoming = Array.from(fileList).slice(0, 6); // limit to 6 files
    const validated = [];

    incoming.forEach((f) => {
      if (!fileIsValid(f)) {
        setError(
          "Unsupported file or too large (max 50MB). Supported: JPG/PNG/WEBP/GIF and MP4/WEBM/MOV."
        );
        return;
      }

      const isImage = f.type.startsWith("image/");
      const previewUrl = URL.createObjectURL(f);

      validated.push({ file: f, previewUrl, isImage });
    });

    // append but avoid duplicates by name+size
    setFiles((prev) => {
      const merged = [...prev];
      validated.forEach((v) => {
        const exists = merged.some(
          (m) => m.file.name === v.file.name && m.file.size === v.file.size
        );
        if (!exists) merged.push(v);
      });
      return merged.slice(0, 6);
    });
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onFileChange = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = null;
  };

  const removeFile = (idx) => {
    setFiles((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].previewUrl);
      next.splice(idx, 1);
      return next;
    });
    setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!files.length) {
      setError("Please upload at least one image or video to analyze.");
      return;
    }

    // Example: Prepare formData for backend
    const form = new FormData();
    files.forEach((fObj, i) => {
      form.append("files", fObj.file);
    });

    // TODO: Replace URL with your API endpoint
    try {
      // Example placeholder — replace with actual fetch to your backend
      // const res = await fetch("/api/analyze", { method: "POST", body: form });
      // const result = await res.json();

      // For now simulate success and navigate to results (modify as needed)
      navigate("/results", { state: { filesMeta: files.map((f) => f.file.name) } });
    } catch (err) {
      setError("Upload failed. Try again or check your network.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05040a] to-[#07040b] text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold">
              Upload Media <span className="text-[#b453ff]">for Analysis</span>
            </h2>
            <p className="text-gray-300 mt-1">
              Drag & drop or choose files. We accept images & videos (max 50MB each).
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-white/5"
          >
            ← Back Home
          </button>
        </div>

        {/* Upload card */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`col-span-2 rounded-2xl border-2 ${dragActive ? "border-[#b453ff]" : "border-gray-800"} bg-gradient-to-b from-[#0b0710] to-[#07040b] p-6 transition`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-full md:w-1/3">
                <div className="flex items-center justify-center w-full h-36 rounded-lg border border-dashed border-gray-700 bg-black/30">
                  <MdCloudUpload size={54} className="text-[#b453ff]" />
                </div>
              </div>

              <div className="flex-1">
                <div className="text-lg font-semibold">Drag & drop files here</div>
                <div className="text-sm text-gray-400 mt-2">
                  Images (JPG, PNG, WEBP, GIF) and Videos (MP4, WEBM, MOV). Max 50 MB each.
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <label
                    htmlFor="file"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#b453ff] cursor-pointer"
                  >
                    Choose Files
                  </label>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-white/5"
                  >
                    Browse
                  </button>

                  <input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>

                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                {/* Preview strip */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.length === 0 ? (
                    <div className="col-span-full text-gray-500 text-sm">No files yet — drop files or pick files to start.</div>
                  ) : (
                    files.map((fObj, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-800 bg-black/30">
                        {fObj.isImage ? (
                          <img
                            src={fObj.previewUrl}
                            alt={fObj.file.name}
                            className="w-full h-36 object-cover"
                          />
                        ) : (
                          <div className="w-full h-36 flex items-center justify-center bg-gradient-to-tr from-[#1b0f2b] to-[#0b0710]">
                            <MdPlayArrow size={42} className="text-[#b453ff]" />
                          </div>
                        )}

                        <div className="p-2 text-xs text-gray-300">
                          <div className="truncate">{fObj.file.name}</div>
                          <div className="text-gray-400 text-[11px] mt-1">{(fObj.file.size / (1024 * 1024)).toFixed(2)} MB</div>
                        </div>

                        <button
                          title="Remove file"
                          onClick={() => removeFile(idx)}
                          className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70"
                          aria-label={`Remove ${fObj.file.name}`}
                          type="button"
                        >
                          <MdClose size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: options & submit */}
          <aside className="rounded-2xl p-6 bg-gradient-to-b from-[#08050b] to-[#05040a] border border-gray-800 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold">Analysis Options</h3>
              <p className="text-gray-400 text-sm mt-1">Pick a quick profile for the analysis.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="checkbox checkbox-sm checkbox-primary" />
                <span className="text-sm">Deep AI provenance check</span>
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span className="text-sm">Metadata & EXIF extraction</span>
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span className="text-sm">Frame-level video scan</span>
              </label>
            </div>

            <div className="mt-auto">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#6b21a8] to-[#b453ff] font-semibold shadow-lg"
              >
                Start Analysis
              </button>

              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setError("");
                }}
                className="w-full mt-3 py-2 rounded-full border border-gray-700 text-gray-300 hover:bg-white/5"
              >
                Clear
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
