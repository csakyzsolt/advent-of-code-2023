import { printSolution } from "../common/functions/print-solution.ts";
import { readInput } from "../common/functions/read-input.ts";
import { Network } from "./model.ts";

const input = await readInput('input.txt');
const symbols = input.split('\n').map(line => line.split(''));
const network = new Network(symbols);
const loopLength = network.loopLength;

printSolution(1, Math.floor(loopLength) / 2);