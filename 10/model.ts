import { Direction, Directions, getDirectionToNeighbor, getOppositeDirection, unitVectorByDirection } from "../common/direction.ts";
import { Vector, addVectors, vectorToString } from "../common/vector.ts";

enum Tile {
  VerticalPipe = '|',
  HorizontalPipe = '-',
  NEPipe = 'L',
  NWPipe = 'J',
  SWPipe = '7',
  SEPipe = 'F',
  Empty = '.',
  StartingPoint = 'S'
}

const allowedSymbols = Object.values(Tile) as string[];

const entryDirectionsByTile = new Map<Tile, Direction[]>([
  [ Tile.VerticalPipe, [ Direction.North, Direction.South ] ],
  [ Tile.HorizontalPipe, [ Direction.West, Direction.East ] ],
  [ Tile.NEPipe, [ Direction.North, Direction.East ] ],
  [ Tile.NWPipe, [ Direction.North, Direction.West ] ],
  [ Tile.SWPipe, [ Direction.South, Direction.West ] ],
  [ Tile.SEPipe, [ Direction.South, Direction.East ] ]
]);

function hasEntryFrom(tile: Tile, direction: Direction) {
  const entryDirections = entryDirectionsByTile.get(tile);
  if (entryDirections == null) {
    throw new Error(`Tile ${tile} does not have entries`);
  }

  return entryDirections.includes(direction);
}

export class Network {
  private readonly tiles: Tile[][];

  constructor(
    symbols: string[][]
  ) {
    for (const row of symbols) {
      for (const symbol of row) {
        if (!allowedSymbols.includes(symbol)) {
          throw new Error(`Unknown symbol: ${symbol}`);
        }
      }
    }

    this.tiles = symbols as Tile[][];
  }

  get startPosition(): Vector {
    for (let rowIndex = 0; rowIndex < this.tiles.length; ++rowIndex) {
      for (let charIndex = 0; charIndex < this.tiles[rowIndex].length; ++charIndex) {
        if (this.tiles[rowIndex][charIndex] === Tile.StartingPoint) {
          return { rowIndex, charIndex };
        }
      }
    }
    
    throw new Error('No starting point found');
  }

  get loopLength(): number {
    const startPosition = this.startPosition;
    
    let stepCount = 0;
    let currentPosition = startPosition;
    let currentDirection: Direction | undefined = undefined;
    while (stepCount === 0 || !(currentPosition.charIndex === startPosition.charIndex && currentPosition.rowIndex === startPosition.rowIndex)) {
      const nextPosition = this.findNextPipeAt(currentPosition, currentDirection);
      currentDirection = getDirectionToNeighbor(currentPosition, nextPosition);
      currentPosition = nextPosition;
      ++stepCount;
    }

    return stepCount;
  }

  get enclosedTileCount(): number {
    const enclosedTiles: Tile[] = [];

    throw new Error('Not implemented');

    return enclosedTiles.length;
  }

  private isWithinBoundaries(coords: Vector): boolean {
    return coords.rowIndex > 0 && coords.rowIndex < this.tiles.length &&
      coords.charIndex > 0 && coords.charIndex < this.tiles[coords.rowIndex].length;
  }

  private getTileAt(coords: Vector): Tile {
    return this.tiles[coords.rowIndex][coords.charIndex];
  }

  private findNextPipeAt(coords: Vector, entryDirection?: Direction): Vector {
    const tile = this.getTileAt(coords);
    if (tile === Tile.Empty) {
      throw new Error(`Empty tile at ${vectorToString(coords)}`);
    }

    if (tile === Tile.StartingPoint) {
      const exitDirections = Directions.filter(direction => direction !== entryDirection);
      for (const exitDirection of exitDirections) {
        const neighborCoords = addVectors(coords, unitVectorByDirection.get(exitDirection)!);
        const neighborEntryDirection = getOppositeDirection(exitDirection);
        if (this.isWithinBoundaries(neighborCoords) && hasEntryFrom(this.getTileAt(neighborCoords), neighborEntryDirection)) {
          return neighborCoords;
        }
      }
      
      throw new Error(`No neighboring pipe found from ${vectorToString(coords)}`);
    }

    const entryDirections = entryDirectionsByTile.get(tile);
    if (entryDirections == null) {
      throw new Error(`Unknown tile ${tile} at ${vectorToString(coords)}`);
    }

    const exitDirections = entryDirections.filter(direction => direction !== entryDirection);
    if (exitDirections.length === entryDirections.length) {
      throw new Error(`Invalid entry direction ${entryDirection} for pipe ${tile}`);
    }

    if (exitDirections.length === 0) {
      throw new Error(`No exit directions found for pipe ${tile}`);
    }

    if (exitDirections.length > 1) {
      throw new Error(`Multiple exit directions found for pipe ${tile}`);
    }

    return addVectors(coords, unitVectorByDirection.get(exitDirections[0])!);
  }
}
