import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoutButton from './LogoutButton';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={cn(
        "w-full bg-background border-b border-primary/30 p-4 flex items-center justify-between shadow-lg shadow-primary/10",
        "relative z-20" // Ensure header is above other content
      )}
    >
      <Link to="/" className="flex items-center space-x-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold text-primary text-neon-glow tracking-wider"
        >
          Hiralyze
        </motion.h1>
      </Link>
      <nav className="flex items-center space-x-6">
        <Link 
          to="/about" 
          className="text-muted-foreground hover:text-primary transition-colors text-lg relative group"
        >
          About Scoring
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
        </Link>
        <LogoutButton />
      </nav>
    </motion.header>
  );
};

export default Header;