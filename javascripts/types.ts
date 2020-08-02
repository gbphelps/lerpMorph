export type AbsoluteCommandType = 'H' | 'V' | 'M' | 'L' | 'C' | 'Q' | 'S' | 'T' | 'A' | 'Z';
export type RelativeCommandType = 'h' | 'v' | 'm' | 'l' | 'c' | 'q' | 's' | 't' | 'a' | 'z';
export type AbsoluteCommand = {
  type: AbsoluteCommandType,
  params: number[],
}

export interface HorizontalCommand {
  type: 'H' | 'h',
  params: number[]
}

export interface VerticalCommand {
  type: 'V' | 'v',
  params: number[]
}

export interface MoveCommand {
  type: 'M' | 'm',
  params: number[]
}

export interface LineCommand {
  type: 'L' | 'l',
  params: number[]
}

export interface CubicCommand {
  type: 'C' | 'c',
  params: number[]
}

export interface ShortCubicCommand {
  type: 'S' | 's',
  params: number[]
}

export interface QuadraticCommand {
  type: 'Q' | 'q',
  params: number[]
}

export interface ShortQuadraticCommand {
  type: 'T' | 't',
  params: number[]
}

export interface EndCommand {
  type: 'Z' | 'z',
  params: number[]
}

export interface ArcCommand {
  type: 'A' | 'a',
  params: number[]
}

export type AnyCommand = |
  HorizontalCommand |
  VerticalCommand |
  MoveCommand |
  LineCommand |
  CubicCommand |
  ShortCubicCommand |
  QuadraticCommand |
  ShortQuadraticCommand |
  ArcCommand |
  EndCommand

export const toUpperCaseMap: Record<RelativeCommandType|AbsoluteCommandType, AbsoluteCommandType> = {
  h: 'H',
  v: 'V',
  m: 'M',
  l: 'L',
  c: 'C',
  s: 'S',
  q: 'Q',
  t: 'T',
  a: 'A',
  z: 'Z',
  H: 'H',
  V: 'V',
  M: 'M',
  L: 'L',
  C: 'C',
  S: 'S',
  Q: 'Q',
  T: 'T',
  A: 'A',
  Z: 'Z',
};

export interface Point {
    x: number,
    y: number,
  }

export interface Vector extends Point {}

export type QuadPoints = [Point, Point, Point, Point];
export type QuadNums = [number, number, number, number];

export type Matrix = number[][];
