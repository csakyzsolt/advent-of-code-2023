import { splitAndParseNumbers } from "../common/functions/split-and-parse-numbers.ts";

const input = await Deno.readTextFile('input.txt');
const lines = input.split('\n');

class RangeMap {
  constructor(
    readonly destinationRangeStart: number,
    readonly sourceRangeStart: number,
    readonly rangeLength: number
  ) { }

  hasKey(key: number): boolean {
    return key >= this.sourceRangeStart && key < this.sourceRangeStart + this.rangeLength;
  }

  hasValue(value: number): boolean {
    return value >= this.destinationRangeStart && value < this.destinationRangeStart + this.rangeLength;
  }

  get(key: number): number {
    return this.destinationRangeStart + key - this.sourceRangeStart;
  }

  reverseGet(value: number): number {
    return this.sourceRangeStart + value - this.destinationRangeStart;
  }
}

class RangeMapGroup {
  constructor(
    readonly name: string,
    readonly rangeMaps: RangeMap[]
  ) { }

  get(key: number): number {
    // console.debug(`Looking up key ${key} in map ${this.name}`);
    const map = this.rangeMaps.find(map => map.hasKey(key));

    if (map == null) {
      return key;
    }
    
    return map.get(key);
  }

  reverseGet(value: number): number {
    // console.debug(`Reverse looking up value ${value} in map ${this.name}`);
    const map = this.rangeMaps.find(map => map.hasValue(value));

    if (map == null) {
      return value;
    }

    return map.reverseGet(value);
  }
}

function createRangeMapGroups(lines: string[]): RangeMapGroup[] {
  const maps: RangeMapGroup[] = [];
  let mapIndex = -1;
  for (const line of lines) {
    if (/map:/.test(line)) {
      mapIndex++;
      const mapName = /[a-z\-]+/.exec(line)?.[0] ?? '';
      maps.push(new RangeMapGroup(mapName, []));
    } else if (mapIndex >= 0 && /\d+/.test(line)) {
      const [ destinationRangeStart, sourceRangeStart, rangeLength ] = splitAndParseNumbers(line);
      maps[mapIndex].rangeMaps.push(new RangeMap(destinationRangeStart, sourceRangeStart, rangeLength));
    }
  }

  return maps;
}

const maps = createRangeMapGroups(lines);

// Part 1

function findLocationForSeed(seed: number, maps: RangeMapGroup[]): number {
  // console.debug(`Processing seed ${seed}`);
  return maps.reduce((key, mapGroup) => mapGroup.get(key), seed);
}

const seeds = splitAndParseNumbers(/seeds: ([\s\d]+)/.exec(lines[0])?.[1] ?? '');
if (seeds.length === 0) {
  throw new Error('No seed numbers found');
}

const locations = seeds.map(seed => findLocationForSeed(seed, maps));

const closestLocation = Math.min(...locations);
console.log(closestLocation);

// Part 2

function findSeedForLocation(location: number, mapsInReverse: RangeMapGroup[]): number {
  // console.debug(`Processing location ${location}`);
  return mapsInReverse.reduce((value, map) => map.reverseGet(value), location);
}

interface Range {
  start: number;
  length: number;
}

class Seeds {
  private readonly seedRanges: Range[];
  
  constructor(
    values: number[]
  ) {
    this.seedRanges = [];
    for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 2) {
      this.seedRanges.push({
        start: values[seedIndex],
        length: values[seedIndex + 1]
      });
    }
  }

  hasSeed(seed: number): boolean {
    return this.seedRanges.some(range => seed >= range.start && seed < range.start + range.length);
  }
}

const seeds2 = new Seeds(seeds);
const mapsInReverse = maps.slice().reverse();
for (let location = 0; location < Number.MAX_SAFE_INTEGER; ++location) {
  const seedAtLocation = findSeedForLocation(location, mapsInReverse);
  if (seeds2.hasSeed(seedAtLocation)) {
    console.log(location);
    break;
  }
}