
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogIn, LogOut, User } from 'lucide-react';
import LoginForm from './LoginForm';

const AuthButton: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <Button disabled className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span>Loading...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{user.email?.split('@')[0] || 'User'}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <div className="font-medium text-green-800">Signed in as</div>
                <div className="text-sm text-green-600">{user.email}</div>
              </div>
            </div>
            <Button
              onClick={() => {
                signOut();
                setShowAuthModal(false);
              }}
              variant="destructive"
              className="w-full flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Samantha OS</DialogTitle>
        </DialogHeader>
        <LoginForm onSuccess={() => setShowAuthModal(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;
