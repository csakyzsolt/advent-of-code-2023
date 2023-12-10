import { printSolution } from "../../common/functions/print-solution.ts";
import { readInput } from "../../common/functions/read-input.ts";
import { Direction, GraphBuilder, Instructions, SingleGraphTraversal } from "../model.ts";

const startNodeName = 'AAA';
const destNodeName = 'ZZZ';

const input = await readInput('../input.txt');
const lines = input.split('\n');

const instructions = new Instructions(lines[0].split('') as Direction[]);

const graphBuilder = new GraphBuilder();
for (const line of lines.slice(2)) {
  const parts = /(?<name>[A-Z]{3}) = \((?<left>[A-Z]{3}), (?<right>[A-Z]{3})\)/.exec(line)?.groups;
  if (parts == null) {
    throw new Error(`Error parsing line ${line}`);
  }

  graphBuilder.addNode(parts.name, parts.left, parts.right);
}

const graph = graphBuilder.build();

const rootNode = graph.find(node => node.name === startNodeName);
if (rootNode == null) {
  throw new Error(`Starting node ${startNodeName} not found`);
}

const graphTraversal = new SingleGraphTraversal(rootNode, node => node.name === destNodeName, instructions);
while (graphTraversal.hasNext) {
  graphTraversal.next();
}

printSolution(1, graphTraversal.stepCount);