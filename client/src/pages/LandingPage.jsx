import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Zap, Shield, Clock, FileText,
  Activity, AlertTriangle, Brain, Pill, ChevronRight,
  Lock, Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { icon: Zap, label: '<10s Processing' },
  { icon: Shield, label: '0 Files Stored' },
  { icon: FileText, label: '1MB Max Size' },
  { icon: Clock, label: '24H Auto-Deletion' },
];

const features = [
  {
    icon: Brain,
    title: 'Plain English Summaries',
    description: 'Medical jargon decoded into actionable, easy-to-understand insights. Know exactly what your results mean for your health.',
    tag: 'Plain English',
    size: 'large',
  },
  {
    custom: 'score',
    title: '0–100 Health Score',
    description: 'A holistic view of your wellness baseline.',
    size: 'score',
  },
  {
    icon: AlertTriangle,
    title: 'Flagged Alerts',
    description: 'Instant identification of out-of-range markers or potential anomalies requiring attention.',
    color: 'rose',
    size: 'small',
  },
  {
    icon: Lock,
    title: 'Zero-Trace Privacy',
    description: 'Your data is yours. We process documents ephemerally. Nothing is stored, sold, or shared. Ever.',
    color: 'slate',
    size: 'small',
  },
  {
    icon: Pill,
    title: 'Medicine Insights',
    description: 'AI-suggested supplements and regimens based on your specific results.',
    size: 'medium',
  },
  {
    icon: Activity,
    title: 'Symptom Checker',
    description: 'Describe how you feel and get AI-powered triage guidance instantly.',
    size: 'medium',
  },
];

const howItWorks = [
  { step: '01', title: 'Upload Report', desc: 'Drop your PDF or image. We accept lab results, prescriptions, radiology notes, and more.' },
  { step: '02', title: 'AI Extraction', desc: 'Our engine reads and understands your medical data using OCR and natural language processing.' },
  { step: '03', title: 'Instant Insight', desc: 'Receive a clean health score, plain-English summary, flagged values, and actionable recommendations.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    /* Added w-full and max-w-[100vw] to strictly prevent horizontal scrolling */
    <div className="relative min-h-screen bg-bg overflow-x-hidden w-full max-w-[100vw]">
      <Navbar />

      {/* ── Hero ──────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        {/* Mesh gradient blobs */}
        <div className="blur-circle w-72 h-72 md:w-96 md:h-96 bg-primary/25 -top-20 -left-20" />
        <div className="blur-circle w-64 h-64 md:w-80 md:h-80 bg-primary-dark/20 top-40 right-0" />
        <div className="blur-circle w-48 h-48 md:w-64 md:h-64 bg-primary-light/60 bottom-20 left-1/4" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white border border-primary/30 shadow-card mb-6 sm:mb-8 mx-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-text-muted text-left">Opsis AI · Clinical Grade · Zero Data Stored</span>
          </motion.div>

          {/* Headline - Adjusted for mobile */}
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-7xl font-black text-text leading-[1.1] tracking-tight mb-4 px-2">
            Decode your health
            <br />
            <span className="text-gradient">In seconds</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-text-muted max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 px-4">
            Upload your lab results or medical documents. Our clinical AI extracts key insights,
            highlights anomalies, and provides a clear summary — no medical degree required.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 px-4 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(16,185,129,0.35)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/dashboard')}
              className="btn-cta text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              Start Free Analysis
              <ArrowRight size={18} />
            </motion.button>
            <button 
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} 
              className="btn-secondary text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              See how it works
              <ChevronRight size={16} />
            </button>
          </motion.div>

          {/* Trust stats */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
            {stats.map(({ icon: Icon, label }) => (
              <div key={label} className="stat-pill text-xs sm:text-sm px-3 py-1.5">
                <Icon size={14} className="text-primary shrink-0" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Bento ────────────────────── */}
      <section id="features" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text mb-4">
                Everything you need to<br className="hidden sm:block" />
                <span className="text-gradient sm:ml-2">understand your health</span>
              </h2>
              <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto px-4">
                From blood panels to radiology — one upload, complete clarity.
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large card */}
              <motion.div variants={fadeUp} className="lg:col-span-2 card group relative overflow-hidden p-5 sm:p-6 md:p-8">
                <div className="absolute top-4 right-4">
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] sm:text-xs font-semibold">Plain English</span>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Brain size={24} className="text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text mb-2">Plain English Summaries</h3>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Medical jargon decoded into actionable, easy-to-understand insights.
                  Know exactly what your results mean for your health.
                </p>
                <div className="mt-6 p-3 sm:p-4 rounded-2xl bg-primary/5 border border-primary/15 text-xs sm:text-sm text-text-muted italic">
                  "Patient exhibits generally robust metabolic function. Minor Vitamin D deficiency noted — consider supplementation."
                </div>
              </motion.div>

              {/* Score card */}
              <motion.div variants={fadeUp} className="card flex flex-col items-center justify-center text-center group p-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#D1FAE5" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" strokeWidth="8"
                      strokeDasharray="264" strokeDashoffset="46" strokeLinecap="round"
                      className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-black text-text">92</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-text">0–100 Health Score</h3>
                <p className="text-text-muted text-xs sm:text-sm mt-1">A holistic view of your wellness baseline.</p>
              </motion.div>

              {/* Alert card */}
              <motion.div variants={fadeUp} className="card p-5 sm:p-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                  <AlertTriangle size={20} className="text-rose-500" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text mb-2">Flagged Alerts</h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  Instant identification of out-of-range markers or potential anomalies requiring attention.
                </p>
              </motion.div>

              {/* Privacy card */}
              <motion.div variants={fadeUp} className="card p-5 sm:p-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Shield size={20} className="text-slate-500" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text mb-2">Zero-Trace Privacy</h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  Your data is yours. We process documents ephemerally.
                  Nothing is stored, sold, or shared.
                </p>
              </motion.div>

              {/* Meds card */}
              <motion.div variants={fadeUp} className="card p-5 sm:p-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Pill size={20} className="text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text mb-2">Medicine Insights</h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  AI-suggested supplements and regimens based on your specific results.
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── How it Works ──────────────────────── */}
      <section id="how-it-works" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text mb-4">
                From upload to insight<br className="hidden sm:block" />
                <span className="text-gradient sm:ml-2">in three steps</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
              {/* Connecting line - Hidden on mobile */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

              {howItWorks.map(({ step, title, desc }) => (
                <motion.div key={step} variants={fadeUp} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-primary text-white flex items-center justify-center mb-4 sm:mb-6 shadow-glow text-xl sm:text-2xl font-black relative z-10">
                    {step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-text mb-2 sm:mb-3">{title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed max-w-xs">{desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Privacy Section ───────────────────── */}
      <section id="privacy" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="glass-dark p-6 sm:p-10 md:p-14 text-center">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-[10px] sm:text-xs font-medium border border-white/20 mb-6">
                <Lock size={12} className="shrink-0" />
                <span className="tracking-wide">NO ACCOUNT NEEDED. EVER.</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
                Take control. Today.
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-8 max-w-lg mx-auto">
                Anonymous by design. Your sessions expire in 24h. We never see your name,
                email, or personal data.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                {[
                  { icon: Shield, text: 'No sign-up required' },
                  { icon: Trash2, text: 'Auto-deleted in 24h' },
                  { icon: Lock, text: 'End-to-end encrypted' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs sm:text-sm">
                    <Icon size={13} className="shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-glow hover:bg-primary-dark transition-all"
              >
                Start Now
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}