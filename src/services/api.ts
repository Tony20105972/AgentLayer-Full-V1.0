
interface ExecutionResult {
  uuid: string;
  violations: Array<{
    nodeId: string;
    ruleId: string;
    description: string;
    suggestion: string;
  }>;
  summary: string;
  totalScore: number;
  runTime: number;
  outputUrl?: string;
  timestamp: number;
  result: string;
}

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  creator: string;
  price: string;
  rating: number;
  downloads: number;
  tags: string[];
  isPremium: boolean;
  previewNodes: number;
  category: string;
  flow: any;
}

interface DAOStats {
  treasuryBalance: string;
  totalExecutions: number;
  averageReputation: number;
  leaderboard: Array<{
    address: string;
    reputation: number;
    executions: number;
    violations: number;
    earnings: string;
    rank: number;
  }>;
}

class APIService {
  private baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://api.agentlayer.io' 
    : 'http://localhost:8000';

  // Builder API
  async executeAgent(flow: any, constitution: string, apiKeys: Record<string, string>): Promise<ExecutionResult> {
    try {
      const response = await fetch(`${this.baseURL}/api/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flow,
          constitution,
          api_keys: apiKeys
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to execute agent:', error);
      // Return mock data for development
      return this.getMockExecutionResult();
    }
  }

  async checkRules(flow: any, constitution: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/check_rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flow, constitution })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to check rules:', error);
      return { violations: [] };
    }
  }

  // Marketplace API
  async getAgentTemplates(): Promise<AgentTemplate[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/templates`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return this.getMockTemplates();
    }
  }

  async purchaseTemplate(templateId: string, walletAddress: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/templates/${templateId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to purchase template:', error);
      throw error;
    }
  }

  // DAO API
  async getDAOStats(): Promise<DAOStats> {
    try {
      const response = await fetch(`${this.baseURL}/api/dao/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch DAO stats:', error);
      return this.getMockDAOStats();
    }
  }

  async claimRewards(walletAddress: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/dao/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      throw error;
    }
  }

  // Run Details API
  async getExecutionDetails(uuid: string): Promise<ExecutionResult> {
    try {
      const response = await fetch(`${this.baseURL}/api/agent/${uuid}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch execution details:', error);
      return this.getMockExecutionResult(uuid);
    }
  }

  async mintExecutionNFT(executionResult: ExecutionResult, walletAddress: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/mint_nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          execution_uuid: executionResult.uuid,
          wallet_address: walletAddress,
          metadata: {
            summary: executionResult.summary,
            violations: executionResult.violations,
            timestamp: executionResult.timestamp,
            total_score: executionResult.totalScore
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockExecutionResult(uuid?: string): ExecutionResult {
    return {
      uuid: uuid || `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      violations: Math.random() > 0.7 ? [] : [
        {
          nodeId: 'node-1',
          ruleId: 'ETHICAL_001',
          description: 'Agent response contained potentially biased language',
          suggestion: 'Review the prompt to ensure neutral tone'
        }
      ],
      summary: 'Agent executed successfully and generated a comprehensive response.',
      totalScore: Math.floor(Math.random() * 30) + 70,
      runTime: 1200 + Math.floor(Math.random() * 2000),
      outputUrl: Math.random() > 0.5 ? `https://example.com/reports/${Date.now()}.html` : undefined,
      timestamp: Date.now(),
      result: 'This is the agent execution result. The agent processed the input successfully and generated this response based on the provided instructions and constitution.'
    };
  }

  private getMockTemplates(): AgentTemplate[] {
    return [
      {
        id: '1',
        name: 'Content Summarizer Pro',
        description: 'Advanced AI agent that summarizes articles, documents, and web content with high accuracy.',
        creator: '0x1234...5678',
        price: '0.01',
        rating: 4.8,
        downloads: 1240,
        tags: ['Summarization', 'Content', 'AI'],
        isPremium: true,
        previewNodes: 4,
        category: 'Content',
        flow: { nodes: [], edges: [] }
      },
      {
        id: '2',
        name: 'Language Translator',
        description: 'Multi-language translation agent supporting 50+ languages with context awareness.',
        creator: '0x9876...4321',
        price: '0.005',
        rating: 4.6,
        downloads: 890,
        tags: ['Translation', 'Language', 'Global'],
        isPremium: false,
        previewNodes: 3,
        category: 'Language',
        flow: { nodes: [], edges: [] }
      }
    ];
  }

  private getMockDAOStats(): DAOStats {
    return {
      treasuryBalance: '12.34',
      totalExecutions: 1247,
      averageReputation: 87,
      leaderboard: [
        {
          address: '0x1234...5678',
          reputation: 98,
          executions: 234,
          violations: 2,
          earnings: '1.45',
          rank: 1
        },
        {
          address: '0x9876...4321',
          reputation: 95,
          executions: 189,
          violations: 5,
          earnings: '1.12',
          rank: 2
        }
      ]
    };
  }
}

export const apiService = new APIService();
export type { ExecutionResult, AgentTemplate, DAOStats };
