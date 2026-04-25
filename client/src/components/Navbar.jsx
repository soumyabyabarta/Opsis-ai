import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OpsisLogo from './OpsisLogo';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <OpsisLogo size="md" />
        </Link>
        
        {/* All menus and buttons have been removed for a minimal look */}
      </div>
    </motion.header>
  );
}