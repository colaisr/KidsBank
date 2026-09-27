import { flushSync } from 'react-dom';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import type { CardSkin } from '../context/preferences';
import { commitDesignerCardDesign } from './designerCardSkin';
import { measureCard, type CardFlightState } from './CardFlight';
import type { CardDesign } from './CardVisual';

const CARD_DESIGN_HASH = '#card-design';

export function useDesignerCardDesignSession(
  shellRef: RefObject<HTMLDivElement | null>,
  savedDesign: CardDesign,
  setCardSkin: (cardSkin: CardSkin) => void,
  reduceMotion: boolean,
) {
  const [editing, setEditing] = useState(() => location.hash === CARD_DESIGN_HASH);
  const [flight, setFlight] = useState<CardFlightState | null>(null);
  const [pickerEpoch, setPickerEpoch] = useState(0);
  const [pickerBaseline, setPickerBaseline] = useState<CardDesign>(savedDesign);

  const savedRef = useRef(savedDesign);
  const draftRef = useRef<CardDesign>(savedDesign);
  const editingRef = useRef(editing);
  const historyQuietRef = useRef(false);
  const returnFocusRef = useRef(false);

  savedRef.current = savedDesign;

  const bumpPicker = useCallback(() => setPickerEpoch((n) => n + 1), []);

  const noteDraft = useCallback((design: CardDesign) => {
    draftRef.current = design;
  }, []);

  const startFlight = useCallback(
    (
      design: CardDesign,
      destination: 'home' | 'editor',
      fromOverride?: CardFlightState['from'],
    ) => {
      if (reduceMotion) return;
      const shell = shellRef.current;
      if (!shell) return;

      const from =
        fromOverride ??
        (shell.dataset.flying === design
          ? measureCard(shell, '.card-flight .bank-card')
          : undefined) ??
        measureCard(
          shell,
          destination === 'editor'
            ? '.card-trigger .bank-card'
            : `.design-option[data-design="${design}"] .bank-card`,
          destination === 'editor',
        );

      if (!from) {
        if (destination === 'editor') {
          requestAnimationFrame(() => startFlight(design, destination, fromOverride));
        }
        return;
      }

      const checked =
        shell
          .querySelector(`.design-option[data-design="${design}"]`)
          ?.getAttribute('aria-checked') === 'true';

      setFlight({
        id: Date.now(),
        design,
        checked,
        from,
        destination,
      });
    },
    [reduceMotion, shellRef],
  );

  useLayoutEffect(() => {
    if (!flight || flight.to) return;
    const shell = shellRef.current;
    if (!shell) return;

    const to = measureCard(
      shell,
      flight.destination === 'home'
        ? '.card-trigger .bank-card'
        : `.design-option[data-design="${flight.design}"] .bank-card`,
      flight.destination === 'editor',
    );

    if (to) {
      setFlight((current) => (current ? { ...current, to } : null));
      return;
    }

    if (flight.destination === 'editor' && editingRef.current) {
      requestAnimationFrame(() => {
        const retry = measureCard(
          shell,
          `.design-option[data-design="${flight.design}"] .bank-card`,
          true,
        );
        if (retry) {
          setFlight((current) => (current ? { ...current, to: retry } : null));
        } else {
          setFlight(null);
        }
      });
      return;
    }

    if (flight.destination === 'home') {
      requestAnimationFrame(() => {
        const retry = measureCard(shell, '.card-trigger .bank-card', true);
        if (retry) {
          setFlight((current) => (current ? { ...current, to: retry } : null));
        } else {
          setFlight(null);
        }
      });
      return;
    }

    setFlight(null);
  }, [flight, shellRef]);

  const stripHash = useCallback(() => {
    if (location.hash !== CARD_DESIGN_HASH) return;
    historyQuietRef.current = true;
    history.replaceState(null, '', location.pathname + location.search);
    historyQuietRef.current = false;
  }, []);

  const open = useCallback(() => {
    if (editingRef.current) return;
    setFlight(null);
    const baseline = savedRef.current;
    draftRef.current = baseline;
    setPickerBaseline(baseline);
    bumpPicker();
    editingRef.current = true;
    historyQuietRef.current = true;
    history.pushState({ designerCardDesign: true }, '', CARD_DESIGN_HASH);
    historyQuietRef.current = false;
    setEditing(true);
    requestAnimationFrame(() => startFlight(baseline, 'editor'));
  }, [bumpPicker, startFlight]);

  const close = useCallback(
    (draft?: CardDesign) => {
      if (!editingRef.current) return;
      const shell = shellRef.current;
      const chosen = draft ?? draftRef.current;

      const fromEditor =
        shell &&
        measureCard(
          shell,
          `.design-option[data-design="${chosen}"] .bank-card`,
          true,
        );

      editingRef.current = false;
      historyQuietRef.current = true;

      flushSync(() => {
        setCardSkin(commitDesignerCardDesign(chosen));
        setEditing(false);
      });

      setFlight(null);
      stripHash();
      historyQuietRef.current = false;
      returnFocusRef.current = true;

      if (fromEditor) {
        requestAnimationFrame(() => {
          startFlight(chosen, 'home', fromEditor);
        });
      }
    },
    [setCardSkin, shellRef, startFlight, stripHash],
  );

  useEffect(() => {
    const onPopState = () => {
      if (historyQuietRef.current) return;

      if (location.hash === CARD_DESIGN_HASH) {
        if (!editingRef.current) {
          const baseline = savedRef.current;
          draftRef.current = baseline;
          setPickerBaseline(baseline);
          bumpPicker();
          editingRef.current = true;
          setEditing(true);
          requestAnimationFrame(() => startFlight(baseline, 'editor'));
        }
        return;
      }

      if (editingRef.current) {
        close();
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [bumpPicker, close, startFlight]);

  const completeFlight = useCallback(() => {
    setFlight(null);
  }, []);

  return {
    editing,
    flight,
    pickerEpoch,
    pickerBaseline,
    open,
    close,
    noteDraft,
    completeFlight,
    returnFocusRef,
    flyingDesign: flight?.design ?? null,
  };
}
