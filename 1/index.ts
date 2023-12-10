const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

// Part 1

function getSumOfFirstAndLastDigits(input: string): number {
  const firstDigit = /^.*?(\d)/.exec(input)?.[1] ?? "";
  const lastDigit = /.*(\d).*?$/.exec(input)?.[1] ?? "";
  return Number(firstDigit + lastDigit);
}

const sum = lines
  .map((line) => getSumOfFirstAndLastDigits(line))
  .reduce((total, current) => total + current);
console.log(sum);

// Part 2

const digitNameByValue = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

function sanitizeDigitName(digit: string): string {
  return /\d/.test(digit) ? digit : digitNameByValue.get(digit) ?? "";
}

function getSumOfFirstAndLastDigits2(input: string): number {
  const firstDigit = /^.*?(\d|one|two|three|four|five|six|seven|eight|nine)/
    .exec(input)?.[1] ?? "";
  const lastDigit = /.*(\d|one|two|three|four|five|six|seven|eight|nine).*?$/
    .exec(input)?.[1] ?? "";
  return Number(sanitizeDigitName(firstDigit) + sanitizeDigitName(lastDigit));
}

const sum2 = lines
  .map((line) => getSumOfFirstAndLastDigits2(line))
  .reduce((total, current) => total + current);
console.log(sum2);
