import React, { useRef, useState } from 'react';
import { Upload, FileText, X, Loader2, Check, List } from 'lucide-react';
import { TransactionFormData } from '../../types/transactions';

interface TransactionHistoryUploaderProps {
  onExtractedTransactions: (data: TransactionFormData[]) => void;
  onClose: () => void;
}

const TransactionHistoryUploader: React.FC<TransactionHistoryUploaderProps> = ({ onExtractedTransactions, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionFormData[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('history', file);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/receipts/process-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('expToken')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process transaction history');
      }
      setSuccess(true);
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction history');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (transactions) {
      onExtractedTransactions(transactions);
      onClose();
    }
  };

  // Only overlay the file input on the drop area, not the whole dialog
  const DropArea = () => (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-colors ${
        error ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/5'
      }`}
      style={{ position: 'relative' }}
      onClick={e => {
        if (!file && e.target === e.currentTarget && fileInputRef.current) fileInputRef.current.click();
      }}
    >
      {!file ? (
        <div className="flex flex-col items-center">
          <Upload size={48} className="text-gray-500 mb-3" />
          <p className="text-gray-300 mb-3">Click to upload your transaction history PDF</p>
          <p className="text-gray-500 text-sm">Supported format: PDF (tabular format)</p>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            tabIndex={-1}
            style={{ zIndex: 2 }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative mb-3 flex items-center justify-center bg-gray-800 rounded-lg p-8">
            <FileText size={48} className="text-gray-400" />
            <button 
              type="button"
              onClick={e => {
                e.stopPropagation();
                setFile(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-300">{file.name}</p>
          <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-auto bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-2xl w-full max-w-2xl border border-gray-800/40">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Upload Transaction History</h2>
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
          <p>Upload a PDF containing your transaction history in tabular format. The system will extract and import the transactions.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <DropArea />
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && transactions && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-4 flex items-center">
              <Check size={18} className="mr-2" />
              Transactions extracted! Review below and confirm to import.
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-indigo-400 mb-4">
              <Loader2 size={18} className="animate-spin" />
              Processing PDF...
            </div>
          )}
          {transactions && transactions.length > 0 && (
            <div className="max-h-64 overflow-y-auto mb-4 border border-gray-700 rounded-lg bg-[#1e293b]/40">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-[#0f172a] text-indigo-300">
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => (
                    <tr key={idx} className="border-b border-gray-800">
                      <td className="py-2 px-3 text-white">{t.title}</td>
                      <td className="py-2 px-3 text-white">₹{t.amount}</td>
                      <td className="py-2 px-3 text-white">{t.type}</td>
                      <td className="py-2 px-3 text-white">{t.date}</td>
                      <td className="py-2 px-3 text-white">{t.category}</td>
                      <td className="py-2 px-3 text-white">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            {!transactions && (
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
                    <List size={18} />
                    Process PDF
                  </>
                )}
              </button>
            )}
            {transactions && (
              <button
                type="button"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition shadow-lg hover:shadow-green-500/20 flex items-center gap-2"
                onClick={handleConfirm}
              >
                <Check size={18} /> Confirm & Import
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionHistoryUploader; 