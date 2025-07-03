
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
import { nodeTypes } from './nodes';
import { initialNodes, initialEdges } from './initialElements';

const AgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activePanel, setActivePanel] = useState<'properties' | 'execution' | 'constitution'>('properties');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

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
    setExecutionLogs(['🚀 Starting workflow execution...']);
    
    // 시뮬레이션된 실행 로직
    for (let i = 0; i < nodes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExecutionLogs(prev => [...prev, `✅ Executed node: ${nodes[i].data.label}`]);
    }
    
    setExecutionLogs(prev => [...prev, '🎉 Workflow execution completed!']);
    setIsExecuting(false);
  };

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

        {/* 실행 버튼 */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isExecuting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg'
            }`}
          >
            {isExecuting ? '🔄 Executing...' : '▶️ Execute Workflow'}
          </button>
        </div>
      </div>

      {/* 우측 패널 */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* 패널 탭 */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'properties', label: 'Properties', icon: '⚙️' },
            { key: 'execution', label: 'Execution', icon: '📊' },
            { key: 'constitution', label: 'Rules', icon: '🛡️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActivePanel(tab.key as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === tab.key
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
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
          {activePanel === 'execution' && (
            <ExecutionPanel 
              executionLogs={executionLogs}
              isExecuting={isExecuting}
            />
          )}
          {activePanel === 'constitution' && <ConstitutionPanel />}
        </div>
      </div>
    </div>
  );
};

export default AgentBuilder;
