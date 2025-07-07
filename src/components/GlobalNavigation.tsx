
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Store, Trophy, Wallet } from 'lucide-react';
import WalletConnect from './WalletConnect';

const GlobalNavigation: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/builder', icon: Bot, label: 'Builder' },
    { to: '/marketplace', icon: Store, label: 'Marketplace' },
    { to: '/dao', icon: Trophy, label: 'DAO' },
  ];

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Main Navigation Hub */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AL</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">AgentLayer</h1>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Web3 AI OS
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Wallet */}
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
};

export default GlobalNavigation;
