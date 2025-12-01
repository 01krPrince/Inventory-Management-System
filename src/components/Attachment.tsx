import {
  Upload,
  Trash2,
  Eye,
  Download,
  FileText,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { COLORS } from "../constants/colors";

const Attachment: React.FC = () => {
  interface AttachedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }

  // State for collapse functionality
  const [isOpen, setIsOpen] = useState(true);

  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleOpen = (file: AttachedFile) => {
    window.open(file.url, "_blank");
  };

  const handleRemoveFile = (id: string) => {
    if (window.confirm("Are you sure you want to remove this attachment?")) {
      setAttachments((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.url);
        }
        return prev.filter((file) => file.id !== id);
      });
    }
  };

  const handleDownload = (file: AttachedFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("File size exceeds 2MB limit.");
      e.target.value = "";
      return;
    }

    setError(null);

    const newFile: AttachedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    };

    setAttachments((prev) => [...prev, newFile]);
    e.target.value = "";
  };

  return (
    <div
      className="flex-1 border p-0 rounded-sm flex flex-col overflow-hidden"
      style={{
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
      }}
    >
      {/* Header / Toggle Section */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: COLORS.white,
          borderBottom: isOpen ? `1px solid ${COLORS.border}` : "none",
        }}
      >
        <span
          className="font-semibold text-sm"
          style={{ color: COLORS.textPrimary }}
        >
          Attachment
        </span>
        <div style={{ color: COLORS.textSecondary }}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="flex flex-col sm:flex-row h-32">
          {/* 1. File Upload Area */}
          <div
            className="w-full sm:w-48 border-r p-3 flex flex-col justify-center items-start"
            style={{
              borderColor: COLORS.border,
              backgroundColor: COLORS.white,
            }}
          >
            {/* Conditional Error or Info Message */}
            {error ? (
              <span
                className="text-[10px] mb-3 flex items-center gap-1"
                style={{ color: COLORS.danger }}
              >
                <AlertCircle size={10} /> {error}
              </span>
            ) : (
              <span
                className="text-[10px] mb-3"
                style={{ color: COLORS.danger }}
              >
                Attachment Size should Not Exceed 2MB
              </span>
            )}

            <div
              className="border border-dashed rounded w-full h-full flex items-center justify-center"
              style={{
                borderColor: COLORS.borderDark,
                backgroundColor: COLORS.background,
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              />
              <button
                onClick={handleButtonClick}
                className="custom-upload-btn text-white text-xs px-3 py-1 rounded-sm flex items-center gap-1 shadow-sm"
                style={{ color: COLORS.white }}
              >
                <Upload size={12} /> Select file
              </button>
            </div>
          </div>

          {/* 2. File Table Area */}
          <div
            className="flex-1 flex flex-col min-w-0"
            style={{ backgroundColor: COLORS.white }}
          >
            {/* Table Header */}
            <div
              className="text-xs flex h-7 items-center"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
            >
              <div
                className="w-8 border-r h-full flex items-center justify-center"
                style={{ borderColor: COLORS.primaryHover }}
              >
                <Download size={10} />
              </div>
              <div
                className="w-8 border-r h-full flex items-center justify-center"
                style={{ borderColor: COLORS.primaryHover }}
              >
                <Eye size={10} />
              </div>
              <div
                className="w-8 border-r h-full flex items-center justify-center"
                style={{ borderColor: COLORS.primaryHover }}
              >
                <Trash2 size={10} />
              </div>
              <div className="flex-1 px-2 font-medium flex items-center h-full overflow-hidden">
                FileName
              </div>
            </div>

            {/* Table Body */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ backgroundColor: COLORS.white }}
            >
              {attachments.length === 0 ? (
                <div
                  className="h-full flex items-center justify-center text-xs italic"
                  style={{ color: COLORS.textMuted }}
                >
                  No files attached
                </div>
              ) : (
                attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex h-7 items-center border-b text-xs custom-row"
                    style={{ borderColor: COLORS.background }}
                  >
                    <div
                      className="w-8 border-r h-full flex items-center justify-center"
                      style={{ borderColor: COLORS.border }}
                    >
                      <button
                        onClick={() => handleDownload(file)}
                        className="hover-icon-primary"
                        title="Download"
                        style={{ color: COLORS.textSecondary }}
                      >
                        <Download size={12} />
                      </button>
                    </div>
                    <div
                      className="w-8 border-r h-full flex items-center justify-center"
                      style={{ borderColor: COLORS.border }}
                    >
                      <button
                        onClick={() => handleOpen(file)}
                        className="hover-icon-primary"
                        title="Open"
                        style={{ color: COLORS.textSecondary }}
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                    <div
                      className="w-8 border-r h-full flex items-center justify-center"
                      style={{ borderColor: COLORS.border }}
                    >
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="hover-icon-danger"
                        title="Remove"
                        style={{ color: COLORS.danger }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div
                      className="flex-1 px-2 flex items-center gap-2 truncate h-full"
                      style={{ color: COLORS.textPrimary }}
                    >
                      <FileText
                        size={12}
                        className="flex-shrink-0"
                        style={{ color: COLORS.textMuted }}
                      />
                      <span className="truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SCOPED STYLES --- */}
      <style>{`
        .custom-upload-btn {
          background-color: ${COLORS.primary};
          transition: background-color 0.2s;
        }
        .custom-upload-btn:hover {
          background-color: ${COLORS.primaryHover};
        }
        .custom-row:hover {
          background-color: ${COLORS.background} !important;
        }
        .hover-icon-primary:hover {
          color: ${COLORS.primary} !important;
        }
        .hover-icon-danger:hover {
          color: #b91c1c !important;
        }
      `}</style>
    </div>
  );
};

export default Attachment;
