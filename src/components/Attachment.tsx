import {
  Upload,
  Trash2,
  Eye,
  Download,
  FileText,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { COLORS } from '../constants/colors';

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
    window.open(file.url, '_blank');
  };

  const handleRemoveFile = (id: string) => {
    if (window.confirm('Are you sure you want to remove this attachment?')) {
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
    const link = document.createElement('a');
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
      setError('File size exceeds 2MB limit.');
      e.target.value = '';
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
    e.target.value = '';
  };

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden rounded-sm border p-0"
      style={{
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
      }}>
      <div
        className="flex cursor-pointer select-none items-center justify-between p-3"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: COLORS.white,
          borderBottom: isOpen ? `1px solid ${COLORS.border}` : 'none',
        }}>
        <span className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
          Attachment
        </span>
        <div style={{ color: COLORS.textSecondary }}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="flex h-32 flex-col sm:flex-row">
          <div
            className="flex w-full flex-col items-start justify-center border-r p-3 sm:w-48"
            style={{
              borderColor: COLORS.border,
              backgroundColor: COLORS.white,
            }}>
            {error ? (
              <span
                className="mb-3 flex items-center gap-1 text-[10px]"
                style={{ color: COLORS.danger }}>
                <AlertCircle size={10} /> {error}
              </span>
            ) : (
              <span className="mb-3 text-[10px]" style={{ color: COLORS.danger }}>
                Attachment Size should Not Exceed 2MB
              </span>
            )}

            <div
              className="flex h-full w-full items-center justify-center rounded border border-dashed"
              style={{
                borderColor: COLORS.borderDark,
                backgroundColor: COLORS.background,
              }}>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              />
              <button
                onClick={handleButtonClick}
                className="custom-upload-btn flex items-center gap-1 rounded-sm px-3 py-1 text-xs text-white shadow-sm"
                style={{ color: COLORS.white }}>
                <Upload size={12} /> Select file
              </button>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col" style={{ backgroundColor: COLORS.white }}>
            <div
              className="flex h-7 items-center text-xs"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
              <div
                className="flex h-full w-8 items-center justify-center border-r"
                style={{ borderColor: COLORS.primaryHover }}>
                <Download size={10} />
              </div>
              <div
                className="flex h-full w-8 items-center justify-center border-r"
                style={{ borderColor: COLORS.primaryHover }}>
                <Eye size={10} />
              </div>
              <div
                className="flex h-full w-8 items-center justify-center border-r"
                style={{ borderColor: COLORS.primaryHover }}>
                <Trash2 size={10} />
              </div>
              <div className="flex h-full flex-1 items-center overflow-hidden px-2 font-medium">
                FileName
              </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: COLORS.white }}>
              {attachments.length === 0 ? (
                <div
                  className="flex h-full items-center justify-center text-xs italic"
                  style={{ color: COLORS.textMuted }}>
                  No files attached
                </div>
              ) : (
                attachments.map((file) => (
                  <div
                    key={file.id}
                    className="custom-row flex h-7 items-center border-b text-xs"
                    style={{ borderColor: COLORS.background }}>
                    <div
                      className="flex h-full w-8 items-center justify-center border-r"
                      style={{ borderColor: COLORS.border }}>
                      <button
                        onClick={() => handleDownload(file)}
                        className="hover-icon-primary"
                        title="Download"
                        style={{ color: COLORS.textSecondary }}>
                        <Download size={12} />
                      </button>
                    </div>
                    <div
                      className="flex h-full w-8 items-center justify-center border-r"
                      style={{ borderColor: COLORS.border }}>
                      <button
                        onClick={() => handleOpen(file)}
                        className="hover-icon-primary"
                        title="Open"
                        style={{ color: COLORS.textSecondary }}>
                        <Eye size={12} />
                      </button>
                    </div>
                    <div
                      className="flex h-full w-8 items-center justify-center border-r"
                      style={{ borderColor: COLORS.border }}>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="hover-icon-danger"
                        title="Remove"
                        style={{ color: COLORS.danger }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div
                      className="flex h-full flex-1 items-center gap-2 truncate px-2"
                      style={{ color: COLORS.textPrimary }}>
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
