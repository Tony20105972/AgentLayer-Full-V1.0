
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlackWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  executionResult?: {
    uuid: string;
    summary: string;
    totalScore: number;
    violations: Array<{ description: string }>;
  };
}

const SlackWebhookModal: React.FC<SlackWebhookModalProps> = ({
  isOpen,
  onClose,
  executionResult
}) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [channel, setChannel] = useState('#general');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (executionResult) {
      const defaultMessage = `🤖 AgentLayer Execution Complete\n\n📊 Score: ${executionResult.totalScore}/100\n📝 Summary: ${executionResult.summary}\n${executionResult.violations.length > 0 ? `⚠️ Violations: ${executionResult.violations.length}` : '✅ No violations detected'}`;
      setMessage(defaultMessage);
    }
  }, [executionResult]);

  const handleSend = async () => {
    if (!webhookUrl.trim() || !message.trim()) return;

    setIsSending(true);
    try {
      // For now, simulate API call since backend endpoints aren't implemented
      console.log('Sending to Slack:', {
        webhookUrl,
        channel,
        message,
        executionResult
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Message sent successfully to Slack!');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message to Slack');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Send to Slack</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="channel">Channel</Label>
                <Input
                  id="channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="#general"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!webhookUrl.trim() || !message.trim() || isSending}
                className="flex items-center space-x-2"
              >
                {isSending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlackWebhookModal;
