import { printSolution } from "../../common/functions/print-solution.ts";
import { readInput } from "../../common/functions/read-input.ts";
import { Direction, GraphBuilder, Instructions, SingleGraphTraversal, leastCommonMultipleOf } from "../model.ts";

const input = await readInput('../input.txt');
const lines = input.split('\n');

const instructions = new Instructions(lines[0].split('') as Direction[]);

const graphBuilder = new GraphBuilder();
for (const line of lines.slice(2)) {
  const parts = /(?<name>.{3}) = \((?<left>.{3}), (?<right>.{3})\)/.exec(line)?.groups;
  if (parts == null) {
    throw new Error(`Error parsing line ${line}`);
  }

  graphBuilder.addNode(parts.name, parts.left, parts.right);
}

const graph = graphBuilder.build();

// console.debug('Graph size:', graph.length);
// console.debug('Instuctions size:', instructions.instructions.length);

const startNodes = graph.filter(node => node.name.endsWith('A'));
if (startNodes.length === 0) {
  throw new Error(`No starting nodes found`);
}

// console.debug('Starting nodes:', startNodes.map(node => node.name).join(' '));

// -----------
// COMPLEXITY TOO HIGH
//
// const graphTraversal = new MultiGraphTraversal(startNodes, nodes => nodes.every(node => node.name.endsWith('Z')), instructions);
// graphTraversal.run();
// 
// printSolution(2, graphTraversal.stepCount);
// -----------

const loopLengths = startNodes.map(startNode => {
  const graphTraversal = new SingleGraphTraversal(startNode, node => node.name.endsWith('Z'), instructions);
  graphTraversal.run();
  return graphTraversal.stepCount;
});

const leastCommonMultiple = leastCommonMultipleOf(loopLengths);
printSolution(2, leastCommonMultiple);

// -----------
// CAUSE FOR FINDING ABOVE ANSWER
// All graph traversals are looping at a fix step count following the instructions, so the LCM of the step counts is the answer.
// 
// let lastStepCount = 0;
// const graphTraversal = new SingleGraphTraversal(startNodes[3], node => node.name.endsWith('Z'), instructions);
// for (let runCount = 0; runCount < 10; ++runCount) {
//   graphTraversal.run();
//   console.debug(graphTraversal.stepCount - lastStepCount, graphTraversal.currentConfiguration.name);
//
//   lastStepCount = graphTraversal.stepCount;
//   graphTraversal.next();
// }
// -----------