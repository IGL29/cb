export function lastCalled(callback: (...args: any) => any, timestamp: number) {
  let timerId: ReturnType<typeof setTimeout> | null;

  return function (...args: any) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, timestamp);
  };
}
