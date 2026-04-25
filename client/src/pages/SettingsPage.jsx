import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Trash2, Clock, Eye, EyeOff,
  AlertTriangle, CheckCircle, Info, Lock, Zap
} from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { deleteSession } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { sessionId, sessionInfo, refresh } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showRawId, setShowRawId] = useState(false);

  const handleDeleteAll = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteSession();
      localStorage.removeItem('opsis_token');
      localStorage.removeItem('opsis_session');
      setDeleted(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const shortId = sessionId
    ? `${sessionId.substring(0, 8)}...${sessionId.slice(-4)}`
    : 'Loading...';

  const expiresAt = sessionInfo?.expiresAt
    ? new Date(sessionInfo.expiresAt).toLocaleString('en-IN')
    : '—';

  const cards = [
    {
      icon: Lock,
      title: 'Anonymous Session',
      desc: 'You are using Opsis completely anonymously. No name, email, or personal identifier is ever collected.',
      color: 'primary',
    },
    {
      icon: Trash2,
      title: '24h Auto-Deletion',
      desc: 'All uploaded reports and session data are permanently deleted from our servers after 24 hours.',
      color: 'amber',
    },
    {
      icon: Eye,
      title: 'Zero Data Sharing',
      desc: 'Your medical documents are never shared, sold, or used for training AI models.',
      color: 'slate',
    },
    {
      icon: Zap,
      title: 'Ephemeral Processing',
      desc: 'Text extraction happens in your browser. Analysis is sent to Gemini AI and immediately discarded.',
      color: 'violet',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Privacy & Data</p>
        <h1 className="text-3xl md:text-4xl font-black text-text">Settings</h1>
        <p className="text-text-muted mt-1.5">Your data, your control. Always.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Info */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield size={18} className="text-primary" />
              </div>
              <h2 className="font-bold text-text">Session Info</h2>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-primary/5">
                <p className="text-xs text-text-muted mb-1">Session ID</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-mono font-semibold text-text">
                    {showRawId ? sessionId : shortId}
                  </p>
                  <button
                    onClick={() => setShowRawId(!showRawId)}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    {showRawId ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-primary/5">
                <p className="text-xs text-text-muted mb-1">Reports Analysed</p>
                <p className="text-xl font-black text-primary">
                  {sessionInfo?.reportCount ?? 0}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                  <Clock size={11} /> Data Expires At
                </p>
                <p className="text-sm font-semibold text-text">{expiresAt}</p>
              </div>
            </div>

            {/* Delete All */}
            <div className="mt-6 pt-5 border-t border-primary/10">
              {deleted ? (
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <CheckCircle size={16} />
                  All data deleted. Redirecting...
                </div>
              ) : (
                <>
                  {confirmDelete && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-rose-500 mt-0.5" />
                        <p className="text-xs text-rose-700">
                          This will permanently delete all your reports and end your session.
                          This cannot be undone.
                        </p>
                      </div>
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDeleteAll}
                    disabled={deleting}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all
                      ${confirmDelete
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                      }`}
                  >
                    <Trash2 size={15} />
                    {deleting ? 'Deleting...' : confirmDelete ? 'Confirm Delete All' : 'Delete All My Data'}
                  </motion.button>
                  {confirmDelete && (
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="w-full mt-2 text-sm text-text-muted hover:text-text text-center"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Privacy Info Cards */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card"
              >
                <div className={`w-10 h-10 rounded-2xl bg-${color}-100 flex items-center justify-center mb-4`}>
                  <Icon size={18} className={`text-${color}-600`} />
                </div>
                <h3 className="font-bold text-text mb-1.5">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Data Policy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 card"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-primary" />
              <h3 className="font-bold text-text">Data Handling Policy</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {[
                { emoji: '🔐', label: 'No account required', sub: 'Ever' },
                { emoji: '🗑️', label: 'Auto-delete', sub: 'After 24 hours' },
                { emoji: '🚫', label: 'Never sold', sub: 'Zero data brokering' },
              ].map(({ emoji, label, sub }) => (
                <div key={label} className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="text-2xl mb-2">{emoji}</div>
                  <p className="text-sm font-semibold text-text">{label}</p>
                  <p className="text-xs text-text-muted">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
