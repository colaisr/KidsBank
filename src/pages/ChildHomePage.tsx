import { Suspense, lazy } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { YoungChildHomePage } from './child-young/YoungChildHomePage';
import { TeenChildHomePage } from './TeenChildHomePage';

const DesignerChildExperience = lazy(() =>
  import('./DesignerChildExperience').then((module) => ({
    default: module.DesignerChildExperience,
  })),
);

export function ChildHomePage() {
  const { childExperience } = usePreferences();

  if (childExperience === 'youngDesigner') {
    return (
      <Suspense fallback={<div className="flex min-h-0 flex-1 items-center justify-center bg-surface-muted" />}>
        <DesignerChildExperience />
      </Suspense>
    );
  }

  if (childExperience === 'young') {
    return <YoungChildHomePage />;
  }

  return <TeenChildHomePage />;
}
