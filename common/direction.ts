import { Vector, subtractVectors, vectorsEqual } from "./vector.ts";

export enum Direction {
  North,
  East,
  West,
  South
}

export const Directions = [ Direction.North, Direction.East, Direction.West, Direction.South ];

export const UnitVector = {
  North: { rowIndex: - 1, charIndex: 0 },
  East: { rowIndex: 0, charIndex: 1 },
  South: { rowIndex: + 1, charIndex: 0 },
  West: { rowIndex: 0, charIndex: -1 }
};

export const unitVectorByDirection = new Map<Direction, Vector>([
  [ Direction.North, UnitVector.North ],
  [ Direction.East, UnitVector.East ],
  [ Direction.South, UnitVector.South ],
  [ Direction.West, UnitVector.West ]
]);

export function getOppositeDirection(direction: Direction): Direction {
  return Directions[(Directions.indexOf(direction) + Directions.length / 2) % Directions.length];
}

export function getDirectionToNeighbor(origin: Vector, neighbor: Vector): Direction {
  const difference = subtractVectors(origin, neighbor);
  const direction = Array.from(unitVectorByDirection.entries()).find(([_, vector]) => vectorsEqual(difference, vector))?.[0];
  if (direction == null) {
    throw new Error(`Coordinates ${origin} and ${neighbor} are not neighboring`);
  }

  return direction;
}