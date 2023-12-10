const input = await Deno.readTextFile("input.txt");

interface Set {
  redCount: number;
  greenCount: number;
  blueCount: number;
}

function createSet(setInput: string): Set {
  return {
    redCount: Number(/(\d+) red/.exec(setInput)?.[1] ?? "0"),
    greenCount: Number(/(\d+) green/.exec(setInput)?.[1] ?? "0"),
    blueCount: Number(/(\d+) blue/.exec(setInput)?.[1] ?? "0"),
  };
}

interface Game {
  gameNumber: number;
  sets: Set[];
}

function createGame(gameInput: string): Game {
  return {
    gameNumber: Number(/Game (\d+)/.exec(gameInput)?.[1] ?? "0"),
    sets: gameInput
      .split(":")[1]
      .split(";")
      .map((set) => createSet(set)),
  };
}

const games = input
  .split("\n")
  .map((line) => createGame(line));

// Part 1

const redTotal = 12;
const greenTotal = 13;
const blueTotal = 14;

function isValidSet(set: Set): boolean {
  return set.redCount <= redTotal &&
    set.greenCount <= greenTotal &&
    set.blueCount <= blueTotal;
}

function isValidGame(game: Game): boolean {
  return game.sets.every((set) => isValidSet(set));
}

const sum = games
  .filter((game) => isValidGame(game))
  .reduce((total, game) => total + game.gameNumber, 0);
console.log(sum);

// Part 2

function getMinimumNumberOfCubes(game: Game): Set {
  return {
    redCount: Math.max(...game.sets.map((set) => set.redCount)),
    greenCount: Math.max(...game.sets.map((set) => set.greenCount)),
    blueCount: Math.max(...game.sets.map((set) => set.blueCount)),
  };
}

function getPowerOfCubes(set: Set): number {
  return set.redCount * set.greenCount * set.blueCount;
}

const sum2 = games
  .map((game) => getMinimumNumberOfCubes(game))
  .reduce((total, set) => total + getPowerOfCubes(set), 0);
console.log(sum2);
