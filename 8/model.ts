export type Direction = 'L' | 'R';

export class Instructions {
  constructor(
    readonly instructions: Direction[]
  ) {}

  getDirectionAt(stepNumber: number): Direction {
    return this.instructions[stepNumber % this.instructions.length];
  }
}

export class Node {
  readonly children = new Map<Direction, Node>();

  constructor(
    readonly name: string
  ) {}

  setChild(direction: Direction, node: Node): void {
    this.children.set(direction, node);
  }

  getChild(direction: Direction): Node {
    const child = this.children.get(direction);
    if (child == null) {
      throw new Error(`Child in direction ${direction} not found for node ${this.name}`);
    }

    return child;
  }
}

export class GraphBuilder {
  private readonly nodes = new Map<string, Map<Direction, string>>;

  addNode(name: string, left: string, right: string): void {
    this.nodes.set(name, new Map<Direction, string>([ [ 'L', left ], [ 'R', right ] ]));
  }

  build(): Node[] {
    const unprocessedNodes = Array.from(this.nodes.keys()).map(name => new Node(name));
    const nodes: Node[] = unprocessedNodes.slice();
    while (unprocessedNodes.length > 0) {
      const nodeToProcess = unprocessedNodes.splice(0, 1)[0];
      const children = this.nodes.get(nodeToProcess.name)!;
      // console.debug(processedNodes.length, 'Processing node', nodeToProcess.name, 'with children', children);

      const leftNodeName = children.get('L')!;
      let leftNode = nodes.find(node => node.name === leftNodeName);
      if (leftNode == null) {
        // console.debug('Creating left child', leftNodeName);
        leftNode = new Node(leftNodeName);
      }

      nodeToProcess.setChild('L', leftNode);

      const rightNodeName = children.get('R')!;
      let rightNode = nodes.find(node => node.name === rightNodeName);
      if (rightNode == null) {
        // console.debug('Creating right child', rightNodeName);
        rightNode = new Node(rightNodeName);
      }

      nodeToProcess.setChild('R', rightNode);
    }

    return nodes;
  }
}

export abstract class GraphTraversal<TConfiguration> {
  protected _currentConfiguration: TConfiguration;
  protected _stepCount = 0;

  constructor(
    readonly startConfiguration: TConfiguration,
    readonly stopCondition: (configuration: TConfiguration, stepCount: number) => boolean,
    readonly instructions: Instructions
  ) {
    this._currentConfiguration = startConfiguration;
  }

  get currentConfiguration(): TConfiguration {
    return this._currentConfiguration;
  }

  get stepCount(): number {
    return this._stepCount;
  }

  get hasNext(): boolean {
    return !this.stopCondition(this.currentConfiguration, this._stepCount);
  }

  next(): TConfiguration {
    const direction = this.instructions.getDirectionAt(this.stepCount);
    this._currentConfiguration = this.getNextConfigurationInDirection(direction);
    ++this._stepCount;

    // this.printCurrentConfiguration();

    return this._currentConfiguration;
  }

  run(): void {
    while (this.hasNext) {
      this.next();
    }
  }

  protected abstract getNextConfigurationInDirection(direction: Direction): TConfiguration;

  protected printCurrentConfiguration(): void {
    console.debug('Configuration at step', this.stepCount, 'is', this.configurationToString(this.currentConfiguration));
  }

  protected abstract configurationToString(configuration: TConfiguration): string;
}

export class SingleGraphTraversal extends GraphTraversal<Node> {
  protected override getNextConfigurationInDirection(direction: Direction): Node {
    return this._currentConfiguration.getChild(direction);
  }

  protected override configurationToString(configuration: Node): string {
    return configuration.name;
  }
}

export class MultiGraphTraversal extends GraphTraversal<Node[]> {
  protected override getNextConfigurationInDirection(direction: Direction): Node[] {
    return this._currentConfiguration.map(currentNode => currentNode.getChild(direction));
  }

  protected configurationToString(configuration: Node[]): string {
    return configuration.map(node => node.name).join(' ');
  }
}

function isPrime(input: number): boolean {
  if (input <= 1) {
    return false;
  }

  for (let i = 2; i < input; ++i) {
    if (input % i === 0) {
      return false;
    }
  }

  return true;
}

function findLeastPrimeDivisor(input: number): number {
  if (input <= 1) {
    throw new Error(`No prime divisor exists for ${input}`);
  }

  for (let i = 2; i <= input / 2; ++i) {
    if (input % i === 0) {
      return i;
    }
  }

  throw new Error(`No prime divisor exists for ${input}`);
}

function primeFactorize(input: number): number[] {
  const factors = [ input ];
  let indexOfFirstNotPrime = 0;
  while (indexOfFirstNotPrime < factors.length) {
    const factor = factors[indexOfFirstNotPrime];
    if (!isPrime(factor)) {
      const leastPrimeDivisor = findLeastPrimeDivisor(factor);
      factors.splice(indexOfFirstNotPrime, 1, leastPrimeDivisor, factor / leastPrimeDivisor);
    }

    ++indexOfFirstNotPrime;
  }

  return factors.sort();
}

export function leastCommonMultipleOf(numbers: number[]): number {
  const primeFactorizations = numbers.map(primeFactorize);

  // console.debug('Prime factorizations:', primeFactorizations);

  const primeFactorizationAggregates = primeFactorizations.map(primeFactorization => primeFactorization.reduce(
    (countByFactor, factor) => countByFactor.set(factor, (countByFactor.get(factor) ?? 0) + 1),
    new Map<number, number>()
  ));

  // console.debug('Prime factorization aggregates:', primeFactorizationAggregates);

  const greatestFactor = Math.max(...primeFactorizationAggregates.map(aggregate => Math.max(...aggregate.keys())));

  // console.debug('Greatest factor:', greatestFactor);

  const primeFactorizationOfLcm = new Map<number, number>();
  for (let factor = 2; factor <= greatestFactor; ++factor) {
    if (isPrime(factor)) {
      const mostOccurences = Math.max(...primeFactorizationAggregates
        .map(aggregate => aggregate.get(factor))
        .filter((factor): factor is number => factor != null));
      if (mostOccurences > 0) {
        primeFactorizationOfLcm.set(factor, mostOccurences);
      }
    }
  }

  // console.debug('Prime factorization of LCM:', primeFactorizationOfLcm);

  return Array.from(primeFactorizationOfLcm.entries()).reduce((lcm, [factor, count]) => lcm * Math.pow(factor, count), 1);
}