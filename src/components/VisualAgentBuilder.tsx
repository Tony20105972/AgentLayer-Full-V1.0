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
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';


const VisualAgentBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <BuilderContent />
    </ReactFlowProvider>
  );
};


  useEffect(() => {
    loadFlow();
  }, []);


const BuilderContent: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);
  const [apiKeysSaved, setApiKeysSaved] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const { toast } = useToast();

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

      toast({
        title: 'Blocks Connected',
        description: 'Your flow connection has been created successfully.',
      });
    },
    [setEdges, toast]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      toast({
        title: `${node.type?.toUpperCase()} Block Selected`,
        description: 'Edit settings in the right panel',
      });
    },
    [toast]
  );

  const updateNodeData = (newData: NodeData) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, data: newData } : n))
    );
  };

  
  const saveFlow = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({ title: '로그인 필요', description: '저장하려면 로그인해야 합니다.' });
      return;
    }

    const flow = { nodes, edges };
    const { error } = await supabase.from('agent_configs').upsert([
      {
        user_id: user.data.user.id,
        flow,
        updated_at: new Date().toISOString()
      }
    ], { onConflict: ['user_id'] });

    if (error) {
      toast({ title: '❌ 저장 실패', description: error.message });
    } else {
      toast({ title: '✅ 저장 완료', description: 'Agent 구성이 저장되었습니다.' });
    }
  };

    const flow = { nodes, edges };
    localStorage.setItem('agentFlow', JSON.stringify(flow));
  };

  
  const loadFlow = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { data, error } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('user_id', user.data.user.id)
      .single();

    if (data?.flow) {
      setNodes(data.flow.nodes || []);
      setEdges(data.flow.edges || []);
      toast({ title: '✅ 불러오기 완료', description: '이전 구성 불러왔습니다.' });
    }
  };

    const saved = localStorage.getItem('agentFlow');
    if (saved) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  };

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
      setSelectedNode(newNode);

      toast({
        title: 'Block Added',
        description: `${getBlockDisplayName(type)} has been added to your flow.`,
      });
    },
    [reactFlowInstance, setNodes, toast]
  );

  const getBlockDisplayName = (type: string): string => {
    const names = {
      state: 'State Manager',
      llm: 'AI Agent Node',
      router: 'Decision Router',
      ruleChecker: 'Constitution Checker',
      output: 'Output Handler',
    };
    return names[type as keyof typeof names] || type;
  };

  const getDefaultNodeData = (type: string): NodeData => {
    switch (type) {
      case 'state':
        return {
          label: 'My Data Hub',
          config: {
            initialState: '{\n  "user_input": "",\n  "context": {}\n}',
            inputVars: ['user_input'],
            outputVars: ['processed_data'],
          },
        };
      case 'llm':
        return {
          label: 'Email Summarizer',
          config: {
            prompt:
              'You are a helpful AI assistant. Summarize the email and identify key action items. Be concise and highlight urgent matters.',
            temperature: 0.7,
            model: 'gpt-4',
            inputVars: ['user_input'],
            outputVars: ['ai_response'],
          },
        };
      case 'router':
        return {
          label: 'Priority Router',
          config: {
            conditions:
              'If ai_response contains "urgent" → priority_handler\nIf ai_response contains "question" → question_handler\nOtherwise → standard_handler',
            inputVars: ['ai_response'],
            outputVars: ['route_decision'],
          },
        };
      case 'ruleChecker':
        return {
          label: 'Safety Guardian',
          config: {
            ruleSetName: 'default_constitution',
            inputVars: ['ai_response'],
            outputVars: ['safety_check'],
          },
        };
      case 'output':
        return {
          label: 'Send to Slack',
          config: {
            outputType: 'slack',
            targetUrl: '',
            template: '🤖 AI Response: {{ai_response}}\n\nStatus: {{safety_check}}',
            sendVars: ['ai_response', 'safety_check'],
          },
        };
      default:
        return { label: 'New Block' };
    }
  };

  const executeFlow = async () => {
    if (nodes.length === 0) {
      toast({
        title: 'No Flow to Run',
        description: 'Add some blocks to your flow first.',
        variant: 'destructive',
      });
      return;
    }

    if (!reactFlowInstance || !reactFlowInstance.screenToFlowPosition) return;

    // The original code had an "event" here that was undefined.
    // Assuming this block was intended for some positioning logic during execution,
    // but without a clear source for "event", it's commented out to prevent errors.
    // const position = reactFlowInstance.screenToFlowPosition({
    //   x: event.clientX - reactFlowBounds.left,
    //   y: event.clientY - reactFlowBounds.top,
    // });

    setIsExecuting(true);
    const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x);

    toast({
      title: 'Flow Execution Started',
      description: 'Your AI agent flow is now running...',
    });

    for (const node of sortedNodes) {
      setExecutingNodeId(node.id);

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, isExecuting: true } }
            : { ...n, data: { ...n.data, isExecuting: false } }
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (node.type === 'ruleChecker' && Math.random() > 0.7) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, hasViolation: true, isExecuting: false } }
              : n
          )
        );

        setEdges((eds) =>
          eds.map((e) =>
            e.source === node.id || e.target === node.id
              ? { ...e, style: { ...e.style, stroke: '#ef4444', strokeWidth: 3 } }
              : e
          )
        );

        toast({
          title: 'Constitution Violation Detected',
          description: `Safety issue found in ${node.data.label}`,
          variant: 'destructive',
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, isExecuting: false } }
              : n
          )
        );
      }
    }

    setIsExecuting(false);
    setExecutingNodeId(null);

    toast({
      title: 'Flow Completed',
      description: 'Your AI agent flow has finished executing.',
    });
  };

  const replayFlow = async () => {
    setIsReplaying(true);

    toast({
      title: 'Replaying Flow',
      description: 'Resetting and re-running your flow...',
    });

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, hasViolation: false, isExecuting: false },
      }))
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: { strokeWidth: 2, stroke: '#6366f1' },
      }))
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
    await executeFlow();
    setIsReplaying(false);
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
      );

      toast({
        title: 'Block Deleted',
        description: `${selectedNode.data.label} has been removed from your flow.`,
      });

      setSelectedNode(null);
    }
  };

  const saveApiKeys = () => {
    setApiKeysSaved(true);
    toast({
      title: 'API Keys Saved',
      description: 'Your API configuration has been saved successfully.',
    });
    setTimeout(() => setApiKeysSaved(false), 3000);
  };

  const optimizeNodeWithAI = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId && n.type === 'llm') {
          return {
            ...n,
            data: {
              ...n.data,
              config: {
                ...n.data.config,
                prompt: `[AI Optimized] ${n.data.config?.prompt || ''}`,
                temperature: 0.8,
              },
            },
          };
        }
        return n;
      })
    );

    toast({
      title: 'AI Optimization Applied',
      description: 'Your block has been optimized with AI suggestions.',
    });
  };
  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Node Library - ALWAYS VISIBLE */}
      <div className="flex-shrink-0">
        <NodeLibrary />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
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
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            {/* Save/Load buttons - moved here for better context if they are indeed part of the canvas controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button onClick={saveFlow} className="bg-blue-500 text-white px-4 py-1 rounded">
                Save
              </button>
              <button onClick={loadFlow} className="bg-gray-500 text-white px-4 py-1 rounded">
                Load
              </button>
            </div>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  isExecuting: executingNodeId === node.id,
                },
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
              snapToGrid={true}
              snapGrid={[20, 20]}
            >
              <Controls className="bg-white shadow-lg border rounded-lg" />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
            </ReactFlow>
          </div>

          {/* Right Panel - Properties - ALWAYS VISIBLE */}
          <div className="flex-shrink-0">
            <LangGraphPropertiesPanel
              selectedNode={selectedNode}
              onUpdateNode={(nodeId, updates) => {
                setNodes((nds) =>
                  nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n))
                );
              }}
              onOptimizeWithAI={optimizeNodeWithAI}
              nodes={nodes}
              // The original code had two LangGraphPropertiesPanel components.
              // Assuming the second one was redundant or intended for a different purpose,
              // and the 'onChange' prop for updateNodeData was meant for the main one.
              // If 'onChange' is indeed needed on a separate panel, it should be re-added
              // with its distinct purpose. For now, integrated into the primary panel.
              onChange={updateNodeData}
            />
          </div>
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
