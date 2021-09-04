export default function animate(
  millis: number,
  ease: (i: number) => number,
  task: (progress: number) => void,
): Promise<void> {
  return new Promise((r) => {
    const t0 = Date.now();
    function step() {
      const t = Date.now();
      const percent = Math.min((t - t0) / millis, 1);
      const progress = ease(percent);
      task(progress);

      if (percent === 1) {
        r();
      } else {
        requestAnimationFrame(step);
      }
    }
    step();
  });
}

export function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  // eslint-disable-next-line no-nested-ternary
  return x === 0
    ? 0
    : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
