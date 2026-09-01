import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { PetHintResult } from '../../lib/pet';
import { petNeedsUrgentDot } from '../../lib/pet';
import type { PetState } from '../../data/demoBaseline';

type PetSpeechBubbleProps = {
  pet: PetState;
  starsBalance: number;
  hint: PetHintResult;
};

export function PetSpeechBubble({ pet, starsBalance, hint }: PetSpeechBubbleProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showDot = petNeedsUrgentDot(pet, starsBalance);

  const content = (
    <>
      {showDot ? (
        <span
          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
          aria-hidden="true"
        />
      ) : null}
      <p className="text-sm font-medium text-text">{t(`demo.pet.hints.${hint.hintId}`)}</p>
      {hint.navigable ? (
        <span className="ml-1 text-primary" aria-hidden="true">
          ›
        </span>
      ) : null}
    </>
  );

  if (hint.navigable && hint.navigateTo) {
    return (
      <button
        type="button"
        onClick={() => navigate(hint.navigateTo!)}
        className="relative mx-auto flex max-w-[220px] items-center justify-center rounded-2xl bg-surface px-4 py-2.5 shadow-md ring-1 ring-border transition active:scale-[0.98]"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="relative mx-auto max-w-[220px] rounded-2xl bg-surface px-4 py-2.5 text-center shadow-md ring-1 ring-border">
      {content}
    </div>
  );
}
