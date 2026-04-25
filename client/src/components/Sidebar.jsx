import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Stethoscope, Settings, HelpCircle, X
} from 'lucide-react';
import OpsisLogo from './OpsisLogo';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Check Symptoms', to: '/symptoms', icon: Stethoscope },
];

const bottomItems = [
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Support', to: '#', icon: HelpCircle },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-primary/10 flex items-center justify-between">
        <OpsisLogo size="md" />
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-xl hover:bg-primary/10 text-text-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 pt-6 flex flex-col gap-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item'
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="px-4 pb-6 flex flex-col gap-1 border-t border-primary/10 pt-4">
        {bottomItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item'
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-primary/10 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-64 bg-white h-full shadow-2xl z-10"
          >
            <SidebarContent />
          </motion.aside>
        </div>
      )}
    </>
  );
}