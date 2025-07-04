
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
import ExecutionPanel from './ExecutionPanel';
import StatePreviewPanel from './StatePreviewPanel';
import ConstitutionPanel from './ConstitutionPanel';
import ConstitutionEngine from './ConstitutionEngine';
import ExportModal from './ExportModal';
import { nodeTypes } from './nodes';
import { initialNodes, initialEdges } from './initialElements';
import { useExecutionFlow } from '@/hooks/useExecutionFlow';

const AgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activePanel, setActivePanel] = useState<'properties' | 'execution' | 'constitution' | 'state'>('properties');
  const [showExportModal, setShowExportModal] = useState(false);

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

  // Highlight nodes based on execution results
  useEffect(() => {
    setNodes(nds => nds.map(node => {
      const nodeStep = executionSteps.find(step => step.nodeId === node.id);
      if (nodeStep) {
        let borderColor = '#3b82f6'; // default blue
        if (nodeStep.status === 'success') borderColor = '#10b981'; // green
        else if (nodeStep.status === 'failure') borderColor = '#ef4444'; // red
        else if (nodeStep.status === 'violation') borderColor = '#f59e0b'; // orange
        
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
  }, [executionSteps, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = addEdge({
        ...params,
        label: params.sourceHandle && params.sourceHandle !== 'default' ? params.sourceHandle : undefined
      }, edges);
      setEdges(edge);
    },
    [setEdges, edges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setActivePanel('properties');
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

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };
      
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type} Node`,
          config: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const executeWorkflow = async () => {
    await startExecution(nodes, edges);
  };

  const handleConstitutionViolation = (violation: { ruleId: string; message: string; nodeId: string }) => {
    // Find and highlight the violating node
    setNodes(nds => nds.map(node => 
      node.id === violation.nodeId 
        ? { 
            ...node, 
            style: { 
              ...node.style, 
              border: '3px solid #f59e0b',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)'
            } 
          }
        : node
    ));
  };

  // Default constitution rules
  const defaultConstitutionRules = [
    {
      id: 'pii-protection',
      name: 'PII Protection',
      condition: 'pii',
      action: 'block' as const,
      description: 'Prevent exposure of personally identifiable information',
      enabled: true
    },
    {
      id: 'harmful-content',
      name: 'Harmful Content Filter',
      condition: 'harmful',
      action: 'warn' as const,
      description: 'Detect and prevent harmful or discriminatory content',
      enabled: true
    },
    {
      id: 'data-privacy',
      name: 'Data Privacy Compliance',
      condition: 'privacy',
      action: 'log' as const,
      description: 'Ensure compliance with data privacy regulations',
      enabled: true
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 좌측 노드 라이브러리 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <NodeLibrary />
      </div>

      {/* 중앙 캔버스 */}
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
          className="bg-gray-50"
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeStrokeColor="#374151"
            nodeColor="#f9fafb"
            nodeBorderRadius={8}
            pannable
            zoomable
          />
        </ReactFlow>

        {/* 상단 액션 버튼들 */}
        <div className="absolute top-4 right-4 z-10 space-x-2 flex">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all flex items-center space-x-2"
          >
            <span>📤</span>
            <span>Export MCP</span>
          </button>
          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              isExecuting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg'
            }`}
          >
            <span>{isExecuting ? '🔄' : '▶️'}</span>
            <span>{isExecuting ? 'Executing...' : 'Execute Workflow'}</span>
          </button>
        </div>

        {/* Constitution Engine Overlay */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
            <ConstitutionEngine 
              rules={defaultConstitutionRules}
              onViolationDetected={handleConstitutionViolation}
            />
          </div>
        </div>

        {/* Execution Status Overlay */}
        {isExecuting && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-lg font-semibold text-gray-900">Executing Workflow</div>
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

      {/* 우측 패널 */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* 패널 탭 */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'properties', label: 'Properties', icon: '⚙️' },
            { key: 'state', label: 'State', icon: '📊' },
            { key: 'execution', label: 'Execution', icon: '🔄' },
            { key: 'constitution', label: 'Rules', icon: '🛡️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActivePanel(tab.key as any)}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                activePanel === tab.key
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 패널 내용 */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'properties' && (
            <PropertyPanel 
              selectedNode={selectedNode} 
              onUpdateNode={(nodeId, updates) => {
                setNodes(nds => nds.map(node => 
                  node.id === nodeId ? { ...node, ...updates } : node
                ));
              }}
            />
          )}
          {activePanel === 'state' && (
            <StatePreviewPanel 
              selectedNode={selectedNode}
              executionSteps={executionSteps}
            />
          )}
          {activePanel === 'execution' && (
            <ExecutionPanel 
              executionSteps={executionSteps}
              isExecuting={isExecuting}
              onClearLogs={clearExecution}
              onStopExecution={stopExecution}
            />
          )}
          {activePanel === 'constitution' && <ConstitutionPanel />}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        nodes={nodes}
        edges={edges}
        constitutionRules={defaultConstitutionRules}
      />
    </div>
  );
};

export default AgentBuilder;
