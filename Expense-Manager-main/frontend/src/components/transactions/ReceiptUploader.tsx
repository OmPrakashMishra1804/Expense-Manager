import React, { useRef, useState } from 'react';
import { Upload, FileText, Image, X, Loader2, Check } from 'lucide-react';
import { TransactionFormData } from '../../types/transactions';

interface ReceiptUploaderProps {
  onExtractedData: (data: Partial<TransactionFormData>) => void;
  onClose: () => void;
}

const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onExtractedData, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const fileType = selectedFile.type;
    if (!fileType.includes('image') && fileType !== 'application/pdf') {
      setError('Please upload an image or PDF file');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview for images
    if (fileType.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, just show an icon
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/receipts/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('expToken')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process receipt');
      }

      setSuccess(true);
      
      // Pass the extracted data to parent component
      onExtractedData({
        title: data.title || 'Receipt Expense',
        amount: data.amount || 0,
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'Others',
        description: data.description || `Receipt from ${data.vendor || 'unknown vendor'}`,
      });

      // Close after a short delay to show success state
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err: any) {
      console.error('Error processing receipt:', err);
      setError(err.message || 'Failed to process receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Manually trigger validation logic
      const fileType = droppedFile.type;
      if (!fileType.includes('image') && fileType !== 'application/pdf') {
        setError('Please upload an image or PDF file');
        return;
      }

      setFile(droppedFile);
      setError(null);

      // Create preview for images
      if (fileType.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        // For PDFs, just show an icon
        setPreview(null);
      }
    }
  };

  // Only overlay the file input on the drop area, not the whole dialog
  const DropArea = () => (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-colors ${
        error ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/5'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: 'relative' }}
      onClick={e => {
        // Only trigger file input if the click is directly on the drop area, not on the input
        if (!file && e.target === e.currentTarget && fileInputRef.current) fileInputRef.current.click();
      }}
    >
      {!file ? (
        <div className="flex flex-col items-center">
          <Upload size={48} className="text-gray-500 mb-3" />
          <p className="text-gray-300 mb-3">Drag & drop your receipt here or click to browse</p>
          <p className="text-gray-500 text-sm">Supported formats: JPEG, PNG, PDF</p>
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            onChange={handleFileChange}
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            tabIndex={-1}
            style={{ zIndex: 2 }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {preview ? (
            <div className="relative mb-3">
              <img src={preview} alt="Receipt preview" className="max-h-64 rounded-lg" />
              <button 
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="relative mb-3 flex items-center justify-center bg-gray-800 rounded-lg p-8">
              <FileText size={48} className="text-gray-400" />
              <button 
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <p className="text-gray-300">{file.name}</p>
          <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-2xl w-full max-w-2xl border border-gray-800/40">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Upload Receipt</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            disabled={loading}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-gray-300 mb-6">
          <p>Upload a receipt image or PDF to automatically extract transaction details.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <DropArea />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-4 flex items-center">
              <Check size={18} className="mr-2" />
              Receipt processed successfully! Creating transaction...
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2"
              disabled={!file || loading || success}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Image size={18} />
                  Process Receipt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptUploader; 