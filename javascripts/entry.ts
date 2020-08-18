import parse from 'node-html-parser';
import extractCubics from './utils/cubicCollections/extractCubics';
import { Point } from './types';
import alignRotation from './utils/cubicCollections/alignRotation';
import arcLength from './utils/bezierLength';
import splitAtLength from './utils/splitAtLength';
import lerpMorph from './utils/cubicCollections/lerpMorph';

function init() {
  const d1 = 'M 3.58694 -42.7321 A 4 4 0 0 0 -3.58694 -42.7321 L -13.7639 -22.1112 A 4 4 0 0 1 -16.7757 -19.923 L -39.5322 -16.6163 A 4 4 0 0 0 -41.749 -9.79354 L -25.2823 6.25756 A 4 4 0 0 1 -24.1319 9.79808 L -28.0192 32.4626 A 4 4 0 0 0 -22.2154 36.6793 L -1.86136 25.9786 A 4 4 0 0 1 1.86136 25.9786 L 22.2154 36.6793 A 4 4 0 0 0 28.0192 32.4626 L 24.1319 9.79808 A 4 4 0 0 1 25.2823 6.25756 L 41.749 -9.79354 A 4 4 0 0 0 39.5322 -16.6163 L 16.7757 -19.923 A 4 4 0 0 1 13.7639 -22.1112 Z';
  const d2 = 'M -50 -50 L -25 -50 L -25 -25 Z';
  demo(d1, d2);
}

document.addEventListener('DOMContentLoaded', () => {
  const p = parse('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 186.5 322.77"><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M179.85,115.38a31.48,31.48,0,0,0-3.61-4.77l-5.1-1c.34-.85.69-1.74,1-2.65,3.21-8.51,6.33-19.42,6.33-27.95,0-43.56-38.13-79-85-79s-85,35.44-85,79c0,8.38,3.14,19.23,6.18,27.52l.77,2-4.06.53a28.18,28.18,0,0,0-4.71,5.64C0,125.18,0,139,0,146c0,8.41,0,30.76,17,40.48a67,67,0,0,0,6.17,3.1L94.18,322.77l68.65-133.32q3.21-1.24,6-2.6C186.5,178.3,186.5,155.67,186.5,146,186.5,139.8,186.5,126.16,179.85,115.38Zm-21,50.77a65.64,65.64,0,0,1-7.52,3l-1.23.4c-1.89.62-3.87,1.2-5.9,1.72-29.29,7.64-73.43,8.11-100.51,1.05-1.62-.42-3.18-.86-4.66-1.33l-.71-.23q-1.52-.5-2.91-1l0,0a47.12,47.12,0,0,1-7-3.21c-3.57-2-5.38-9-5.38-20.52,0-12.13,1.7-19.09,5.05-20.69.54-.26,1.09-.51,1.66-.76a2.8,2.8,0,0,0,.31.09q.57.19,1.17.36l1.19.35.95.26c.81.23,1.64.44,2.48.66,2.76.68,5.67,1.3,8.7,1.85l1.49.27,1,.17,1.5.25L50,129l1.34.2q1.89.27,3.84.51c.7.09,1.4.18,2.11.25l1.21.14,1.16.12c4.63.49,9.43.85,14.31,1.1l2.1.1c.7,0,1.4.06,2.1.09,1.41.05,2.83.1,4.24.13,2.84.08,5.69.11,8.54.11,1,0,2,0,3,0l2,0c3.34,0,6.67-.14,10-.28l2.28-.1,3.6-.19,2-.13c4.49-.29,8.9-.66,13.17-1.12l1.77-.19,2.46-.29,2.07-.26,2-.26c1.18-.17,2.35-.33,3.5-.51l1.37-.21,1.15-.19c2.58-.42,5.08-.87,7.48-1.36l1.35-.28.85-.18,1.86-.42,2-.48,1.56-.4.81-.21.48.27c3.82,2.15,5.75,9.23,5.75,21S161.93,164.65,158.83,166.15ZM93.5,23c34.19,0,62,25.12,62,56a51.42,51.42,0,0,1-6,23.93c-1,.24-2,.48-3,.71s-1.93.42-2.93.62l-1.36.27-2.11.39-1.37.23c-7.77,1.32-16.59,2.31-25.82,2.93l-3.27.2c-2.54.14-5.11.26-7.69.34l-2,.06c-1.58,0-3.16.08-4.75.1l-2,0c-1.6,0-3.19,0-4.79,0l-1.86,0c-1.14,0-2.28,0-3.41-.06l-1.87,0c-.63,0-1.25,0-1.87-.06l-1.85-.07c-5.54-.23-11-.61-16.09-1.16l-1.7-.19-1.68-.2c-4.54-.56-8.84-1.26-12.78-2.09-.89-.19-1.76-.39-2.61-.59L41.48,104c-.74-.18-1.45-.37-2.15-.57-.39-.1-.77-.21-1.15-.33l-.74-.22A51.37,51.37,0,0,1,31.5,79C31.5,48.12,59.31,23,93.5,23Zm.32,250.23L53.56,197.75c1.31.2,2.64.39,4,.56.87.12,1.75.23,2.63.33l2.13.24,2.31.24,2.21.2c1.52.14,3,.26,4.6.36l1.55.11,2.16.13,1,.05,1.59.07c4.18.19,8.43.29,12.7.29l3.91,0q3.93,0,7.86-.21c1.31-.05,2.61-.12,3.92-.19s2.6-.15,3.9-.24,2.59-.18,3.88-.29,2.27-.19,3.39-.3q5-.48,9.93-1.14l1.85-.26,1.84-.27,1.83-.29.35-.05Z"/></g></g></svg>');
  console.log(p);
  init();
});

function makePath(p: Point[], color: string) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`);
  path.setAttribute('stroke', color);
  path.setAttribute('fill', 'transparent');
  document.getElementsByTagName('svg')[0].appendChild(path);
}

function findSegment(breakPercents: number[], target: number) {
  let floor = 0;
  let ceil = breakPercents.length;

  while (ceil - floor > 0) {
    const idx = Math.floor((ceil + floor) / 2);
    if (target > breakPercents[idx]) {
      floor = idx + 1;
    } else {
      ceil = idx - 1;
    }
  }

  return target < breakPercents[floor] ? floor - 1 : floor;
}

function demo(d1: string, d2: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  document.body.appendChild(svg);

  const getCurve = lerpMorph(d1, d2);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', getCurve(0));
  svg.appendChild(path);

  animate(3000, easeInOutQuint, (progress) => {
    path.setAttribute('d', getCurve(progress));
  });
}

function animate(millis:number, ease: (i: number) => number, task: (progress: number) => void) {
  const t0 = Date.now();
  function step() {
    const t = Date.now();
    if (t - t0 > millis) return;
    const i = (t - t0) / millis;
    const p = ease(i);
    task(p);
    requestAnimationFrame(step);
  }
  step();
}

function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
