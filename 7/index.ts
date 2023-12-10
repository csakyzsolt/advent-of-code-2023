import { printSolution } from "../common/functions/print-solution.ts";
import { readInput } from "../common/functions/read-input.ts";

const input = await readInput();

type Card = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

class Hand {
  protected readonly countByCard: Map<Card, number>;
  protected readonly cardCounts: number[];
  protected readonly cardTypes: Card[];
  
  constructor(
    readonly cards: Card[],
    readonly bidValue: number
  ) {
    this.countByCard = cards.reduce((map, card) => map.set(card, (map.get(card) ?? 0) + 1), new Map<Card, number>());
    this.cardCounts = Array.from(this.countByCard.values());
    this.cardTypes = Array.from(this.countByCard.keys());
  }

  protected get isFiveOfAKind(): boolean {
    return this.cardTypes.length === 1;
  }

  protected get isFourOfAKind(): boolean {
    return this.cardCounts.some(count => count === 4);
  }

  protected get isFullHouse(): boolean {
    return this.cardTypes.length === 2 && [2, 3].every(count => this.cardCounts.includes(count));
  }

  protected get isThreeOfAKind(): boolean {
    return this.cardTypes.length === 3 && this.cardCounts.some(count => count === 3);
  }

  protected get isTwoPair(): boolean {
    return this.cardCounts.filter(count => count === 2).length === 2;
  }

  protected get isOnePair(): boolean {
    return this.cardTypes.length >= 3 && this.cardCounts.some(count => count === 2);
  }

  protected get isHighCard(): boolean {
    return this.cardTypes.length === 5;
  }

  get value(): number {
    if (this.isFiveOfAKind) return 7;
    if (this.isFourOfAKind) return 6;
    if (this.isFullHouse) return 5;
    if (this.isThreeOfAKind) return 4;
    if (this.isTwoPair) return 3;
    if (this.isOnePair) return 2;
    if (this.isHighCard) return 1;
    return 0;
  }
}

function compareHandsByCards(hand1: Hand, hand2: Hand, cardByValue: Map<Card, number>): number {
  for (let cardIndex = 0; cardIndex < hand1.cards.length; ++cardIndex) {
    const diff = cardByValue.get(hand1.cards[cardIndex])! - cardByValue.get(hand2.cards[cardIndex])!;
    if (diff !== 0) return diff;
  }

  return 0;
}

function byValue(cardByValue: Map<Card, number>): (hand1: Hand, hand2: Hand) => number {
  return (hand1, hand2) => {
    const diff = hand1.value - hand2.value;
    if (diff !== 0) {
      return diff;
    }

    return compareHandsByCards(hand1, hand2, cardByValue);
  }
}

// Part 1

const allCards: Card[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardByValue = new Map<Card, number>(allCards.map((name, value) => [name, value + 2]));

const hands = input.split('\n').map(line => {
  const parts = /(?<hand>[23456789TJQKA]{5}) (?<bid>\d+)/.exec(line);
  if (parts?.groups == null) {
    throw new Error(`Error parsing line ${line}`);
  }

  return new Hand(parts.groups.hand.split('') as Card[], Number(parts.groups.bid));
});

const winnings = hands.sort(byValue(cardByValue)).reduce((total, hand, index) => total + hand.bidValue * (index + 1), 0);
printSolution(1, winnings);

// Part 2

const allCards2: Card[] = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
const cardByValue2 = new Map<Card, number>(allCards2.map((name, value) => [name, value + 1]));

class HandWithJokers extends Hand {
  protected override get isFiveOfAKind(): boolean {
    if (super.isFiveOfAKind) {
      return true;
    }
    
    return this.cardTypes.length === 2 && this.cards.includes('J');
  }

  protected override get isFourOfAKind(): boolean {
    if (super.isFourOfAKind) {
      return true;
    }

    const jokerCount = this.countByCard.get('J');
    if (jokerCount == null || jokerCount === 0) {
      return false;
    }
    
    return jokerCount === 3 ||
      Array.from(this.countByCard.entries()).some(([card, count]) => card !== 'J' && jokerCount + count === 4);
  }

  protected override get isFullHouse(): boolean {
    if (super.isFullHouse) {
      return true;
    }

    const jokerCount = this.countByCard.get('J');
    if (jokerCount == null || jokerCount === 0) {
      return false;
    }

    return jokerCount === 3 ||
      this.cardTypes.filter(card => card !== 'J').length === 2;
  }

  protected override get isThreeOfAKind(): boolean {
    if (super.isThreeOfAKind) {
      return true;
    }

    const jokerCount = this.countByCard.get('J');
    if (jokerCount == null || jokerCount === 0) {
      return false;
    }

    return jokerCount === 2 ||
      Array.from(this.countByCard.entries()).some(([card, count]) => card !== 'J' && count === 2);
  }

  protected override get isTwoPair(): boolean {
    if (super.isTwoPair) {
      return true;
    }

    const jokerCount = this.countByCard.get('J');
    if (jokerCount == null || jokerCount === 0) {
      return false;
    }

    return jokerCount === 2 ||
      Array.from(this.countByCard.entries()).some(([card, count]) => card !== 'J' && count === 2);
  }

  protected override get isOnePair(): boolean {
    if (super.isOnePair) {
      return true;
    }

    const jokerCount = this.countByCard.get('J');
    if (jokerCount == null || jokerCount === 0) {
      return false;
    }

    return jokerCount === 1;
  }
}

const hands2 = input.split('\n').map(line => {
  const parts = /(?<hand>[23456789TJQKA]{5}) (?<bid>\d+)/.exec(line);
  if (parts?.groups == null) {
    throw new Error(`Error parsing line ${line}`);
  }

  return new HandWithJokers(parts.groups.hand.split('') as Card[], Number(parts.groups.bid));
});

const winnings2 = hands2.sort(byValue(cardByValue2)).reduce((total, hand, index) => total + hand.bidValue * (index + 1), 0);
printSolution(2, winnings2);