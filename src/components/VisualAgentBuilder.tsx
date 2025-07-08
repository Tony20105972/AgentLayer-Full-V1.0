
import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import NodeLibraryPanel from './builder/NodeLibraryPanel';
import TopToolbar from './builder/TopToolbar';
import PropertyPanel from './builder/PropertyPanel';
import ExecutionTracker from './builder/ExecutionTracker';
import { nodeTypes } from './builder/nodeTypes';
import { useFlowStore } from '@/stores/flowStore';

const VisualAgentBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <BuilderContent />
    </ReactFlowProvider>
  );
};

const BuilderContent: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);
  
  const { constitution, setConstitution } = useFlowStore();
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const getDefaultNodeData = (type: string) => {
    switch (type) {
      case 'state':
        return { 
          label: 'State', 
          config: { initialState: '{\n  "input": "",\n  "context": {}\n}' } 
        };
      case 'node':
        return { 
          label: 'AI Node', 
          config: { 
            prompt: 'You are a helpful AI assistant.',
            inputs: [],
            outputs: ['result'],
            model: 'gpt-4'
          } 
        };
      case 'router':
        return { 
          label: 'Router', 
          config: { 
            conditions: [{ name: 'default', expression: 'true' }] 
          } 
        };
      case 'ruleChecker':
        return { 
          label: 'Rule Checker', 
          config: { rules: constitution?.rules || [] } 
        };
      case 'output':
        return { 
          label: 'Output', 
          config: { 
            destination: 'webhook',
            template: 'Result: {{result}}',
            url: ''
          } 
        };
      default:
        return { label: 'Node' };
    }
  };

  const executeFlow = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x);
    
    for (const node of sortedNodes) {
      setExecutingNodeId(node.id);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate rule checking
      if (node.type === 'ruleChecker' && Math.random() > 0.7) {
        // Simulate rule violation
        setNodes(nds => nds.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, hasViolation: true } }
            : n
        ));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsExecuting(false);
    setExecutingNodeId(null);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar - Node Library */}
      <NodeLibraryPanel />
      
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <TopToolbar 
          nodes={nodes}
          edges={edges}
          onExecute={executeFlow}
          isExecuting={isExecuting}
          onGenerateFlow={(prompt) => {
            // AI Flow generation logic will be implemented here
            console.log('Generating flow from prompt:', prompt);
          }}
        />
        
        {/* Main Canvas */}
        <div className="flex-1 flex">
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes.map(node => ({
                ...node,
                data: {
                  ...node.data,
                  isExecuting: executingNodeId === node.id,
                }
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-slate-900"
            >
              <Controls className="bg-white/90 backdrop-blur" />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color="#374151" 
              />
            </ReactFlow>
          </div>
          
          {/* Right Panel - Properties */}
          <PropertyPanel 
            selectedNode={selectedNode}
            onUpdateNode={(nodeId, updates) => {
              setNodes(nds => nds.map(n => 
                n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
              ));
            }}
            constitution={constitution}
            onUpdateConstitution={setConstitution}
          />
        </div>
        
        {/* Bottom Execution Tracker */}
        {isExecuting && (
          <ExecutionTracker 
            currentNodeId={executingNodeId}
            nodes={nodes}
          />
        )}
      </div>
    </div>
  );
};

export default VisualAgentBuilder;
