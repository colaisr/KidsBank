import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DemoState } from '../data/demoBaseline';
import { readDemoState, resetDemoState, writeDemoState } from './demoState';

type DemoStateContextValue = {
  demo: DemoState;
  setDemo: (next: DemoState | ((current: DemoState) => DemoState)) => void;
  resetDemo: () => void;
};

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [demo, setDemoState] = useState<DemoState>(() => readDemoState());

  const setDemo = useCallback((next: DemoState | ((current: DemoState) => DemoState)) => {
    setDemoState((current) => {
      const resolved = typeof next === 'function' ? next(current) : next;
      writeDemoState(resolved);
      return resolved;
    });
  }, []);

  const resetDemo = useCallback(() => {
    const baseline = resetDemoState();
    setDemoState(baseline);
  }, []);

  const value = useMemo(
    () => ({
      demo,
      setDemo,
      resetDemo,
    }),
    [demo, setDemo, resetDemo],
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState(): DemoStateContextValue {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error('useDemoState must be used within DemoStateProvider');
  }
  return context;
}
