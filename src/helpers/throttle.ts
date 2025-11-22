type ThrottledFunction<T extends (...args: unknown[]) => unknown> = {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;
  cancel: () => void;
};

const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ThrottledFunction<T> => {
  let lastCall = 0;
  let timeout: number | null = null;

  const throttledFunc: ThrottledFunction<T> = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func.apply(this, args);
        lastCall = Date.now();
        timeout = null;
      }, delay - (now - lastCall));
    }
  };

  throttledFunc.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return throttledFunc;
};

export default throttle;
