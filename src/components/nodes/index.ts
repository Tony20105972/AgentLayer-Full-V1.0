import StartNode from './StartNode';
import MCPNode from './MCPNode';
import AIChatNode from './AIChatNode';
import APINode from './APINode';
import EndNode from './EndNode';
import ConditionNode from './ConditionNode';
import RAGNode from './RAGNode';
import ControlNode from './ControlNode';
import DocumentUploadNode from './DocumentUploadNode';
import EmbedVectorNode from './EmbedVectorNode';
import QueryContextNode from './QueryContextNode';
import SlackNode from './SlackNode';
import DeployNode from './DeployNode';
import RouterNode from './RouterNode';

export const nodeTypes = {
  start: StartNode,
  mcp: MCPNode,
  aichat: AIChatNode,
  api: APINode,
  end: EndNode,
  condition: ConditionNode,
  rag: RAGNode,
  control: ControlNode,
  documentUpload: DocumentUploadNode,
  embedVector: EmbedVectorNode,
  queryContext: QueryContextNode,
  slack: SlackNode,
  deploy: DeployNode,
  // 기존 재사용 노드들
  embedding: EmbedVectorNode,
  webhook: APINode,
  database: APINode,
  document: DocumentUploadNode,
  transform: ConditionNode,
  filter: ConditionNode,
  router: RouterNode,
};
