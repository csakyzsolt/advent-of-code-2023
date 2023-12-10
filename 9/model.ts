export class Sequence {
  readonly diffSequence?: Sequence;

  constructor(
    readonly values: number[]
  ) {
    this.diffSequence = this.calculateDiffSequence();
  }

  private calculateDiffSequence(): Sequence | undefined {
    if (this.values.every(value => value === 0)) {
      return undefined;
    }

    return new Sequence(this.values
      .slice(0, this.values.length - 1)
      .map((value, index) => this.values[index + 1] - value));
  }

  extrapolateSuccessor(): number {
    const lastValue = this.values[this.values.length - 1];
    if (this.diffSequence == null) {
      return lastValue;
    }

    return lastValue + this.diffSequence.extrapolateSuccessor();
  }

  extrapolatePredecessor(): number {
    const firstValue = this.values[0];
    if (this.diffSequence == null) {
      return firstValue;
    }

    return firstValue - this.diffSequence.extrapolatePredecessor();
  }
}