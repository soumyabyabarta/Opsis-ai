import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Loader2, AlertCircle, Zap, X } from 'lucide-react';
import { analyzeSymptoms } from '../services/api';

const QUICK_SYMPTOMS = [
  'Headache', 'Fever', 'Fatigue', 'Cough', 'Nausea',
  'Chest pain', 'Shortness of breath', 'Dizziness',
  'Back pain', 'Sore throat', 'Joint pain', 'Insomnia',
];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addSymptomPill = (sym) => {
    setSymptoms((prev) => {
      const trimmed = prev.trim();
      if (trimmed.includes(sym)) return prev;
      return trimmed ? `${trimmed}, ${sym}` : sym;
    });
  };

  const handleAnalyse = async () => {
    if (!symptoms.trim() || symptoms.trim().length < 5) {
      setError('Please describe your symptoms first.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await analyzeSymptoms(symptoms);
      // ম্যাজিক: ডেটা নিয়ে সোজা নতুন পেজে পাঠিয়ে দিচ্ছে!
      navigate('/symptom-result', { state: { result: res.data.analysis } });
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
      setLoading(false); // শুধু এরর হলেই লোডিং ফলস হবে, নাহলে নতুন পেজে চলে যাবে
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-[100vw] p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 text-center mt-6">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">AI Triage</p>
        <h1 className="text-3xl md:text-4xl font-black text-text">Symptom Checker</h1>
        <p className="text-sm sm:text-base text-text-muted mt-1.5">Describe how you feel for instant AI health guidance.</p>
      </div>

      {/* Center Form Container */}
      <div className="w-full max-w-2xl">
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Stethoscope size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-text text-lg">Symptom Analysis</h2>
              <p className="text-xs sm:text-sm text-text-muted">Describe in detail for best results</p>
            </div>
          </div>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe how you're feeling... e.g., I've had a persistent headache for two days with mild nausea and a low-grade fever."
            rows={5}
            className="input-field resize-none text-sm sm:text-base leading-relaxed mb-4"
          />

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
              Common Symptoms
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SYMPTOMS.map((sym) => (
                <motion.button
                  key={sym}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addSymptomPill(sym)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                    symptoms.includes(sym)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text-muted border-primary/20 hover:border-primary hover:text-primary'
                  }`}
                >
                  {sym}
                </motion.button>
              ))}
            </div>
          </div>

          {symptoms && (
            <button
              onClick={() => { setSymptoms(''); setError(''); }}
              className="mt-4 text-xs sm:text-sm text-text-muted hover:text-rose-500 flex items-center gap-1.5 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          )}

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm sm:text-base text-rose-600 flex items-center gap-1.5">
              <AlertCircle size={16} /> {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAnalyse}
            disabled={loading}
            className="btn-primary w-full justify-center mt-5 py-3.5 text-sm sm:text-base"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Analysing...</>
            ) : (
              <><Zap size={18} /> Analyse Symptoms</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}