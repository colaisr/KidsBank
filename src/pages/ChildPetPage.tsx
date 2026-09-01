import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { PetActionButtons } from '../components/pet/PetActionButtons';
import { PetCharacter } from '../components/pet/PetCharacter';
import { PetLevelBadge } from '../components/pet/PetLevelBadge';
import { PetNeedBars } from '../components/pet/PetNeedBars';
import { PetSpeechBubble } from '../components/pet/PetSpeechBubble';
import { applyPetAction } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { getPetHint, petLevel, tickPetOnVisit, type PetActionId } from '../lib/pet';

export function ChildPetPage() {
  const { t } = useTranslation();
  const { demo, setDemo } = useDemoState();
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);
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
      return;
    }
    setDemo(result);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 400);
    const nextLevel = petLevel(result.pet.xp);
    if (nextLevel > prevLevel) {
      setLevelUpLevel(nextLevel);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.pet" presenterId="child-pet" />

      {levelUpLevel !== null ? (
        <div className="mx-4 mt-3 rounded-card bg-accent-kids px-4 py-2 text-center text-sm font-semibold text-white shadow-md">
          {t('ui.pet.levelUp', { level: levelUpLevel })}
        </div>
      ) : null}

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-center">
          <PetLevelBadge xp={demo.pet.xp} />
        </div>

        <PetSpeechBubble pet={demo.pet} starsBalance={demo.starsBalance} hint={hint} />
        <PetCharacter pulse={pulse} />
        <PetNeedBars
          fullness={demo.pet.fullness}
          joy={demo.pet.joy}
          energy={demo.pet.energy}
        />
        <PetActionButtons
          starsBalance={demo.starsBalance}
          taskBuff={demo.pet.taskBuff}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}
