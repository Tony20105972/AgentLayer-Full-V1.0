
import StateNode from './nodeTypes/StateNode';
import AINode from './nodeTypes/AINode';
import RouterNode from './nodeTypes/RouterNode';
import RuleCheckerNode from './nodeTypes/RuleCheckerNode';
import OutputNode from './nodeTypes/OutputNode';

export const nodeTypes = {
  state: StateNode,
  node: AINode,
  router: RouterNode,
  ruleChecker: RuleCheckerNode,
  output: OutputNode,
};
