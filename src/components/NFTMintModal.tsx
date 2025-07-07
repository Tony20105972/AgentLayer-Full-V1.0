
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Download, Share2, ExternalLink } from 'lucide-react';

interface ExecutionResult {
  uuid: string;
  violations: Array<{
    nodeId: string;
    ruleId: string;
    description: string;
    suggestion: string;
  }>;
  summary: string;
  totalScore: number;
  runTime: number;
  outputUrl?: string;
  timestamp: number;
}

interface NFTMintModalProps {
  isOpen: boolean;
  onClose: () => void;
  executionResult: ExecutionResult;
}

const NFTMintModal: React.FC<NFTMintModalProps> = ({ 
  isOpen, 
  onClose, 
  executionResult 
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);
    
    // Simulate NFT minting process
    try {
      // In production, this would call Thirdweb SDK or custom contract
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMintSuccess(true);
      setIsMinting(false);
    } catch (error) {
      console.error('Minting failed:', error);
      setIsMinting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (mintSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">NFT Minted Successfully!</h3>
              <p className="text-sm text-gray-600">Your execution has been immortalized on the blockchain</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-2">Token ID</div>
              <div className="font-mono text-sm">#12847</div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on OpenSea
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Mint Execution NFT</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Card */}
          <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold">AL</span>
              </div>
              
              <div>
                <h4 className="font-semibold">AgentLayer Execution</h4>
                <p className="text-xs text-gray-600">#{executionResult.uuid.slice(-8)}</p>
              </div>

              <div className="flex justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className={`font-bold ${getScoreColor(executionResult.totalScore)}`}>
                    {executionResult.totalScore}
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {executionResult.runTime}ms
                  </div>
                  <div className="text-xs text-gray-500">Runtime</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${executionResult.violations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {executionResult.violations.length}
                  </div>
                  <div className="text-xs text-gray-500">Violations</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge variant={executionResult.violations.length > 0 ? "destructive" : "default"}>
                  {executionResult.violations.length > 0 ? 'Has Violations' : 'Clean Execution'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Metadata Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Execution timestamp and results stored on IPFS</div>
            <div>• NFT proves ownership of this execution</div>
            <div>• Can be traded on secondary markets</div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleMint}
              disabled={isMinting}
              className="w-full flex items-center space-x-2"
            >
              {isMinting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Minting NFT...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>Mint Execution NFT</span>
                </>
              )}
            </Button>

            {executionResult.outputUrl && (
              <Button variant="outline" className="w-full" asChild>
                <a href={executionResult.outputUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report First
                </a>
              </Button>
            )}
          </div>

          <div className="text-xs text-gray-400 text-center">
            Minting cost: ~$5-15 in gas fees
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFTMintModal;
