import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ReportPage from './pages/ReportPage';
import SymptomChecker from './pages/SymptomChecker';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './layouts/DashboardLayout';
import SymptomResult from './pages/SymptomResult';

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/symptom-result" element={<SymptomResult />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
