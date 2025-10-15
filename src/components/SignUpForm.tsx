import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NeonButton } from '@/components/NeonButton';
import { showError, showSuccess } from '@/utils/toast';
import { motion } from 'framer-motion';

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
  },
};

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Check your email for a confirmation link!');
    }
    setLoading(false);
  };

  return (
    <motion.form 
      onSubmit={handleSignUp} 
      className="space-y-6 pt-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="signup-email" className="text-primary text-neon-glow">Email Address</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="signup-password" className="text-primary text-neon-glow">Create Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="signup-confirm-password" className="text-primary text-neon-glow">Confirm New Password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <NeonButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </NeonButton>
      </motion.div>
    </motion.form>
  );
};

export default SignUpForm;