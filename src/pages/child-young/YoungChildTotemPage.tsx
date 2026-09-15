import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { YoungLeoChat } from '../../components/child-young/YoungLeoChat';
import { YoungLeoPetActions } from '../../components/child-young/YoungLeoPetActions';
import { YoungLeoPetFlankMeters } from '../../components/child-young/YoungLeoPetNeedBars';
import { YoungLionTotem } from '../../components/child-young/YoungLionTotem';
import { useYoungLeoPet } from '../../hooks/useYoungLeoPet';
import { petLevel } from '../../lib/pet';

export function YoungChildTotemPage() {
  const { t } = useTranslation();
  const { demo, levelUpLevel, reactToken, bumpLion, handleAction } = useYoungLeoPet();
  const level = petLevel(demo.pet.xp);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-muted">
      <header className="shrink-0 border-b border-border bg-surface px-4 pb-2 pt-2.5">
        <div className="flex items-center gap-3">
          <Link
            to="/child"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <div className="min-w-0 flex-1 text-center pr-9">
            <h1 className="font-heading text-lg font-semibold text-text">
              {t('ui.childYoung.totem.leoName')}
            </h1>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-accent-kids/20 px-2.5 py-0.5 text-xs font-semibold text-accent-kids-ink">
              <span aria-hidden="true">★</span>
              {t('ui.childYoung.totem.level', { level })}
            </div>
          </div>
        </div>
      </header>

      {levelUpLevel !== null ? (
        <div className="mx-3 mt-1 shrink-0 rounded-card bg-accent-kids px-3 py-1.5 text-center text-xs font-semibold text-white">
          {t('ui.pet.levelUp', { level: levelUpLevel })}
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,2fr)]">
        <section
          className="mx-3 mt-1.5 flex min-h-0 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-b from-primary/8 via-surface to-surface px-2.5 pb-2 pt-1.5 shadow-sm ring-1 ring-border"
          aria-label={t('ui.childYoung.totem.leoName')}
        >
          <YoungLeoPetFlankMeters fullness={demo.pet.fullness} joy={demo.pet.joy}>
            <button
              type="button"
              onClick={bumpLion}
              className="rounded-full p-0.5 transition active:scale-[0.98]"
              aria-label={t('ui.childYoung.totem.tapLeo')}
            >
              <YoungLionTotem
                className="h-[7.5rem] w-[7.5rem]"
                animate
                showGlow
                reactToken={reactToken}
              />
            </button>
          </YoungLeoPetFlankMeters>

          <YoungLeoPetActions
            className="mt-1.5"
            starsBalance={demo.starsBalance}
            taskBuff={demo.pet.taskBuff}
            onAction={handleAction}
          />
        </section>

        <div className="flex min-h-0 flex-col px-2 pb-2 pt-1.5">
          <YoungLeoChat />
        </div>
      </div>
    </div>
  );
}
