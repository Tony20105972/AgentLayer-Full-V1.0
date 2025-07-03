
import StartNode from './StartNode';
import MCPNode from './MCPNode';
import AIChatNode from './AIChatNode';
import APINode from './APINode';
import EndNode from './EndNode';
import ConditionNode from './ConditionNode';
import RAGNode from './RAGNode';

export const nodeTypes = {
  start: StartNode,
  mcp: MCPNode,
  aichat: AIChatNode,
  api: APINode,
  end: EndNode,
  condition: ConditionNode,
  rag: RAGNode,
  embedding: AIChatNode, // 재사용
  webhook: APINode, // 재사용
  database: APINode, // 재사용
  document: StartNode, // 재사용
  transform: ConditionNode, // 재사용
  filter: ConditionNode, // 재사용
};
