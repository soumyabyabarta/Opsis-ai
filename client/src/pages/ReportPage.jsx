import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download, Share2, ArrowLeft, AlertTriangle, CheckCircle,
  Pill, Lightbulb, Clock, Activity, Loader2, Shield, ChevronDown, ChevronUp
} from 'lucide-react';
import { getReport } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ── Sub-components ──────────────────────────────────────────────────────────

function HealthScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#D1FAE5" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-black text-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-text-muted font-medium">/100</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Low: 'badge-low',
    High: 'badge-high',
    Borderline: 'badge-borderline',
    Critical: 'badge-critical',
  };
  return <span className={map[status] || 'badge-normal'}>{status}</span>;
}

function ShimmerCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-primary/10 rounded-full w-1/3 mb-3" />
      <div className="h-3 bg-primary/10 rounded-full w-full mb-2" />
      <div className="h-3 bg-primary/10 rounded-full w-4/5" />
    </div>
  );
}

const DEMO_REPORT = {
  _id: 'demo1',
  fileName: 'Blood_Panel_March.pdf',
  analysis: {
    healthScore: 82,
    scoreLabel: 'Good',
    scoreDescription: 'Optimal range with minor deviations detected.',
    summary: 'Patient exhibits generally robust metabolic function. However, current panels indicate a slight deficiency in Vitamin D synthesis and marginally suppressed Hemoglobin levels relative to historical baselines. Recommended course involves targeted supplementation and increased dietary iron intake. No acute anomalies present in current hepatic or renal panels.',
    confidence: 94,
    flaggedValues: [
      { name: 'Vitamin D', value: '22 ng/mL', normalRange: '30–100 ng/mL', status: 'Low', description: 'Below optimal level, may affect bone health and immunity.' },
      { name: 'Hemoglobin', value: '13.2 g/dL', normalRange: '13.5–17.5', status: 'Low', description: 'Marginally suppressed, consider iron supplementation.' },
      { name: 'LDL Cholesterol', value: '115 mg/dL', normalRange: '<100 mg/dL', status: 'Borderline', description: 'Slightly elevated, monitor dietary fat intake.' },
    ],
    normalValues: [
      { name: 'Glucose', value: '92 mg/dL' },
      { name: 'HbA1c', value: '5.4%' },
      { name: 'Creatinine', value: '0.9 mg/dL' },
      { name: 'ALT', value: '22 U/L' },
    ],
    medicines: [
      { name: 'Vitamin D3 (2000 IU/day)', purpose: 'Correct vitamin D deficiency', icon: '☀️' },
      { name: 'Iron supplement', purpose: 'Support hemoglobin levels', icon: '💊' },
      { name: 'Omega-3 fatty acids', purpose: 'Support cardiovascular health', icon: '🐟' },
    ],
    recommendations: [
      { text: 'Increase dietary iron intake (leafy greens, legumes, red meat)', priority: 'High', icon: '🥗' },
      { text: 'Increase daily hydration to at least 2.5L', priority: 'Medium', icon: '💧' },
      { text: 'Get 15–20 min of daily sunlight for natural Vitamin D', priority: 'Medium', icon: '🌞' },
      { text: 'Reduce saturated fat intake to improve LDL levels', priority: 'High', icon: '🥩' },
    ],
    followUp: 'Re-evaluate panels in 90 days. Schedule a consultation with your GP.',
    disclaimers: 'This analysis is AI-generated for informational purposes only. Always consult a qualified healthcare professional before making any medical decisions.',
  },
  createdAt: new Date().toISOString(),
};

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (id === 'demo1' || id === 'demo2') {
        setReport(DEMO_REPORT);
        setLoading(false);
        return;
      }
      try {
        const res = await getReport(id);
        setReport(res.data.report);
      } catch (err) {
        setReport(DEMO_REPORT);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#F9FAFB' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`opsis-report-${id}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-primary/10 rounded-xl shimmer" />
          <div className="h-8 w-64 bg-primary/10 rounded-xl shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <ShimmerCard key={i} />)}
        </div>
      </div>
    );
  }

  const { analysis, fileName, createdAt } = report;

  return (
    // Applied layout fixes: Added overflow and full width handling
    <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-[100vw] p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-text-muted hover:text-primary text-sm font-medium mb-2 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
          <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
            AI Report Summary
          </p>
          {/* Responsive Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-text break-words">{fileName}</h1>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-1.5">
            <Clock size={12} />
            {new Date(createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={exportPDF}
            disabled={exporting}
            className="btn-secondary text-sm py-2.5 px-4"
          >
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </motion.button>
          <button className="btn-secondary text-sm py-2.5 px-4">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Report content to export */}
      <div ref={reportRef} className="w-full">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center text-center p-4 sm:p-6 w-full overflow-hidden"
          >
            <h2 className="text-lg sm:text-xl font-bold text-text mb-5 self-start">Overall Health</h2>
            <HealthScoreRing score={analysis.healthScore} />
            <div className="mt-4">
              <p className="font-bold text-base sm:text-lg text-text">{analysis.scoreLabel}</p>
              <p className="text-text-muted text-xs sm:text-sm mt-1">{analysis.scoreDescription}</p>
            </div>
          </motion.div>

          {/* Clinical Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4 sm:p-6 w-full overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-text">Clinical Summary</h2>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1 self-start sm:self-auto">
                ✨ AI Generated
              </span>
            </div>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">{analysis.summary}</p>
            <p className="mt-4 text-[10px] sm:text-xs text-text-muted flex items-center gap-1.5 pt-4 border-t border-primary/10">
              <Shield size={11} className="text-primary" />
              Generated from report · Confidence: {analysis.confidence}%
            </p>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 w-full">
          {/* Flagged Biomarkers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4 sm:p-6 w-full overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-text">Flagged Biomarkers</h2>
            </div>

            <div className="flex flex-col gap-3">
              {analysis.flaggedValues.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  // Fixed flex layout for biomarkers on mobile
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-primary/3 border border-primary/10 w-full"
                >
                  <div className="w-full">
                    <p className="font-semibold text-text text-sm break-words">{flag.name}</p>
                    <p className="text-xs text-text-muted break-words">{flag.value}</p>
                  </div>
                  <div className="self-start sm:self-auto">
                    <StatusBadge status={flag.status} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Normal values toggle */}
            {analysis.normalValues?.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  {showAll ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {showAll ? 'Hide' : 'View'} {analysis.normalValues.length} normal values
                </button>
                {showAll && (
                  <div className="mt-3 flex flex-col gap-2">
                    {analysis.normalValues.map((v, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-primary/5">
                        <span className="text-xs font-medium text-text break-words">{v.name}</span>
                        <span className="badge-normal self-start sm:self-auto">{v.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Suggested Regimen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4 sm:p-6 w-full overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-5">
              <Pill size={18} className="text-primary flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-text">Suggested Regimen</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {analysis.medicines.map((med, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-primary/5 border border-primary/15 text-[11px] sm:text-sm font-medium text-text-muted"
                >
                  <span>{med.icon}</span>
                  <span className="truncate">{med.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-2">
              {analysis.recommendations.map((rec, i) => (
                // Adjusted recommendation items to wrap properly on mobile
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 p-2.5 rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="flex items-start gap-2 w-full">
                     <span className="text-base flex-shrink-0">{rec.icon}</span>
                     <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed flex-1">{rec.text}</p>
                  </div>
                  <span className={`self-start sm:self-auto sm:ml-auto flex-shrink-0 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium
                    ${rec.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}
                  >
                    {rec.priority}
                  </span>
                </div>
              ))}
            </div>

            {/* Follow-up */}
            {analysis.followUp && (
              <div className="mt-4 p-3 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-2">
                <Clock size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">{analysis.followUp}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-3 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 w-full"
        >
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] sm:text-xs text-amber-700 leading-relaxed">{analysis.disclaimers}</p>
        </motion.div>
      </div>
    </div>
  );
}