
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import NodeLibrary from './NodeLibrary';
import PropertyPanel from './PropertyPanel';
import TopInputArea from './TopInputArea';
import BottomStatusArea from './BottomStatusArea';
import ExportModal from './ExportModal';
import { nodeTypes } from './nodes';
import { initialNodes, initialEdges } from './initialElements';
import { useExecutionFlow } from '@/hooks/useExecutionFlow';

const AgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Top input area configuration
  const [globalConfig, setGlobalConfig] = useState({
    apiKey: '',
    purpose: '',
    description: '',
    rules: ['Never share personal information', 'Avoid harmful content', 'Respect privacy']
  });

  // Constitution violations state
  const [violations, setViolations] = useState<Array<{ nodeId: string; message: string; ruleId: string }>>([]);

  const {
    isExecuting,
    currentNodeId,
    executionSteps,
    executionPath,
    startExecution,
    stopExecution,
    clearExecution
  } = useExecutionFlow();

  // Highlight current executing node
  useEffect(() => {
    setNodes(nds => nds.map(node => ({
      ...node,
      style: {
        ...node.style,
        border: currentNodeId === node.id ? '3px solid #3b82f6' : undefined,
        boxShadow: currentNodeId === node.id ? '0 0 20px rgba(59, 130, 246, 0.5)' : undefined
      }
    })));
  }, [currentNodeId, setNodes]);

  // Highlight nodes based on execution results and violations
  useEffect(() => {
    setNodes(nds => nds.map(node => {
      const nodeStep = executionSteps.find(step => step.nodeId === node.id);
      const hasViolation = violations.some(v => v.nodeId === node.id);
      
      if (hasViolation) {
        return {
          ...node,
          style: {
            ...node.style,
            border: '3px solid #ef4444',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
          }
        };
      }
      
      if (nodeStep) {
        let borderColor = '#3b82f6';
        if (nodeStep.status === 'success') borderColor = '#10b981';
        else if (nodeStep.status === 'failure') borderColor = '#ef4444';
        else if (nodeStep.status === 'violation') borderColor = '#f59e0b';
        
        return {
          ...node,
          style: {
            ...node.style,
            border: `2px solid ${borderColor}`,
            boxShadow: `0 0 10px ${borderColor}40`
          }
        };
      }
      return node;
    }));
  }, [executionSteps, violations, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Allow connections only if target is notifier, end, or router
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
        // Allow connections for the main flow
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

      // Only allow notifier nodes to be dropped
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

  const executeWorkflow = async () => {
    await startExecution(nodes, edges);
  };

  const handleExportMCP = () => {
    setShowExportModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Input Area */}
      <TopInputArea 
        config={globalConfig}
        onConfigChange={setGlobalConfig}
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
              variant="dots" 
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

          {/* Execution Status Overlay */}
          {isExecuting && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg font-semibold text-gray-900">Executing Agent Workflow</div>
                <div className="text-sm text-gray-600">
                  Current: {currentNodeId ? (nodes.find(n => n.id === currentNodeId)?.data?.label as string) || 'Unknown' : 'Initializing...'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Step {executionSteps.length} of {executionPath.length}
                </div>
              </div>
            </div>
          )}
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

      {/* Bottom Status Area */}
      <BottomStatusArea
        ruleCount={globalConfig.rules.length}
        violations={violations}
        isExecuting={isExecuting}
        onExecute={executeWorkflow}
        onExportMCP={handleExportMCP}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        nodes={nodes}
        edges={edges}
        constitutionRules={globalConfig.rules.map((rule, index) => ({
          id: `rule-${index}`,
          name: rule,
          condition: 'content',
          action: 'block' as const,
          description: rule,
          enabled: true
        }))}
      />
    </div>
  );
};

export default AgentBuilder;
