
import StateNode from './nodeTypes/StateNode';
import LLMNode from './nodeTypes/LLMNode';
import ToolNode from './nodeTypes/ToolNode';
import RouterNode from './nodeTypes/RouterNode';
import RuleCheckerNode from './nodeTypes/RuleCheckerNode';
import OutputNode from './nodeTypes/OutputNode';

export const nodeTypes = {
  state: StateNode,
  llm: LLMNode,
  tool: ToolNode,
  router: RouterNode,
  ruleChecker: RuleCheckerNode,
  output: OutputNode,
};
