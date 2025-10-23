import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        className="flex w-full max-w-md rounded-lg shadow-2xl overflow-hidden bg-card border border-primary/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full p-8 md:p-12 flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-primary text-neon-glow mb-8 text-center"
          >
            Smart Resume Screener
          </motion.h2>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))', // Neon Green
                    brandAccent: 'hsl(var(--accent))', // A slightly different neon green for accent
                    brandButtonText: 'hsl(var(--primary-foreground))', // Dark text on neon
                    
                    defaultButtonBackground: 'hsl(var(--secondary))', // Darker grey for buttons
                    defaultButtonBackgroundHover: 'hsl(var(--secondary) / 0.8)', // Slightly lighter hover
                    defaultButtonBorder: 'hsl(var(--border))', // Dark border
                    defaultButtonText: 'hsl(var(--foreground))', // Light text
                    
                    inputBackground: 'hsl(var(--input))', // Dark input background
                    inputBorder: 'hsl(var(--border))', // Dark input border
                    inputBorderHover: 'hsl(var(--primary))', // Neon green on hover
                    inputBorderFocus: 'hsl(var(--ring))', // Neon green focus ring
                    inputText: 'hsl(var(--foreground))', // Light text
                    inputLabelText: 'hsl(var(--muted-foreground))', // Muted text
                    inputPlaceholder: 'hsl(var(--muted-foreground))', // Muted placeholder
                  },
                  radii: {
                    borderRadiusButton: 'var(--radius)',
                    buttonBorderRadius: 'var(--radius)',
                    inputBorderRadius: 'var(--radius)',
                  },
                },
              },
            }}
            theme="dark" // Set theme to dark
            redirectTo={window.location.origin}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;