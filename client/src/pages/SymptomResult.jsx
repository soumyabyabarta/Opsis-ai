import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Stethoscope, ShieldAlert, AlertTriangle, ThumbsUp, Home } from 'lucide-react';
import Navbar from '../components/Navbar'; 

const URGENCY_CONFIG = {
  Emergency: { color: 'rose', icon: ShieldAlert, text: 'Emergency' },
  Urgent: { color: 'orange', icon: AlertTriangle, text: 'Urgent' },
  Moderate: { color: 'amber', icon: AlertCircle, text: 'Moderate' },
  Low: { color: 'emerald', icon: ThumbsUp, text: 'Low — Monitor' },
};

export default function SymptomResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  if (!result) return <Navigate to="/symptoms" replace />;

  const urgency = URGENCY_CONFIG[result.urgencyLevel] || URGENCY_CONFIG['Low'];

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden w-full max-w-[100vw] pb-20">
      <Navbar /> 
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:gap-5"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-black text-text">Triage Results</h1>
            <p className="text-text-muted mt-2">Here is what Opsis AI thinks based on your symptoms.</p>
          </div>

          {/* Urgency Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl flex items-start gap-3 sm:gap-4 bg-${urgency.color}-50 border border-${urgency.color}-200`}>
            <urgency.icon size={24} className={`text-${urgency.color}-600 mt-0.5 shrink-0`} />
            <div>
              <p className={`font-bold text-base sm:text-lg text-${urgency.color}-700 mb-1`}>
                Urgency: {urgency.text}
              </p>
              <p className={`text-sm sm:text-base leading-relaxed text-${urgency.color}-600`}>{result.summary}</p>
            </div>
          </div>

          {/* Possible Conditions */}
          {result.possibleConditions?.length > 0 && (
            <div className="card p-4 sm:p-6 mt-2">
              <h3 className="font-bold text-text text-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-500" />
                Possible Conditions
              </h3>
              <div className="flex flex-col gap-3">
                {result.possibleConditions.map((c, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-primary/3 border border-primary/10">
                    <div>
                      <p className="font-semibold text-text text-base">{c.name}</p>
                      <p className="text-sm sm:text-base text-text-muted leading-relaxed mt-1">{c.description}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 self-start sm:ml-2
                      ${c.probability === 'High' ? 'bg-rose-50 text-rose-600' :
                        c.probability === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'}`}
                    >
                      {c.probability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Self Care & Immediate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {result.immediateActions?.length > 0 && (
              <div className="card-flat p-4 sm:p-5">
                <h4 className="font-semibold text-text text-base mb-3 flex items-center gap-2">
                  ⚡ Immediate Actions
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {result.immediateActions.map((a, i) => (
                    <li key={i} className="text-sm sm:text-base text-text-muted flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.selfCareAdvice?.length > 0 && (
              <div className="card-flat p-4 sm:p-5">
                <h4 className="font-semibold text-text text-base mb-3 flex items-center gap-2">
                  🌿 Self Care
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {result.selfCareAdvice.map((a, i) => (
                    <li key={i} className="text-sm sm:text-base text-text-muted flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* When to see doctor */}
          {result.whenToSeeDoctor && (
            <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3 mt-2">
              <Stethoscope size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-primary mb-1">When to see a doctor</p>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">{result.whenToSeeDoctor}</p>
              </div>
            </div>
          )}

          <p className="text-xs sm:text-sm text-text-muted/80 text-center leading-relaxed mt-4">
            ⚕️ {result.disclaimers}
          </p>

          {/* GenZ Home Button */}
          <div className="mt-10 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-primary/20 text-text font-bold shadow-sm hover:border-primary hover:text-primary transition-all"
            >
              <Home size={18} />
              Back to base, no cap 💅
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}