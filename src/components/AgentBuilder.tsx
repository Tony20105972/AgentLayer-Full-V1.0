
import React, { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, Node } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';

import NodeLibrary from './NodeLibrary';
import PropertyPanel from './PropertyPanel';
import PromptInputArea from './PromptInputArea';
import ExecutionPanel from './ExecutionPanel';
import SlackWebhookModal from './SlackWebhookModal';
import ReportCard from './ReportCard';
import WorkflowCanvas from './WorkflowCanvas';
import NodeHighlighter from './NodeHighlighter';
import { initialNodes, initialEdges } from './initialElements';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import { usePromptToBlocks } from '@/hooks/usePromptToBlocks';

const AgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSlackModal, setShowSlackModal] = useState(false);
  
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
    return await executeWorkflow(nodes, edges);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Prompt Input Area */}
      <PromptInputArea 
        onPromptSubmit={handlePromptSubmit}
        isLoading={isGenerating}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
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

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 flex flex-col shadow-sm">
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

      {/* Bottom Execution Panel */}
      <ExecutionPanel
        onExecute={handleExecute}
        onReplay={handleReplay}
        isExecuting={isExecuting}
        isReplaying={isReplaying}
        lastResult={lastResult}
        onOpenSlackModal={() => setShowSlackModal(true)}
      />

      {/* Slack Webhook Modal */}
      <SlackWebhookModal
        isOpen={showSlackModal}
        onClose={() => setShowSlackModal(false)}
        executionResult={lastResult}
      />
    </div>
  );
};

export default AgentBuilder;
