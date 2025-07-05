
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';

import NodeLibrary from './NodeLibrary';
import PropertyPanel from './PropertyPanel';
import PromptInputArea from './PromptInputArea';
import ExecutionPanel from './ExecutionPanel';
import SlackWebhookModal from './SlackWebhookModal';
import ReportCard from './ReportCard';
import { nodeTypes } from './nodes';
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

  // Highlight current executing/replaying node
  useEffect(() => {
    setNodes(nds => nds.map(node => ({
      ...node,
      style: {
        ...node.style,
        border: currentStep === node.id 
          ? (isReplaying ? '3px solid #f59e0b' : '3px solid #3b82f6')
          : undefined,
        boxShadow: currentStep === node.id 
          ? (isReplaying ? '0 0 20px rgba(245, 158, 11, 0.5)' : '0 0 20px rgba(59, 130, 246, 0.5)')
          : undefined
      }
    })));
  }, [currentStep, isReplaying, setNodes]);

  // Highlight nodes based on execution results
  useEffect(() => {
    setNodes(nds => nds.map(node => {
      const nodeStep = executionSteps.find(step => step.nodeId === node.id);
      
      if (nodeStep) {
        let borderColor = '#3b82f6';
        let shadowColor = 'rgba(59, 130, 246, 0.4)';
        
        if (nodeStep.status === 'success') {
          borderColor = '#10b981';
          shadowColor = 'rgba(16, 185, 129, 0.4)';
        } else if (nodeStep.status === 'error') {
          borderColor = '#ef4444';
          shadowColor = 'rgba(239, 68, 68, 0.4)';
        } else if (nodeStep.status === 'violation') {
          borderColor = '#f59e0b';
          shadowColor = 'rgba(245, 158, 11, 0.4)';
        }
        
        return {
          ...node,
          style: {
            ...node.style,
            border: currentStep === node.id ? node.style?.border : `2px solid ${borderColor}`,
            boxShadow: currentStep === node.id ? node.style?.boxShadow : `0 0 10px ${shadowColor}`
          }
        };
      }
      return node;
    }));
  }, [executionSteps, currentStep, setNodes]);

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

  const onConnect = useCallback(
    (params: Connection) => {
      const targetNode = nodes.find(n => n.id === params.target);
      const sourceNode = nodes.find(n => n.id === params.source);
      
      if (targetNode?.type === 'notifier') {
        const validSources = ['end', 'router'];
        if (sourceNode && validSources.includes(sourceNode.type)) {
          const edge = addEdge({
            ...params,
            type: 'smoothstep',
            style: { stroke: '#9b59b6', strokeWidth: 2 },
            label: params.sourceHandle && params.sourceHandle !== 'default' ? params.sourceHandle : undefined
          }, edges);
          setEdges(edge);
        }
      } else {
        const edge = addEdge({
          ...params,
          type: 'smoothstep',
          style: { stroke: '#3498db', strokeWidth: 2 },
          label: params.sourceHandle && params.sourceHandle !== 'default' ? params.sourceHandle : undefined
        }, edges);
        setEdges(edge);
      }
    },
    [setEdges, edges, nodes]
  );

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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-gradient-to-br from-slate-50 to-blue-50"
            snapToGrid={true}
            snapGrid={[20, 20]}
          >
            <Background 
              variant={BackgroundVariant.Dots}
              gap={20} 
              size={1} 
              color="#e2e8f0"
            />
            <Controls 
              className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg"
            />
            <MiniMap 
              nodeStrokeColor="#374151"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'start': return '#10b981';
                  case 'agent': return '#3b82f6';
                  case 'router': return '#f59e0b';
                  case 'ruleChecker': return '#10b981';
                  case 'end': return '#6b7280';
                  case 'notifier': return '#8b5cf6';
                  default: return '#f9fafb';
                }
              }}
              nodeBorderRadius={8}
              pannable
              zoomable
              className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg"
            />
          </ReactFlow>

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
