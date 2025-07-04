import React, { useState, useCallback } from 'react';
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
import ConstitutionPanel from './ConstitutionPanel';
import StatePanel from './StatePanel';
import ConstitutionEngine from './ConstitutionEngine';
import ExportModal from './ExportModal';
import { nodeTypes } from './nodes';
import { initialNodes, initialEdges } from './initialElements';
import { useAgentState } from '@/hooks/useAgentState';

const AgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activePanel, setActivePanel] = useState<'properties' | 'execution' | 'constitution' | 'state'>('properties');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    memoryChain,
    executionState,
    addState,
    updateGlobalContext,
    startExecution,
    moveToNextNode,
    stopExecution
  } = useAgentState();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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
    setIsExecuting(true);
    setExecutionLogs(['🚀 Starting AgentLayer execution...']);
    
    const startNode = nodes.find(node => node.type === 'start');
    if (startNode) {
      startExecution(startNode.id);
      
      // 시뮬레이션된 실행 로직 - 실제로는 백엔드 MCP와 연동
      for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        moveToNextNode(currentNode.id);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // State 추가
        const state = {
          id: `state-${Date.now()}-${i}`,
          timestamp: Date.now(),
          nodeId: currentNode.id,
          input: { message: `Input for ${currentNode.data.label}` },
          output: { result: `Output from ${currentNode.data.label}` },
          metadata: {
            executionTime: Math.random() * 1000,
            constitutionViolations: [],
            nodeType: currentNode.type || 'unknown'
          }
        };
        
        addState(state);
        setExecutionLogs(prev => [...prev, `✅ Executed node: ${currentNode.data.label} (${state.metadata.executionTime.toFixed(0)}ms)`]);
      }
    }
    
    setExecutionLogs(prev => [...prev, '🎉 AgentLayer workflow execution completed!']);
    stopExecution();
    setIsExecuting(false);
  };

  const handleConstitutionViolation = (violation: { ruleId: string; message: string; nodeId: string }) => {
    setExecutionLogs(prev => [...prev, `⚠️ Constitution violation: ${violation.message}`]);
    
    // 노드를 빨간색으로 하이라이트
    setNodes(nds => nds.map(node => 
      node.id === violation.nodeId 
        ? { ...node, style: { ...node.style, border: '2px solid #ef4444' } }
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
          />
        </ReactFlow>

        {/* 실행 및 내보내기 버튼 */}
        <div className="absolute top-4 right-4 z-10 space-x-2 flex">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all"
          >
            📤 Export MCP
          </button>
          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isExecuting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg'
            }`}
          >
            {isExecuting ? '🔄 Executing...' : '▶️ Execute Agent'}
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
            <StatePanel 
              memoryChain={memoryChain}
              executionState={executionState}
            />
          )}
          {activePanel === 'execution' && (
            <ExecutionPanel 
              executionLogs={executionLogs}
              isExecuting={isExecuting}
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
