import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { ParentBottomSheet } from '../components/ParentBottomSheet';
import { ParentGeolocationMap } from '../components/ParentGeolocationMap';
import type { DemoSavedPlace, DemoTransaction } from '../data/demoBaseline';
import { useDemoState } from '../context/DemoStateContext';
import { useParentLocation, useWatchChildOnMap } from '../context/ParentLocationContext';
import { usePreferences } from '../context/PreferencesContext';
import {
  formatCurrency,
  formatPiggyDepositDate,
} from '../lib/format';
import {
  formatRelativeUpdatedAt,
  getSpendTransactionsWithMap,
  resolveChildFallbackPosition,
  resolvePlacePosition,
} from '../lib/parentLocation';

type SheetKind = 'saved' | 'payments' | 'spend-detail' | null;

export function ParentGeolocationPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const { mode, anchor, childPosition: liveChild } = useParentLocation();
  useWatchChildOnMap(true);

  const [sheet, setSheet] = useState<SheetKind>(null);
  const [selectedSpend, setSelectedSpend] = useState<DemoTransaction | null>(null);
  const [focusPosition, setFocusPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [focusTick, setFocusTick] = useState(0);

  const activeChild =
    demo.children.find((c) => c.id === demo.activeChildId) ?? demo.children[0];

  const fallbackChild = resolveChildFallbackPosition(demo);
  const childPosition =
    mode === 'live' && liveChild ? liveChild : fallbackChild;

  const spendMarkers = useMemo(
    () => getSpendTransactionsWithMap(demo, mode, anchor),
    [demo, mode, anchor],
  );

  useEffect(() => {
    setDemo((s) => ({
      ...s,
      locationUpdatedAt: new Date().toISOString(),
    }));
  }, [setDemo, mode, childPosition.lat, childPosition.lng]);

  const mapTagLabel =
    mode === 'live'
      ? t('ui.parent.geolocation.mapTagNeutral')
      : t('ui.parent.geolocation.mapTagFallback');

  const statusPrimary =
    mode === 'live'
      ? t('ui.parent.geolocation.statusSheetNeutral', { name: t(activeChild.nameKey) })
      : t('ui.parent.geolocation.statusSheetFallback', { name: t(activeChild.nameKey) });

  const relativeTime = formatRelativeUpdatedAt(demo.locationUpdatedAt, locale);

  const statusSecondary =
    mode === 'live'
      ? t('ui.parent.geolocation.placeDetailNeutral', { time: relativeTime })
      : t('ui.parent.geolocation.placeDetailFallback', {
          place: t('demo.places.school27'),
          time: relativeTime,
        });

  function focusSpendOnMap(tx: DemoTransaction) {
    const row = spendMarkers.find((marker) => marker.tx.id === tx.id);
    if (row) {
      setFocusPosition({ lat: row.position.lat, lng: row.position.lng });
      setFocusTick((tick) => tick + 1);
    }
  }

  function openSpendDetail(tx: DemoTransaction) {
    focusSpendOnMap(tx);
    setSelectedSpend(tx);
    setSheet('spend-detail');
  }

  function selectSpendFromList(tx: DemoTransaction) {
    focusSpendOnMap(tx);
    setSelectedSpend(tx);
    setSheet('spend-detail');
  }

  function focusSavedPlace(place: DemoSavedPlace) {
    const position = resolvePlacePosition(place, mode, anchor);
    setFocusPosition(position);
    setFocusTick((tick) => tick + 1);
    setSheet(null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChildPageTitle
        titleKey="ui.parent.geolocation.title"
        titleValues={{ name: t(activeChild.nameKey) }}
        backTo="/parent"
        showSettingsLink={false}
        presenterId="parent-geolocation"
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="min-h-[220px] flex-1">
          <ParentGeolocationMap
            mode={mode}
            anchor={anchor}
            childPosition={childPosition}
            mapTagLabel={mapTagLabel}
            childInitial={activeChild.initial}
            savedPlaces={demo.savedPlaces}
            spendMarkers={spendMarkers}
            focusPosition={focusPosition}
            focusTick={focusTick}
            onSpendClick={openSpendDetail}
          />
        </div>

        <div className="shrink-0 rounded-t-[1.25rem] border border-border bg-surface px-4 pb-4 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
          <div className="flex items-start gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-base font-semibold text-primary"
              aria-hidden="true"
            >
              {activeChild.initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-semibold text-text">{statusPrimary}</p>
              <p className="mt-0.5 text-sm text-text-muted">{statusSecondary}</p>
            </div>
            <span
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
              title={t('ui.parent.geolocation.online')}
              aria-label={t('ui.parent.geolocation.online')}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSheet('saved')}
              className="flex items-center justify-center gap-2 rounded-card bg-primary/10 px-3 py-3 text-center text-xs font-semibold text-primary"
            >
              <span aria-hidden="true">📍</span>
              {t('ui.parent.geolocation.savedPlaces')}
            </button>
            <button
              type="button"
              onClick={() => setSheet('payments')}
              className="flex items-center justify-center gap-2 rounded-card bg-amber-500/15 px-3 py-3 text-center text-xs font-semibold text-amber-700"
            >
              <span aria-hidden="true">▦</span>
              {t('ui.parent.geolocation.paymentPlaces')}
            </button>
          </div>
        </div>
      </div>

      <ParentBottomSheet
        open={sheet === 'saved'}
        onClose={() => setSheet(null)}
        title={t('ui.parent.geolocation.savedPlaces')}
      >
        <ul className="space-y-2">
          {demo.savedPlaces.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => focusSavedPlace(place)}
                className="flex w-full items-center gap-3 rounded-card border border-border bg-surface-muted px-4 py-3 text-left hover:border-primary/30"
              >
                <span className="text-lg text-primary" aria-hidden="true">📍</span>
                <span className="font-heading text-sm font-semibold text-text">
                  {t(place.labelKey)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </ParentBottomSheet>

      <ParentBottomSheet
        open={sheet === 'payments'}
        onClose={() => setSheet(null)}
        title={t('ui.parent.geolocation.paymentPlaces')}
      >
        <ul className="space-y-2">
          {spendMarkers.map(({ tx }) => (
            <li key={tx.id}>
              <button
                type="button"
                onClick={() => selectSpendFromList(tx)}
                className="flex w-full items-center justify-between gap-3 rounded-card border border-border bg-surface-muted px-4 py-3 text-left hover:border-primary/30"
              >
                <span className="min-w-0">
                  <span className="block font-heading text-sm font-semibold text-text">
                    {tx.merchantKey ? t(`demo.merchants.${tx.merchantKey}`) : '—'}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {formatPiggyDepositDate(new Date(tx.at), locale, {
                      today: t('ui.piggy.dayToday'),
                      yesterday: t('ui.piggy.dayYesterday'),
                    })}
                  </span>
                </span>
                <span className="shrink-0 font-heading text-sm font-semibold text-text">
                  −{formatCurrency(tx.amount, locale)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </ParentBottomSheet>

      <ParentBottomSheet
        open={sheet === 'spend-detail' && selectedSpend !== null}
        onClose={() => {
          setSheet(null);
          setSelectedSpend(null);
        }}
        title={t('ui.parent.geolocation.spendDetailTitle')}
      >
        {selectedSpend ? (
          <div className="space-y-2 rounded-card border border-border bg-surface-muted p-4">
            <p className="font-heading text-base font-semibold text-text">
              {selectedSpend.merchantKey
                ? t(`demo.merchants.${selectedSpend.merchantKey}`)
                : '—'}
            </p>
            <p className="text-sm text-text-muted">
              {formatPiggyDepositDate(new Date(selectedSpend.at), locale, {
                today: t('ui.piggy.dayToday'),
                yesterday: t('ui.piggy.dayYesterday'),
              })}
            </p>
            <p className="font-heading text-lg font-semibold text-text">
              −{formatCurrency(selectedSpend.amount, locale)}
            </p>
          </div>
        ) : null}
      </ParentBottomSheet>
    </div>
  );
}
