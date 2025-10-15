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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div 
        className="flex w-full max-w-4xl h-[600px] rounded-lg shadow-2xl overflow-hidden bg-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-12 text-white bg-gradient-to-br from-purple-600 to-pink-500 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-white/10 rounded-lg transform rotate-45"></div>
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to Hiralyze</h1>
            <p className="text-lg text-purple-200">
              Intelligently parse resumes and match them against job descriptions to find the perfect candidate, faster.
            </p>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">USER LOGIN</h2>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8B5CF6', // purple-500
                    brandAccent: '#EC4899', // pink-500
                    brandButtonText: 'white',
                    defaultButtonBackground: 'white',
                    defaultButtonBackgroundHover: '#f3f4f6', // gray-100
                    defaultButtonBorder: '#d1d5db', // gray-300
                    defaultButtonText: '#374151', // gray-700
                    inputBackground: '#f3f4f6', // gray-100
                    inputBorder: '#d1d5db', // gray-300
                    inputBorderHover: '#a5b4fc', // indigo-300
                    inputBorderFocus: '#8B5CF6', // purple-500
                    inputText: '#111827', // gray-900
                    inputLabelText: '#4b5563', // gray-600
                    inputPlaceholder: '#9ca3af', // gray-400
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
            }}
            theme="light"
            redirectTo={window.location.origin}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;