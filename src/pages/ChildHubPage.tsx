import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';

const HUB_LINKS = [
  { to: '/child/profile', key: 'profile' },
  { to: '/appearance', key: 'appearance' },
  { to: '/child/tasks', key: 'tasks' },
  { to: '/child/goals', key: 'goals' },
] as const;

export function ChildHubPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.hub" />
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {HUB_LINKS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="rounded-card border border-border bg-surface px-4 py-5 text-center font-heading text-sm font-semibold text-text transition-colors duration-200 hover:border-primary/40"
            >
              {t(`ui.hub.${item.key}`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
