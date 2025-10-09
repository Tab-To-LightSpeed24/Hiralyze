import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useSession } from './SessionContextProvider';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';

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
    <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
      <LogOut className="h-5 w-5" />
    </Button>
  );
};

export default LogoutButton;