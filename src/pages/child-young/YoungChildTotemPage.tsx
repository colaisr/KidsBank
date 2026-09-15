import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { YoungLeoChat } from '../../components/child-young/YoungLeoChat';
import { YoungLeoPetActions } from '../../components/child-young/YoungLeoPetActions';
import { YoungLeoPetNeedBars } from '../../components/child-young/YoungLeoPetNeedBars';
import { YoungLionTotem } from '../../components/child-young/YoungLionTotem';
import { useYoungLeoPet } from '../../hooks/useYoungLeoPet';
import { petLevel } from '../../lib/pet';

export function YoungChildTotemPage() {
  const { t } = useTranslation();
  const { demo, levelUpLevel, reactToken, handleAction } = useYoungLeoPet();
  const level = petLevel(demo.pet.xp);

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-muted">
      <header className="shrink-0 border-b border-border bg-surface px-4 pb-3 pt-3">
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
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent-kids/20 px-2.5 py-0.5 text-xs font-semibold text-accent-kids-ink">
              <span aria-hidden="true">★</span>
              {t('ui.childYoung.totem.level', { level })}
            </div>
          </div>
        </div>
      </header>

      {levelUpLevel !== null ? (
        <div className="mx-4 mt-2 shrink-0 rounded-card bg-accent-kids px-3 py-2 text-center text-xs font-semibold text-white">
          {t('ui.pet.levelUp', { level: levelUpLevel })}
        </div>
      ) : null}

      <div className="shrink-0 px-3 py-3">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <YoungLeoPetActions
            starsBalance={demo.starsBalance}
            taskBuff={demo.pet.taskBuff}
            onAction={handleAction}
          />
          <div className="flex flex-col items-center">
            <p className="mb-1 max-w-[9rem] rounded-2xl bg-surface px-2.5 py-1.5 text-center text-[10px] font-medium leading-snug text-text shadow-sm ring-1 ring-border">
              {t('ui.childYoung.totem.playPrompt')}
            </p>
            <YoungLionTotem
              className="h-[5.5rem] w-[5.5rem]"
              animate
              showGlow
              reactToken={reactToken}
            />
          </div>
          <YoungLeoPetNeedBars fullness={demo.pet.fullness} joy={demo.pet.joy} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-2 pb-2">
        <YoungLeoChat />
      </div>
    </div>
  );
}
