import { IconContext } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DemoProvider, FeedbackProvider } from '../designer-child/DesignerChildProviders';
import { HomeApp } from '../designer-child/App';
import '@fontsource-variable/inter';
import '../designer-child/style.css';
import '../designer-child/ui-system.css';
import '../designer-child/ui-controls.css';
import '../designer-child/ui-neutral.css';
import '../designer-child/accounts.css';
import '../designer-child/features.css';
import '../designer-child/payment-flow.css';
import '../designer-child/pet-screen.css';
import '../designer-child/header-blur.css';
import '../designer-child/progressive-blur.css';
import SmoothSurfaces from '../designer-child/SmoothSurfaces';

export function DesignerChildExperience() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DemoProvider>
      <FeedbackProvider>
        <IconContext.Provider value={{ weight: 'duotone' }}>
          <div className="kb-designer-child flex min-h-0 flex-1 flex-col overflow-hidden">
            <HomeApp
              identityAriaLabel={t('ui.profile.settings')}
              onIdentityClick={() =>
                navigate('/child/profile', { state: { from: '/child' } })
              }
            />
          </div>
          <SmoothSurfaces />
        </IconContext.Provider>
      </FeedbackProvider>
    </DemoProvider>
  );
}
