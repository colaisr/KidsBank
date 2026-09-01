import { AppHeader } from '../components/AppHeader';
import { ParentHomePage } from './ParentHomePage';

export function ParentShell() {
  return (
    <div className="kb-parent-shell flex min-h-0 flex-1 flex-col bg-surface-muted">
      <AppHeader titleKey="ui.role.parentTitle" presenterId="parent-home" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ParentHomePage />
      </div>
    </div>
  );
}
