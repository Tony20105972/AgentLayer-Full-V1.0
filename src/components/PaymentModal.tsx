
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { motion } from 'framer-motion';
import { Zap, CreditCard, Crown } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  executionCost?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  executionCost = '0.005'
}) => {
  const { address } = useAccount();
  const [paymentType, setPaymentType] = useState<'single' | 'nft'>('single');
  const { sendTransaction, data: hash } = useSendTransaction();
  const [isProcessing, setIsProcessing] = useState(false);

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    if (!address) return;
    
    setIsProcessing(true);
    try {
      const amount = paymentType === 'single' ? executionCost : '0.05'; // NFT costs more
      
      await sendTransaction({
        to: '0x742d35Cc6634C0532925a3b8D7389f4C3a5efF8e', // Treasury address
        value: parseEther(amount),
      });
      
      // Simulate successful payment
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Execute Agent</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Choose your execution method:
          </div>
          
          {/* Single Execution Option */}
          <motion.div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              paymentType === 'single' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentType('single')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Single Execution</div>
                  <div className="text-xs text-gray-500">Pay per run</div>
                </div>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {executionCost} ETH
              </div>
            </div>
          </motion.div>

          {/* Execution NFT Option */}
          <motion.div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              paymentType === 'nft' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentType('nft')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">Execution NFT</div>
                  <div className="text-xs text-gray-500">Unlimited runs for 30 days</div>
                </div>
              </div>
              <div className="text-lg font-bold text-purple-600">
                0.05 ETH
              </div>
            </div>
          </motion.div>

          <Button
            onClick={handlePayment}
            disabled={!address || isProcessing || isConfirming}
            className="w-full flex items-center space-x-2"
          >
            {isProcessing || isConfirming ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>
                  {paymentType === 'single' 
                    ? `Pay ${executionCost} ETH & Execute` 
                    : 'Mint Execution NFT'
                  }
                </span>
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            10% goes to DAO treasury • Gas fees apply
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
