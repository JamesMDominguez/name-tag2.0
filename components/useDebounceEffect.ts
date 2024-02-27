import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(timer);
    };
  }, deps);
}
