import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDemoState } from '../context/DemoStateContext';
import { petNeedsTabAttention } from '../lib/pet';

const SIDE_TABS = [
  { to: '/child', end: true, key: 'home' as const, Icon: HomeIcon },
  { to: '/child/goals', end: false, key: 'goals' as const, Icon: GoalsIcon },
  { to: '/child/transactions', end: false, key: 'transactions' as const, Icon: TransactionsIcon },
  { to: '/child/pet', end: false, key: 'pet' as const, Icon: PetIcon },
] as const;

export function ChildTabBar() {
  const { t } = useTranslation();
  const { demo } = useDemoState();
  const petNeedsAttention = petNeedsTabAttention(demo.pet, demo.starsBalance);

  return (
    <nav
      className="relative z-10 shrink-0 border-t border-border bg-surface px-1 pt-2"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-5 items-end">
        <TabLink tab={SIDE_TABS[0]} label={t(`ui.nav.${SIDE_TABS[0].key}`)} />
        <TabLink tab={SIDE_TABS[1]} label={t(`ui.nav.${SIDE_TABS[1].key}`)} />
        <div className="relative flex justify-center">
          <NavLink
            to="/child/hub"
            aria-label={t('ui.nav.hub')}
            className={({ isActive }) =>
              `kb-fab -mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-fab text-fab-fg transition-transform duration-200 active:scale-95 ${
                isActive ? 'ring-2 ring-primary/30' : ''
              }`
            }
          >
            <HubIcon />
          </NavLink>
        </div>
        <TabLink tab={SIDE_TABS[2]} label={t(`ui.nav.${SIDE_TABS[2].key}`)} />
        <TabLink
          tab={SIDE_TABS[3]}
          label={t(`ui.nav.${SIDE_TABS[3].key}`)}
          showBadge={petNeedsAttention}
        />
      </div>
    </nav>
  );
}

function TabLink({
  tab,
  label,
  showBadge = false,
}: {
  tab: (typeof SIDE_TABS)[number];
  label: string;
  showBadge?: boolean;
}) {
  const { Icon } = tab;

  return (
    <NavLink
      to={tab.to}
      end={tab.end}
      className={({ isActive }) =>
        `flex min-w-0 flex-col items-center gap-0.5 px-0.5 pb-1 pt-1 transition-colors duration-200 ${
          isActive ? 'text-primary' : 'text-text-muted'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative">
            <Icon />
            {showBadge && !isActive ? (
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface"
                aria-hidden="true"
              />
            ) : null}
          </span>
          <span className="w-full px-0.5 text-center text-[10px] leading-[1.15] font-medium break-words [overflow-wrap:anywhere]">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoalsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="2" fill="currentColor" />
      <circle cx="16" cy="9" r="2" fill="currentColor" />
      <circle cx="6" cy="14" r="1.6" fill="currentColor" />
      <circle cx="18" cy="14" r="1.6" fill="currentColor" />
      <ellipse cx="12" cy="16.5" rx="4" ry="3.2" fill="currentColor" />
    </svg>
  );
}

function HubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}
