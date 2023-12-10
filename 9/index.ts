import { printSolution } from "../common/functions/print-solution.ts";
import { readInput } from "../common/functions/read-input.ts";
import { splitAndParseNumbers } from "../common/functions/split-and-parse-numbers.ts";
import { Sequence } from "./model.ts";

const input = await readInput('input.txt');

const sequences = input.split('\n').map(line => new Sequence(splitAndParseNumbers(line)));

// Part 1

const successors = sequences.map(sequence => sequence.extrapolateSuccessor());

const sumOfSuccessors = successors.reduce((total, value) => total + value);
printSolution(1, sumOfSuccessors);

// Part 2

const predecessors = sequences.map(sequences => sequences.extrapolatePredecessor());

const sumOfPredecessors = predecessors.reduce((total, value) => total + value);
printSolution(2, sumOfPredecessors);
