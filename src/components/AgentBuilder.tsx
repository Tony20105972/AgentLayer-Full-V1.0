
import React, { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import NodeLibrary from './NodeLibrary';
import PropertyPanel from './PropertyPanel';
import PromptInputArea from './PromptInputArea';
import ExecutionPanel from './ExecutionPanel';
import SlackWebhookModal from './SlackWebhookModal';
import ReportCard from './ReportCard';
import WorkflowCanvas from './WorkflowCanvas';
import NodeHighlighter from './NodeHighlighter';
import ConstitutionUploader from './ConstitutionUploader';
import APIKeyModal from './APIKeyModal';
import { initialNodes, initialEdges } from './initialElements';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import { usePromptToBlocks } from '@/hooks/usePromptToBlocks';

const AgentBuilder = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [constitution, setConstitution] = useState('');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  
  const {
    isExecuting,
    isReplaying,
    currentStep,
    executionSteps,
    lastResult,
    executeWorkflow,
    replayExecution
  } = useWorkflowExecution();

  const { isGenerating, generateFromPrompt } = usePromptToBlocks();

  const handlePromptSubmit = async (prompt: string) => {
    try {
      const structure = await generateFromPrompt(prompt);
      setNodes(structure.nodes);
      setEdges(structure.edges);
    } catch (error) {
      console.error('Failed to generate workflow:', error);
    }
  };

  const handleExecute = async () => {
    // Check if API keys are configured
    const storedKeys = sessionStorage.getItem('agentlayer_api_keys');
    if (!storedKeys) {
      setShowAPIKeyModal(true);
      return;
    }

    try {
      const result = await executeWorkflow(nodes, edges, constitution, JSON.parse(storedKeys));
      // Navigate to run details page
      if (result.uuid) {
        navigate(`/run/${result.uuid}`);
      }
      return result;
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };

  const handleReplay = async (uuid: string) => {
    await replayExecution(uuid);
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (type !== 'notifier') {
        return;
      }

      const position = {
        x: event.clientX - 300,
        y: event.clientY - 200,
      };
      
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `Notifier`,
          config: {
            type: 'webhook',
            webhookUrl: '',
            channel: '',
            messageTemplate: 'Agent notification: {{message}}'
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Top Prompt Input Area */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <PromptInputArea 
          onPromptSubmit={handlePromptSubmit}
          isLoading={isGenerating}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-20">
        {/* Left Panel - Node Library */}
        <div className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-sm">
          <NodeLibrary />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />

          <NodeHighlighter
            nodes={nodes}
            setNodes={setNodes}
            currentStep={currentStep}
            isReplaying={isReplaying}
            executionSteps={executionSteps}
          />

          {/* Generation Status Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 flex items-center justify-center z-20"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-6 text-center"
                >
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <div className="text-lg font-semibold text-gray-900">Generating Workflow</div>
                  <div className="text-sm text-gray-600">
                    Analyzing prompt and creating blocks...
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Report Card Overlay */}
          <AnimatePresence>
            {lastResult && !isExecuting && !isReplaying && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute top-4 right-4 z-10 max-w-md"
              >
                <ReportCard executionResult={lastResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Constitution & Properties */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex flex-col shadow-sm">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <ConstitutionUploader
                constitution={constitution}
                onConstitutionChange={setConstitution}
              />
            </div>
            <div className="border-t border-gray-200">
              <PropertyPanel 
                selectedNode={selectedNode} 
                onUpdateNode={(nodeId, updates) => {
                  setNodes(nds => nds.map(node => 
                    node.id === nodeId ? { ...node, ...updates } : node
                  ));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Execution Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <ExecutionPanel
          onExecute={handleExecute}
          onReplay={handleReplay}
          isExecuting={isExecuting}
          isReplaying={isReplaying}
          lastResult={lastResult}
          onOpenSlackModal={() => setShowSlackModal(true)}
          onOpenAPIKeys={() => setShowAPIKeyModal(true)}
        />
      </div>

      {/* Modals */}
      <SlackWebhookModal
        isOpen={showSlackModal}
        onClose={() => setShowSlackModal(false)}
        executionResult={lastResult}
      />

      <APIKeyModal
        isOpen={showAPIKeyModal}
        onClose={() => setShowAPIKeyModal(false)}
        onSave={setApiKeys}
      />
    </div>
  );
};

export default AgentBuilder;
