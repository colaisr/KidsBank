import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { YoungLionTotem } from '../../components/child-young/YoungLionTotem';

export function YoungChildTotemPage() {
  const { t } = useTranslation();
  const [reactToken, setReactToken] = useState(0);
  const [bubble, setBubble] = useState<'none' | 'play' | 'talk'>('none');

  function bumpLion() {
    setReactToken((n) => n + 1);
  }

  function handlePlay() {
    bumpLion();
    setBubble('play');
  }

  function handleTalk() {
    bumpLion();
    setBubble('talk');
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <header className="border-b border-border bg-surface px-4 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <Link
            to="/child"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold text-text pr-9">
            {t('ui.childYoung.totem.title')}
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pb-10 pt-8">
        <p className="font-heading text-lg font-semibold text-text">{t('ui.childYoung.totem.leoName')}</p>
        <p className="mt-1 text-sm text-text-muted">{t('ui.childYoung.totem.subtitle')}</p>

        <button
          type="button"
          onClick={bumpLion}
          className="mt-8 rounded-3xl p-4 transition-transform active:scale-[0.98]"
          aria-label={t('ui.childYoung.totem.tapLeo')}
        >
          <YoungLionTotem
            className="h-40 w-40"
            animate
            showGlow
            reactToken={reactToken}
          />
        </button>

        {bubble !== 'none' ? (
          <p
            className="mt-4 max-w-xs rounded-2xl border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-text shadow-sm"
            role="status"
          >
            {bubble === 'play'
              ? t('ui.childYoung.totem.playBubble')
              : t('ui.childYoung.totem.talkBubble')}
          </p>
        ) : (
          <p className="mt-4 text-sm text-text-muted">{t('ui.childYoung.totem.tapHint')}</p>
        )}

        <div className="mt-auto flex w-full max-w-sm gap-3 pt-10">
          <button
            type="button"
            onClick={handlePlay}
            className="flex-1 rounded-full bg-primary py-3.5 font-heading text-sm font-semibold text-white shadow-md"
          >
            {t('ui.childYoung.totem.play')}
          </button>
          <button
            type="button"
            onClick={handleTalk}
            className="flex-1 rounded-full border border-primary bg-surface py-3.5 font-heading text-sm font-semibold text-primary"
          >
            {t('ui.childYoung.totem.talk')}
          </button>
        </div>
      </div>
    </div>
  );
}
