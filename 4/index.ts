import { splitAndParseNumbers } from "../common/functions/split-and-parse-numbers.ts";

const input = await Deno.readTextFile('input.txt');
const lines = input.split('\n');

class Card {
  readonly cardNumber: number;
  readonly winningNumbers: number[];
  readonly ownNumbers: number[];
  readonly points: number;
  readonly matchCount: number;
  instanceCount = 1;

  constructor(input: string) {
    const result = /Card\s+(?<cardNumber>\d+):(?<winningNumbers>[\s\d]+)\|(?<ownNumbers>[\s\d]+)/.exec(input);
    if (result == null || result.groups == null) {
      throw new Error(`Invalid input: ${input}`);
    }

    const { cardNumber, winningNumbers, ownNumbers } = result.groups;
    this.cardNumber = Number(cardNumber);
    this.winningNumbers = splitAndParseNumbers(winningNumbers);
    this.ownNumbers = splitAndParseNumbers(ownNumbers);
    this.matchCount = this.countMatches();
    this.points = this.calculatePoints();
  }

  private countMatches(): number {
    return this.ownNumbers
      .filter(ownNumber => this.winningNumbers.includes(ownNumber))
      .length;
  }
  
  private calculatePoints(): number {
    if (this.matchCount === 0) {
      return 0;
    }
    
    return Math.pow(2, this.matchCount - 1);
  }
}

const cards = lines.map(line => new Card(line));

// Part 1

const sum = cards.reduce((total, card) => total + card.points, 0);
console.log(sum);

// Part 2

for (const [index, card] of cards.entries()) {
  const cardsToCopy = cards.slice(index + 1, Math.min(cards.length, index + 1 + card.matchCount));
  for (const cardToCopy of cardsToCopy) {
    cardToCopy.instanceCount += card.instanceCount;
  }
}

const sum2 = cards.reduce((total, card) => total + card.instanceCount, 0);
console.log(sum2);