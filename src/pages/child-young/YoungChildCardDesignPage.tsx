import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { YoungCardThemeTile } from '../../components/child-young/YoungCardThemeTile';
import { usePreferences } from '../../context/PreferencesContext';
import type { CardSkin } from '../../context/preferences';
import {
  normalizeYoungCardTheme,
  YOUNG_CARD_THEME_PREVIEWS,
  type YoungCardThemeId,
} from '../../data/youngCardThemes';

export function YoungChildCardDesignPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cardSkin, setCardSkin } = usePreferences();
  const [selectedTheme, setSelectedTheme] = useState<YoungCardThemeId>(() =>
    normalizeYoungCardTheme(cardSkin),
  );

  function handleDone() {
    setCardSkin(selectedTheme as CardSkin);
    navigate('/child');
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
          <h1 className="min-w-0 flex-1 font-heading text-xl font-semibold text-text">
            {t('ui.cardDesign.title')}
          </h1>
        </div>
        <p className="mt-2 pl-12 text-sm text-text-muted">{t('ui.childYoung.cardDesign.subtitle')}</p>
      </header>

      <div className="flex flex-1 flex-col px-4 py-5">
        <div
          role="radiogroup"
          aria-label={t('ui.cardDesign.title')}
          className="grid grid-cols-2 gap-4"
        >
          {YOUNG_CARD_THEME_PREVIEWS.map((theme) => (
            <YoungCardThemeTile
              key={theme.id}
              theme={theme}
              selected={selectedTheme === theme.id}
              onSelect={() => setSelectedTheme(theme.id)}
            />
          ))}
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={handleDone}
            className="w-full rounded-full bg-primary py-3.5 font-heading text-base font-semibold text-white shadow-md transition-opacity hover:opacity-95"
          >
            {t('ui.childYoung.cardDesign.done')}
          </button>
        </div>
      </div>
    </div>
  );
}
