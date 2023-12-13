export interface Vector {
  rowIndex: number;
  charIndex: number;
}

export function addVectors(vect1: Vector, vect2: Vector): Vector {
  return {
    rowIndex: vect1.rowIndex + vect2.rowIndex,
    charIndex: vect1.charIndex + vect2.charIndex
  };
}

export function subtractVectors(vect1: Vector, vect2: Vector): Vector {
  return {
    rowIndex: vect1.rowIndex - vect2.rowIndex,
    charIndex: vect1.charIndex - vect2.charIndex
  };
}

export function scaleVector(vect: Vector, scale: number): Vector {
  return {
    rowIndex: vect.rowIndex * scale,
    charIndex: vect.charIndex * scale
  };
}

export function vectorsEqual(vect1: Vector, vect2: Vector): boolean {
  return vect1.rowIndex === vect2.rowIndex && vect1.charIndex === vect2.charIndex;
}

export function vectorToString(coords: Vector): string {
  return `(${coords.rowIndex}, ${coords.charIndex})`;
}