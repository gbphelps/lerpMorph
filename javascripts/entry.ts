import extractCubics from './utils/cubicCollections/extractCubics';
import { cubicsToPath } from './utils/sharedFunctions';
import lerpMorph from './utils/cubicCollections/lerpMorph';
import animateScript, { easeInOutQuint } from './utils/animateScript';
import absoluteCommands from './utils/absoluteCommands';
import parsePath from './utils/parsePath';

function lerper(path: SVGPathElement, aPath: string, bPath: string) {
  return function setPath(t: number) {
    path.setAttribute('d', lerpMorph(aPath, bPath)(1 - t));
  };
}

async function init() {
  const two = 'M220.51 545.21 L120.51 545.21 L120.51 158.42 L43.02 195.35 L0 105.07 L220.51 0 L220.51 545.21Z';
  const one = 'M0,148.92C0,12.92,146.5,0,178.25,0S356,10.92,356,148.92s-212,202-226,295H356v100H0c0-259,249.35-283.09,249.35-383S100,94.92,100,148.92Z';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.setAttribute('viewBox', '0 0 1000 1000');
  document.body.appendChild(svg);
  svg.appendChild(path);

  await animateScript(5000, easeInOutQuint, lerper(path, one, two));
  await animateScript(5000, easeInOutQuint, lerper(path, two, one));
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});
