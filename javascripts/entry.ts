// import extractCubics from './utils/cubicCollections/extractCubics';
import { cubicsToPath } from './utils/sharedFunctions';
import lerpMorph from './utils/cubicCollections/lerpMorph';
import animateScript, { easeInOutQuint } from './utils/animateScript';

function init() {
  const d2 = 'M 12 0.297 c -6.63 0 -12 5.373 -12 12 c 0 5.303 3.438 9.8 8.205 11.385 c 0.6 0.113 0.82 -0.258 0.82 -0.577 c 0 -0.285 -0.01 -1.04 -0.015 -2.04 c -3.338 0.724 -4.042 -1.61 -4.042 -1.61 C 4.422 18.07 3.633 17.7 3.633 17.7 c -1.087 -0.744 0.084 -0.729 0.084 -0.729 c 1.205 0.084 1.838 1.236 1.838 1.236 c 1.07 1.835 2.809 1.305 3.495 0.998 c 0.108 -0.776 0.417 -1.305 0.76 -1.605 c -2.665 -0.3 -5.466 -1.332 -5.466 -5.93 c 0 -1.31 0.465 -2.38 1.235 -3.22 c -0.135 -0.303 -0.54 -1.523 0.105 -3.176 c 0 0 1.005 -0.322 3.3 1.23 c 0.96 -0.267 1.98 -0.399 3 -0.405 c 1.02 0.006 2.04 0.138 3 0.405 c 2.28 -1.552 3.285 -1.23 3.285 -1.23 c 0.645 1.653 0.24 2.873 0.12 3.176 c 0.765 0.84 1.23 1.91 1.23 3.22 c 0 4.61 -2.805 5.625 -5.475 5.92 c 0.42 0.36 0.81 1.096 0.81 2.22 c 0 1.606 -0.015 2.896 -0.015 3.286 c 0 0.315 0.21 0.69 0.825 0.57 C 20.565 22.092 24 17.592 24 12.297 c 0 -6.627 -5.373 -12 -12 -12 Z';
  const d = 'M 3.58694 -42.7321 A 4 4 0 0 0 -3.58694 -42.7321 L -13.7639 -22.1112 A 4 4 0 0 1 -16.7757 -19.923 L -39.5322 -16.6163 A 4 4 0 0 0 -41.749 -9.79354 L -25.2823 6.25756 A 4 4 0 0 1 -24.1319 9.79808 L -28.0192 32.4626 A 4 4 0 0 0 -22.2154 36.6793 L -1.86136 25.9786 A 4 4 0 0 1 1.86136 25.9786 L 22.2154 36.6793 A 4 4 0 0 0 28.0192 32.4626 L 24.1319 9.79808 A 4 4 0 0 1 25.2823 6.25756 L 41.749 -9.79354 A 4 4 0 0 0 39.5322 -16.6163 L 16.7757 -19.923 A 4 4 0 0 1 13.7639 -22.1112';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.setAttribute('viewBox', '-50 -50 100 100');

  document.body.appendChild(svg);
  svg.appendChild(path);

  function aFunc(t: number) {
    path.setAttribute('d', lerpMorph(d, d2)(1 - t));
  }

  animateScript(5000, easeInOutQuint, aFunc);
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});
