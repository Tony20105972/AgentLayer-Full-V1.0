
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
import LangGraphPropertiesPanel from './builder/LangGraphPropertiesPanel';
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
  const [isReplaying, setIsReplaying] = useState(false);
  
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        style: { strokeWidth: 2, stroke: '#6366f1' },
        animated: true,
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
          label: 'State Manager', 
          config: { 
            initialState: '{\n  "input": "",\n  "context": {}\n}',
            inputVars: ['input'],
            outputVars: ['state']
          } 
        };
      case 'llm':
        return { 
          label: 'AI Agent Node', 
          config: { 
            prompt: 'Process the following input: {input}',
            temperature: 0.7,
            model: 'gpt-4',
            inputVars: ['input'],
            outputVars: ['response']
          } 
        };
      case 'router':
        return { 
          label: 'Decision Router', 
          config: { 
            conditions: 'if response.sentiment == "negative" → moderation_node\nelse → output_node',
            inputVars: ['response'],
            outputVars: ['route_decision']
          } 
        };
      case 'ruleChecker':
        return { 
          label: 'Constitution Checker', 
          config: { 
            ruleSetName: 'default_constitution',
            inputVars: ['response'],
            outputVars: ['compliance_check']
          } 
        };
      case 'output':
        return { 
          label: 'Output Handler', 
          config: { 
            outputType: 'webhook',
            targetUrl: 'https://hooks.example.com/webhook',
            sendVars: ['response']
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
      
      // Update node visual state
      setNodes(nds => nds.map(n => 
        n.id === node.id 
          ? { ...n, data: { ...n.data, isExecuting: true } }
          : { ...n, data: { ...n.data, isExecuting: false } }
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate rule violations on RuleChecker nodes
      if (node.type === 'ruleChecker' && Math.random() > 0.6) {
        setNodes(nds => nds.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, hasViolation: true, isExecuting: false } }
            : n
        ));
        
        // Mark connecting edges as violated
        setEdges(eds => eds.map(e => 
          e.source === node.id || e.target === node.id
            ? { ...e, style: { ...e.style, stroke: '#ef4444', strokeWidth: 3 } }
            : e
        ));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        setNodes(nds => nds.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, isExecuting: false } }
            : n
        ));
      }
    }
    
    setIsExecuting(false);
    setExecutingNodeId(null);
  };

  const replayFlow = async () => {
    setIsReplaying(true);
    // Reset all violations and states
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { ...n.data, hasViolation: false, isExecuting: false }
    })));
    setEdges(eds => eds.map(e => ({
      ...e,
      style: { strokeWidth: 2, stroke: '#6366f1' }
    })));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await executeFlow();
    setIsReplaying(false);
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

  const optimizeNodeWithAI = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // AI optimization simulation
    setNodes(nds => nds.map(n => {
      if (n.id === nodeId && n.type === 'llm') {
        return {
          ...n,
          data: {
            ...n.data,
            config: {
              ...n.data.config,
              prompt: `[AI Optimized] ${n.data.config?.prompt || ''}`,
              temperature: 0.8
            }
          }
        };
      }
      return n;
    }));
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Node Library */}
      <NodeLibrary />
      
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <BuilderToolbar 
          onExecute={executeFlow}
          onReplay={replayFlow}
          isExecuting={isExecuting}
          isReplaying={isReplaying}
          onSaveApiKeys={saveApiKeys}
          apiKeysSaved={apiKeysSaved}
          onDeleteNode={deleteSelectedNode}
          hasSelectedNode={!!selectedNode}
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
          
          {/* Right Panel - LangGraph Properties */}
          <LangGraphPropertiesPanel 
            selectedNode={selectedNode}
            onUpdateNode={(nodeId, updates) => {
              setNodes(nds => nds.map(n => 
                n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
              ));
            }}
            onOptimizeWithAI={optimizeNodeWithAI}
            nodes={nodes}
          />
        </div>
        
        {/* Execution Indicator */}
        <ExecutionIndicator 
          isExecuting={isExecuting}
          isReplaying={isReplaying}
          currentNodeId={executingNodeId}
          nodes={nodes}
        />
      </div>
    </div>
  );
};

export default VisualAgentBuilder;
