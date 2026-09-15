import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CardSkinTile } from '../components/CardSkinTile';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { usePreferences } from '../context/PreferencesContext';
import type { CardSkin } from '../context/preferences';
import { CARD_SKIN_PREVIEWS } from '../data/cardSkins';

export function TeenChildCardDesignPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cardSkin, setCardSkin } = usePreferences();
  const [selectedSkin, setSelectedSkin] = useState<CardSkin>(cardSkin);

  function handleApply() {
    setCardSkin(selectedSkin);
    navigate('/child');
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.cardDesign.title"
        backTo="/child"
        showSettingsLink={false}
        presenterId="child-card-design"
      />

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="mb-5 flex items-start gap-3 rounded-card border border-primary/20 bg-primary/10 px-4 py-3">
          <GlobeIcon />
          <p className="text-sm leading-snug text-primary-dark">{t('ui.cardDesign.banner')}</p>
        </div>

        <div
          role="radiogroup"
          aria-label={t('ui.cardDesign.title')}
          className="grid grid-cols-2 gap-4"
        >
          {CARD_SKIN_PREVIEWS.map((skin) => (
            <CardSkinTile
              key={skin.id}
              skin={skin}
              selected={selectedSkin === skin.id}
              onSelect={() => setSelectedSkin(skin.id)}
            />
          ))}
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-full bg-primary py-3.5 text-base font-semibold text-white shadow-md transition-opacity duration-200 hover:opacity-95"
          >
            {t('ui.cardDesign.apply')}
          </button>
        </div>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 shrink-0 text-primary"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
