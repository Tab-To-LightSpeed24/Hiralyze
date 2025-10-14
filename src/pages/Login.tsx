import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from '@/components/LoginForm';
import SignUpForm from '@/components/SignUpForm';

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
        className="flex w-full max-w-4xl h-auto min-h-[600px] md:h-[600px] rounded-lg shadow-2xl overflow-hidden bg-background border border-primary/20 flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center w-full md:w-1/2 p-12 text-foreground bg-background border-r border-primary/30 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full shadow-neon-glow animate-pulse"></div>
          <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-primary/10 rounded-lg transform rotate-45 shadow-neon-glow animate-pulse animation-delay-300"></div>
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4 text-primary text-neon-glow">Welcome to Hiralyze</h1>
            <p className="text-lg text-muted-foreground">
              Intelligently parse resumes and match them against job descriptions to find the perfect candidate, faster.
            </p>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/30 border border-primary/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-neon-glow">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-neon-glow">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;