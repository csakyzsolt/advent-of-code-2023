import { printSolution } from "../common/functions/print-solution.ts";
import { readInput } from "../common/functions/read-input.ts";
import { splitAndParseNumbers } from "../common/functions/split-and-parse-numbers.ts";

const input = await readInput('live');

interface Race {
  time: number;
  recordDistance: number;
}

const parts = /Time:\s+(?<times>[\s\d]+)\nDistance:\s+(?<distances>[\s\d]+)/.exec(input)?.groups;
if (parts == null) {
  throw new Error('Error parsing input');
}

// Part 1

const times = splitAndParseNumbers(parts.times);
if (times == null) {
  throw new Error('Error parsing times');
}

const distances = splitAndParseNumbers(parts.distances);
if (distances == null) {
  throw new Error('Error parsing distances');
}

if (times.length !== distances.length) {
  throw new Error('Times and distances must have the same length');
}

const races = times.map((time, index) => ({ time, recordDistance: distances[index] } as Race));

function countNumberOfWaysToWin(race: Race): number {
  let numberOfWaysToWin = 0;
  for (let delay = 1; delay < race.time - 1; ++delay) {
    if (delay * (race.time - delay) > race.recordDistance) {
      ++numberOfWaysToWin;
    }
  }

  return numberOfWaysToWin;
}

const numberOfWaysToWinByRace = races.map(race => countNumberOfWaysToWin(race));

const product = numberOfWaysToWinByRace.reduce((product, numberOfWaysToWin) => product * numberOfWaysToWin, 1);
printSolution(1, product);

// Part 2

const race: Race = {
  time: Number(parts.times.replace(/\s/g, '')),
  recordDistance: Number(parts.distances.replace(/\s/g, ''))
};

const numberOfWaysToWin = countNumberOfWaysToWin(race);
printSolution(2, numberOfWaysToWin);