
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Download, ExternalLink, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import PaymentModal from './PaymentModal';
import NFTMintModal from './NFTMintModal';

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

interface ExecutionPanelProps {
  onExecute: () => Promise<ExecutionResult>;
  onReplay: (uuid: string) => void;
  isExecuting: boolean;
  isReplaying: boolean;
  lastResult?: ExecutionResult;
  onOpenSlackModal: () => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  onExecute,
  onReplay,
  isExecuting,
  isReplaying,
  lastResult,
  onOpenSlackModal
}) => {
  const { isConnected } = useAccount();
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(lastResult || null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [hasExecutionNFT, setHasExecutionNFT] = useState(false); // In production, check user's NFTs

  const handleExecuteClick = () => {
    if (!isConnected) {
      // Show wallet connection prompt
      return;
    }
    
    if (hasExecutionNFT) {
      // User has NFT, execute directly
      handleExecute();
    } else {
      // Show payment modal
      setShowPaymentModal(true);
    }
  };

  const handleExecute = async () => {
    try {
      const result = await onExecute();
      setExecutionResult(result);
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };

  const handlePaymentSuccess = () => {
    setHasExecutionNFT(true);
    handleExecute();
  };

  const handleReplay = () => {
    if (executionResult?.uuid) {
      onReplay(executionResult.uuid);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6">
        <div className="flex items-center justify-between">
          {/* Execution Controls */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExecuteClick}
              disabled={isExecuting || isReplaying}
              className="flex items-center space-x-2 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{isConnected ? 'Run Agent' : 'Connect Wallet to Run'}</span>
                </>
              )}
            </Button>

            {executionResult && (
              <Button
                variant="outline"
                onClick={handleReplay}
                disabled={isExecuting || isReplaying}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isReplaying ? 'Replaying...' : 'Replay'}</span>
              </Button>
            )}
          </div>

          {/* Results Summary */}
          {executionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-6"
            >
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(executionResult.totalScore)}`}>
                  {executionResult.totalScore}
                </div>
                <div className="text-xs text-gray-500">Total Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {executionResult.runTime}ms
                </div>
                <div className="text-xs text-gray-500">Run Time</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${executionResult.violations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {executionResult.violations.length}
                </div>
                <div className="text-xs text-gray-500">Violations</div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {executionResult.outputUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(executionResult.outputUrl, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenSlackModal}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Share</span>
                </Button>

                {isConnected && (
                  <Button
                    size="sm"
                    onClick={() => setShowNFTModal(true)}
                    className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Trophy className="w-3 h-3" />
                    <span>Mint NFT</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Violations Detail */}
        {executionResult && executionResult.violations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200"
          >
            <h4 className="text-sm font-semibold text-red-800 mb-2">Constitutional Violations</h4>
            <div className="space-y-2">
              {executionResult.violations.map((violation, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-red-700">Node: {violation.nodeId}</div>
                  <div className="text-red-600">{violation.description}</div>
                  <div className="text-red-500 italic">Suggestion: {violation.suggestion}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* NFT Mint Modal */}
      {executionResult && (
        <NFTMintModal
          isOpen={showNFTModal}
          onClose={() => setShowNFTModal(false)}
          executionResult={executionResult}
        />
      )}
    </>
  );
};

export default ExecutionPanel;
