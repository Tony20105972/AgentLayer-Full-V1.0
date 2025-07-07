
import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span>{formatAddress(address)}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Connected</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <div className="font-medium text-green-800">Connected Address</div>
                <div className="text-sm text-green-600 font-mono">{address}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-green-600 hover:text-green-700"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={() => {
                disconnect();
                setShowWalletModal(false);
              }}
              variant="destructive"
              className="w-full flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect Wallet</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                setShowWalletModal(false);
              }}
              variant="outline"
              className="w-full flex items-center justify-center space-x-3 p-4 h-auto"
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">{connector.name}</span>
            </Button>
          ))}
        </div>
        <div className="text-xs text-gray-500 text-center mt-4">
          By connecting, you agree to our Terms of Service
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;
