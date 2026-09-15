import { useEffect, useRef, useState } from 'react';
import { applyPetAction } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { getPetHint, petLevel, tickPetOnVisit, type PetActionId } from '../lib/pet';

export function useYoungLeoPet() {
  const { demo, setDemo } = useDemoState();
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);
  const [reactToken, setReactToken] = useState(0);
  const tickedRef = useRef(false);

  useEffect(() => {
    if (tickedRef.current) {
      return;
    }
    tickedRef.current = true;
    setDemo((state) => ({
      ...state,
      pet: tickPetOnVisit(state.pet, new Date()),
    }));
  }, [setDemo]);

  useEffect(() => {
    if (levelUpLevel === null) {
      return;
    }
    const timer = window.setTimeout(() => setLevelUpLevel(null), 2500);
    return () => window.clearTimeout(timer);
  }, [levelUpLevel]);

  const hint = getPetHint(demo.pet, demo.starsBalance);

  function handleAction(action: PetActionId) {
    const prevLevel = petLevel(demo.pet.xp);
    const result = applyPetAction(demo, action);
    if (result === 'insufficient') {
      return false;
    }
    setDemo(result);
    setPulse(true);
    setReactToken((n) => n + 1);
    window.setTimeout(() => setPulse(false), 400);
    const nextLevel = petLevel(result.pet.xp);
    if (nextLevel > prevLevel) {
      setLevelUpLevel(nextLevel);
    }
    return true;
  }

  return {
    demo,
    hint,
    levelUpLevel,
    pulse,
    reactToken,
    bumpLion: () => setReactToken((n) => n + 1),
    handleAction,
  };
}
