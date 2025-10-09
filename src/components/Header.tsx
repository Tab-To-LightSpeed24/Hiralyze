import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoutButton from './LogoutButton';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="w-full bg-card border-b border-border p-4 flex items-center justify-between shadow-sm"
    >
      <Link to="/" className="flex items-center space-x-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-primary"
        >
          Hiralyze
        </motion.h1>
      </Link>
      <LogoutButton />
    </motion.header>
  );
};

export default Header;