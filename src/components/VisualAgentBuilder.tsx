
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

import NodeLibrary from './builder/NodeLibrary';
import BuilderToolbar from './builder/BuilderToolbar';
import DynamicPropertiesPanel from './builder/DynamicPropertiesPanel';
import ExecutionIndicator from './builder/ExecutionIndicator';
import { nodeTypes } from './builder/nodeTypes';
import { NodeData } from '@/types/flow';

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
  const [apiKeysSaved, setApiKeysSaved] = useState(false);
  
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        style: { strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

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

      const position = reactFlowInstance.screenToFlowPosition({
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

  const getDefaultNodeData = (type: string): NodeData => {
    switch (type) {
      case 'state':
        return { 
          label: 'State', 
          config: { 
            initialState: '{\n  "topic": "",\n  "context": {}\n}',
            inputVars: ['topic'],
            outputVars: ['state']
          } 
        };
      case 'llm':
        return { 
          label: 'LLM Node', 
          config: { 
            prompt: 'Write a blog about {topic}',
            temperature: 0.7,
            model: 'gpt-4',
            inputVars: ['topic'],
            outputVars: ['blog_post']
          } 
        };
      case 'tool':
        return { 
          label: 'Tool Node', 
          config: { 
            toolName: 'translator',
            params: '{"lang": "fr"}',
            inputVars: ['text'],
            outputVars: ['translated_text']
          } 
        };
      case 'router':
        return { 
          label: 'Router', 
          config: { 
            conditions: 'if sentiment == "negative" → warn_node',
            inputVars: ['sentiment'],
            outputVars: ['decision_path']
          } 
        };
      case 'ruleChecker':
        return { 
          label: 'Rule Checker', 
          config: { 
            ruleSetName: 'no_bias',
            inputVars: ['response'],
            outputVars: ['is_valid']
          } 
        };
      case 'output':
        return { 
          label: 'Output', 
          config: { 
            outputType: 'webhook',
            targetUrl: 'https://hooks.example.com',
            sendVars: ['blog_post']
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate rule violations
      if (node.type === 'ruleChecker' && Math.random() > 0.7) {
        setNodes(nds => nds.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, hasViolation: true } }
            : n
        ));
        
        // Mark connecting edges as violated
        setEdges(eds => eds.map(e => 
          e.source === node.id || e.target === node.id
            ? { ...e, style: { ...e.style, stroke: '#ef4444', strokeWidth: 3 } }
            : e
        ));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    setIsExecuting(false);
    setExecutingNodeId(null);
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
      setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const saveApiKeys = () => {
    setApiKeysSaved(true);
    setTimeout(() => setApiKeysSaved(false), 2000);
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Left Sidebar - Node Library */}
      <NodeLibrary />
      
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <BuilderToolbar 
          onExecute={executeFlow}
          isExecuting={isExecuting}
          onSaveApiKeys={saveApiKeys}
          apiKeysSaved={apiKeysSaved}
          onDeleteNode={deleteSelectedNode}
          hasSelectedNode={!!selectedNode}
        />
        
        {/* Main Canvas */}
        <div className="flex-1 flex">
          <div className="flex-1 relative bg-gray-50" ref={reactFlowWrapper}>
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
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-white"
            >
              <Controls className="bg-white shadow-lg border rounded-lg" />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color="#e5e7eb" 
              />
            </ReactFlow>
          </div>
          
          {/* Right Panel - Dynamic Properties */}
          <DynamicPropertiesPanel 
            selectedNode={selectedNode}
            onUpdateNode={(nodeId, updates) => {
              setNodes(nds => nds.map(n => 
                n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
              ));
            }}
          />
        </div>
        
        {/* Execution Indicator */}
        <ExecutionIndicator 
          isExecuting={isExecuting}
          currentNodeId={executingNodeId}
          nodes={nodes}
        />
      </div>
    </div>
  );
};

export default VisualAgentBuilder;
