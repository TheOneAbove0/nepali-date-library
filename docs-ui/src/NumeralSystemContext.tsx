import { createContext, useContext, useState, type ReactNode } from 'react';

export type NumeralSystem = 'nepali' | 'latin';

interface NumeralSystemContextValue {
  numeralSystem: NumeralSystem;
  setNumeralSystem: (system: NumeralSystem) => void;
}

const NumeralSystemContext = createContext<NumeralSystemContextValue>({
  numeralSystem: 'nepali',
  setNumeralSystem: () => {},
});

export function NumeralSystemProvider({ children }: { children: ReactNode }) {
  const [numeralSystem, setNumeralSystem] = useState<NumeralSystem>('nepali');

  return (
    <NumeralSystemContext.Provider value={{ numeralSystem, setNumeralSystem }}>
      {children}
    </NumeralSystemContext.Provider>
  );
}

export function useNumeralSystem() {
  return useContext(NumeralSystemContext);
}
