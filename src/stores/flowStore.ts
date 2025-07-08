
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Constitution {
  rules: Array<{
    rule_name: string;
    description: string;
    violation_action: 'block' | 'warn' | 'log';
  }>;
}

interface FlowStore {
  constitution: Constitution;
  apiKeys: Record<string, string>;
  setConstitution: (constitution: Constitution) => void;
  setApiKey: (service: string, key: string) => void;
  exportFlow: (nodes: any[], edges: any[]) => void;
  importFlow: (data: any) => void;
}

export const useFlowStore = create<FlowStore>()(
  persist(
    (set, get) => ({
      constitution: {
        rules: [
          {
            rule_name: 'no_harmful_content',
            description: 'Prevent generation of harmful or dangerous content',
            violation_action: 'block'
          },
          {
            rule_name: 'factual_accuracy',
            description: 'Ensure responses are factually accurate',
            violation_action: 'warn'
          }
        ]
      },
      apiKeys: {},
      setConstitution: (constitution) => set({ constitution }),
      setApiKey: (service, key) => 
        set(state => ({ 
          apiKeys: { ...state.apiKeys, [service]: key } 
        })),
      exportFlow: (nodes, edges) => {
        const flowData = {
          nodes,
          edges,
          constitution: get().constitution,
          timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(flowData, null, 2)], {
          type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-flow-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
      importFlow: (data) => {
        if (data.constitution) {
          set({ constitution: data.constitution });
        }
      }
    }),
    {
      name: 'agentlayer-flow-store'
    }
  )
);
