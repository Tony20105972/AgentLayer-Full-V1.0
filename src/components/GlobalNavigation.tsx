
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Blocks, 
  BarChart3, 
  Store, 
  Vote,
  Shield,
  Menu,
  X,
  Wallet
} from 'lucide-react';
import WalletConnect from './WalletConnect';

const GlobalNavigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Builder', href: '/builder', icon: Blocks, description: 'Visual Agent Builder' },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Execution Monitor' },
    { name: 'Marketplace', href: '/marketplace', icon: Store, description: 'Agent Store' },
    { name: 'Constitution', href: '/constitution', icon: Shield, description: 'Rule Manager' },
    { name: 'DAO', href: '/dao', icon: Vote, description: 'Governance' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Blocks className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">AgentLayer</div>
              <div className="text-xs text-gray-500 -mt-1">Constitutional AI</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span>{item.name}</span>
                  {item.name === 'DAO' && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      Beta
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <WalletConnect />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.name === 'DAO' && (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            Beta
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GlobalNavigation;
