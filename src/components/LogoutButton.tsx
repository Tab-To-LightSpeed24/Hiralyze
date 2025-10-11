import React from 'react';
import { LogOut } from 'lucide-react';
import { useSession } from './SessionContextProvider';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';
import { NeonButton } from './NeonButton'; // Import NeonButton

const LogoutButton: React.FC = () => {
  const { supabase } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Failed to log out: ' + error.message);
    } else {
      showSuccess('You have been logged out.');
      navigate('/login');
    }
  };

  return (
    <NeonButton variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
      <LogOut className="h-5 w-5" />
    </NeonButton>
  );
};

export default LogoutButton;