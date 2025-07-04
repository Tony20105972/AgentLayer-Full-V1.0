
import StartNode from './StartNode';
import EndNode from './EndNode';
import RouterNode from './RouterNode';
import AgentNode from './AgentNode';
import RuleCheckerNode from './RuleCheckerNode';
import NotifierNode from './NotifierNode';

export const nodeTypes = {
  start: StartNode,
  agent: AgentNode,
  router: RouterNode,
  ruleChecker: RuleCheckerNode,
  end: EndNode,
  notifier: NotifierNode,
};
