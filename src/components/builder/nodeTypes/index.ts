
import StateNode from './StateNode';
import AINode from './AINode';
import RouterNode from './RouterNode';
import RuleCheckerNode from './RuleCheckerNode';
import OutputNode from './OutputNode';

export const nodeTypes = {
  state: StateNode,
  node: AINode,
  router: RouterNode,
  ruleChecker: RuleCheckerNode,
  output: OutputNode,
};
