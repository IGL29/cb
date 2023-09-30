export function throttle(callback: (...args: any) => any, timeout: number): (...args: any) => any {
  let lastTime: number | null = null;

  return function (...args: any) {
    const currentTime = Date.now();

    if (lastTime && currentTime - lastTime < timeout) {
      return;
    }
    callback(...args);
    lastTime = currentTime;
  };
}
