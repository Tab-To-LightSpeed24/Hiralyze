import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { NeonCard, NeonCardContent, NeonCardHeader, NeonCardTitle } from '@/components/NeonCard';
import { cn } from '@/lib/utils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <NeonCard className="w-full max-w-md">
        <NeonCardHeader>
          <NeonCardTitle className="text-center">Sign In / Sign Up</NeonCardTitle>
        </NeonCardHeader>
        <NeonCardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]} // No third-party providers by default
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))', // Neon green for brand color
                    brandAccent: 'hsl(var(--primary-foreground))', // Dark text on neon
                    defaultButtonBackground: 'hsl(var(--secondary)/30%)', // Darker button background
                    defaultButtonBackgroundHover: 'hsl(var(--primary)/10%)', // Subtle neon hover
                    defaultButtonBorder: 'hsl(var(--primary)/50%)', // Neon border
                    inputBackground: 'hsl(var(--secondary)/30%)',
                    inputBorder: 'hsl(var(--primary)/50%)',
                    inputFocusBorder: 'hsl(var(--primary))',
                    inputText: 'hsl(var(--foreground))',
                    inputPlaceholder: 'hsl(var(--muted-foreground))',
                    messageText: 'hsl(var(--foreground))',
                    messageBackground: 'hsl(var(--secondary)/20%)',
                    anchorTextColor: 'hsl(var(--primary))',
                    anchorTextHoverColor: 'hsl(var(--primary)/80%)',
                  },
                },
              },
            }}
            theme="dark" // Explicitly set dark theme for Auth UI
            redirectTo={window.location.origin} // Redirect to home after auth
          />
        </NeonCardContent>
      </NeonCard>
    </div>
  );
};

export default Login;