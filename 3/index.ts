const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

// Part 1

interface NumberLocation {
  value: number;
  lineIndex: number;
  fromIndex: number;
  toIndex: number;
}

interface CellCoords {
  lineIndex: number;
  charIndex: number;
  value?: string;
}

function createNumberLocations(input: string, lineIndex: number): NumberLocation[] {
  const numberLocations: NumberLocation[] = [];
  for (let i = 0; i < input.length; ++i) {
    const number = /^\d+/.exec(input.substring(i))?.[0];
    if (number != null) {
      numberLocations.push({
        value: Number(number),
        lineIndex,
        fromIndex: i,
        toIndex: i + number.length,
      });
      i += number.length;
    }
  }
  return numberLocations;
}

function getAdjacentCells(numberLocation: NumberLocation): CellCoords[] {
  return [
    // Cells above
    ...new Array((numberLocation.toIndex) - (numberLocation.fromIndex) + 2)
      .fill(null)
      .map((_, index) => ({
        lineIndex: numberLocation.lineIndex - 1,
        charIndex: numberLocation.fromIndex + index - 1,
      })),
    // Cell to the left
    {
      lineIndex: numberLocation.lineIndex,
      charIndex: numberLocation.fromIndex - 1,
    },
    // Cell to the right
    {
      lineIndex: numberLocation.lineIndex,
      charIndex: numberLocation.toIndex,
    },
    // Cells below
    ...new Array((numberLocation.toIndex) - (numberLocation.fromIndex) + 2)
      .fill(null)
      .map((_, index) => ({
        lineIndex: numberLocation.lineIndex + 1,
        charIndex: numberLocation.fromIndex + index - 1,
      })),
  ].filter((cell) =>
    cell.lineIndex >= 0 &&
    cell.lineIndex < lines.length &&
    cell.charIndex >= 0 &&
    cell.charIndex < lines[cell.lineIndex].length
  );
}

function hasAdjacentSymbol(numberLocation: NumberLocation): boolean {
  return getAdjacentCells(numberLocation)
    .some((cell) => /[^\d\.]/.test(lines[cell.lineIndex][cell.charIndex]));
}

const numberLocations = lines
  .map((line, index) => createNumberLocations(line, index))
  .flat();

const sum = numberLocations
  .filter((numberLocation) => hasAdjacentSymbol(numberLocation))
  .reduce((total, numberLocation) => total + numberLocation.value, 0);
console.log(sum);

// Part 2

function isNeighboring(cell: CellCoords, number: NumberLocation): boolean {
  return Math.abs(cell.lineIndex - number.lineIndex) <= 1 &&
    cell.charIndex >= number.fromIndex - 1 && 
    cell.charIndex < number.toIndex + 1;
}

const gearCells = lines
  .map((line, lineIndex) => Array.from(line)
    .map((char, charIndex) => ({ lineIndex, charIndex, value: char } as CellCoords))
    .filter(cell => cell.value === '*'))
  .flat();

const gearPairs = gearCells
  .map(gearCell => numberLocations
    .filter(numberLocation => isNeighboring(gearCell, numberLocation)))
  .filter(gears => gears.length === 2);

const sum2 = gearPairs
  .map(gears => gears[0].value * gears[1].value)
  .reduce((total, gearRatio) => total + gearRatio);
console.log(sum2);