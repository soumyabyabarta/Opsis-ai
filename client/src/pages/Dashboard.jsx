import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Image, Zap, Shield,
  Clock, ChevronRight, AlertCircle, CheckCircle, Loader2, X
} from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { useFileProcessor } from '../hooks/useFileProcessor';
import { analyzeReport } from '../services/api';

const recentReportsMock = [
  { id: 'demo1', fileName: 'Blood_Panel_March.pdf', score: 82, date: '2 hours ago', status: 'completed' },
  { id: 'demo2', fileName: 'Vitamin_Report.pdf', score: 91, date: 'Yesterday', status: 'completed' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { sessionId } = useSession();
  const { processFile, processing, progress, error: processError } = useFileProcessor();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [step, setStep] = useState('idle'); // idle | processing | analyzing | done | error

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setUploadError('');

    if (rejectedFiles?.length > 0) {
      setUploadError('Invalid file type. Please upload a PDF, JPG, or PNG.');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setUploadError('🚫 File too large. Max size is 1MB — try compressing your PDF first.');
      return;
    }

    setUploadedFile(file);
    setStep('processing');

    try {
      // Step 1: Extract text
      const { text, fileName, fileType } = await processFile(file);

      // Step 2: Send to AI
      setStep('analyzing');
      setUploading(true);

      const res = await analyzeReport({ extractedText: text, fileName, fileType });
      const reportId = res.data.report._id;

      setStep('done');
      setTimeout(() => navigate(`/report/${reportId}`), 800);
    } catch (err) {
      setStep('error');
      setUploadError(err.response?.data?.message || err.message || 'Analysis failed. Please try again.');
      setUploading(false);
    }
  }, [processFile, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: step === 'processing' || step === 'analyzing',
  });

  const resetUpload = () => {
    setStep('idle');
    setUploadedFile(null);
    setUploadError('');
    setUploading(false);
  };

  return (
    // FIX APPLIED HERE: Added overflow-x-hidden w-full max-w-[100vw]
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-[100vw] p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-black text-text">Upload Report</h1>
        <p className="text-text-muted mt-1.5">Securely analyse your medical documents with AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone — main */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
                  {...getRootProps()}
                  className={`relative rounded-3xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer
                            transition-all duration-300 min-h-[340px]
                            ${isDragActive
                              ? 'border-primary bg-primary/5 shadow-glow scale-[1.01]'
                              : 'border-primary/30 bg-white hover:border-primary hover:bg-primary/3 hover:shadow-card'
                            }`}
                >
                  <input {...getInputProps()} />

                  <motion.div
                    animate={{ y: isDragActive ? -8 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5"
                  >
                    <Upload size={32} className="text-primary" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-text mb-2">
                    {isDragActive ? 'Drop it here ✨' : 'Drag & Drop your report'}
                  </h3>
                  <p className="text-text-muted text-sm mb-6 max-w-xs">
                    Upload PDF, JPG, or PNG medical reports for instant AI-powered analysis
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    className="btn-primary"
                  >
                    <Upload size={16} />
                    Browse Files
                  </motion.button>

                  <p className="mt-4 text-xs text-text-muted">Maximum file size: 1MB</p>
                </div>

                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3"
                  >
                    <AlertCircle size={18} className="text-rose-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-rose-700">{uploadError}</p>
                    <button onClick={() => setUploadError('')} className="ml-auto text-rose-400 hover:text-rose-600">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {(step === 'processing' || step === 'analyzing') && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl bg-white border border-primary/15 p-12 flex flex-col items-center justify-center min-h-[340px] text-center"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {step === 'processing'
                      ? <FileText size={24} className="text-primary" />
                      : <Zap size={24} className="text-primary animate-pulse" />
                    }
                  </div>
                </div>

                <h3 className="text-xl font-bold text-text mb-2">
                  {step === 'processing' ? 'Extracting text...' : 'AI is analysing your report...'}
                </h3>
                <p className="text-text-muted text-sm mb-6">
                  {step === 'processing'
                    ? 'Reading your document with precision'
                    : 'Running clinical analysis with Opsis AI'
                  }
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-text-muted mb-1.5">
                    <span>{step === 'processing' ? 'Text extraction' : 'AI analysis'}</span>
                    <span>{step === 'analyzing' ? '...' : `${progress}%`}</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: step === 'analyzing' ? '85%' : `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <p className="mt-6 text-xs text-text-muted">{uploadedFile?.name}</p>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl bg-primary/5 border border-primary/25 p-12 flex flex-col items-center justify-center min-h-[340px] text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-5 shadow-glow">
                  <CheckCircle size={36} color="white" />
                </div>
                <h3 className="text-2xl font-bold text-text mb-2">Analysis Complete!</h3>
                <p className="text-text-muted">Redirecting to your report...</p>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl bg-rose-50 border border-rose-200 p-12 flex flex-col items-center justify-center min-h-[340px] text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-5">
                  <AlertCircle size={28} className="text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">Analysis Failed</h3>
                <p className="text-rose-600 text-sm mb-6 max-w-xs">{uploadError}</p>
                <button onClick={resetUpload} className="btn-primary">
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-4">
          {/* Accepted formats */}
          <div className="card-flat">
            <h3 className="font-semibold text-text text-sm mb-4">Accepted Formats</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: FileText, label: 'PDF', desc: 'Lab reports, prescriptions' },
                { icon: Image, label: 'JPG / PNG', desc: 'Scanned documents, photos' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-card">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{label}</p>
                    <p className="text-xs text-text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="card-flat bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Your privacy is sacred</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Files are processed in real-time and never stored on our servers.
              Your session auto-expires in 24h. No account needed.
            </p>
          </div>

          {/* Quick actions */}
          <div className="card-flat">
            <h3 className="font-semibold text-text text-sm mb-3">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/symptoms')}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 text-left transition-colors group"
              >
                <span className="text-sm font-medium text-text">Check Symptoms</span>
                <ChevronRight size={15} className="text-text-muted group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 text-left transition-colors group"
              >
                <span className="text-sm font-medium text-text">Privacy Settings</span>
                <ChevronRight size={15} className="text-text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-text mb-4">Recent Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentReportsMock.map((report) => (
            <motion.div
              key={report.id}
              whileHover={{ y: -2 }}
              className="card cursor-pointer"
              onClick={() => navigate(`/report/${report.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">{report.fileName}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <Clock size={10} />
                      {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{report.score}</p>
                    <p className="text-xs text-text-muted">/ 100</p>
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}