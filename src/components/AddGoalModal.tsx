import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addGoal } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import {
  CUSTOM_GOAL_TEMPLATE_ID,
  GOAL_AMD_PRESETS,
  GOAL_TARGET_PRESETS,
  GOAL_TEMPLATE_DEFAULT_AMD,
  GOAL_TEMPLATE_DEFAULT_ICONS,
  GOAL_TEMPLATE_DEFAULT_TARGETS,
  GOAL_TEMPLATES,
  CUSTOM_GOAL_DEFAULT_ICON,
  type GoalTemplateId,
} from '../data/goalTemplates';
import type { ActivityIconId } from '../data/activityIcons';
import { IconPicker } from './IconPicker';
import { isActiveGoalTemplate } from '../lib/goals';
import { formatCurrency } from '../lib/format';
import { usePreferences } from '../context/PreferencesContext';

type AddGoalSelection = GoalTemplateId | typeof CUSTOM_GOAL_TEMPLATE_ID;

type AddGoalModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddGoalModal({ open, onClose }: AddGoalModalProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [templateId, setTemplateId] = useState<AddGoalSelection>('headphones');
  const [customTitle, setCustomTitle] = useState('');
  const [iconId, setIconId] = useState<ActivityIconId>(CUSTOM_GOAL_DEFAULT_ICON);
  const [targetStars, setTargetStars] = useState(GOAL_TEMPLATE_DEFAULT_TARGETS.headphones);
  const [amdValue, setAmdValue] = useState(GOAL_TEMPLATE_DEFAULT_AMD.headphones);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const availableTemplates = GOAL_TEMPLATES.filter(
    (id) => !isActiveGoalTemplate(demo.goals, id),
  );
  const isCustom = templateId === CUSTOM_GOAL_TEMPLATE_ID;

  useEffect(() => {
    if (!open) {
      return;
    }

    const available = GOAL_TEMPLATES.filter(
      (id) => !isActiveGoalTemplate(demo.goals, id),
    );
    const nextTemplate: AddGoalSelection =
      available.length > 0 ? available[0] : CUSTOM_GOAL_TEMPLATE_ID;
    setTemplateId(nextTemplate);
    setCustomTitle('');
    if (nextTemplate === CUSTOM_GOAL_TEMPLATE_ID) {
      setIconId(CUSTOM_GOAL_DEFAULT_ICON);
      setTargetStars(GOAL_TARGET_PRESETS[1]);
      setAmdValue(GOAL_AMD_PRESETS[1]);
    } else {
      setIconId(GOAL_TEMPLATE_DEFAULT_ICONS[nextTemplate]);
      setTargetStars(GOAL_TEMPLATE_DEFAULT_TARGETS[nextTemplate]);
      setAmdValue(GOAL_TEMPLATE_DEFAULT_AMD[nextTemplate]);
    }
    setErrorKey(null);
  }, [open, demo.goals]);

  if (!open) {
    return null;
  }

  function handleTemplateChange(nextTemplateId: AddGoalSelection) {
    setTemplateId(nextTemplateId);
    if (nextTemplateId === CUSTOM_GOAL_TEMPLATE_ID) {
      setIconId(CUSTOM_GOAL_DEFAULT_ICON);
      setTargetStars(GOAL_TARGET_PRESETS[1]);
      setAmdValue(GOAL_AMD_PRESETS[1]);
    } else {
      setIconId(GOAL_TEMPLATE_DEFAULT_ICONS[nextTemplateId]);
      setTargetStars(GOAL_TEMPLATE_DEFAULT_TARGETS[nextTemplateId]);
      setAmdValue(GOAL_TEMPLATE_DEFAULT_AMD[nextTemplateId]);
    }
    setErrorKey(null);
  }

  function handleSubmit() {
    const result = addGoal(demo, {
      templateId,
      customTitle: isCustom ? customTitle : undefined,
      iconId,
      targetStars,
      amdValue,
    });

    if (result === 'duplicate') {
      setErrorKey('ui.addGoal.duplicate');
      return;
    }

    if (result === 'emptyTitle') {
      setErrorKey('ui.addGoal.customTitleRequired');
      return;
    }

    setDemo(() => result);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t('ui.addGoal.title')}</h2>
        <p className="mt-1 text-sm text-text-muted">{t('ui.addGoal.hint')}</p>

        <label className="mt-4 block">
          <span className="text-xs font-medium text-text-muted">{t('ui.addGoal.template')}</span>
          <select
            value={templateId}
            onChange={(event) => handleTemplateChange(event.target.value as AddGoalSelection)}
            className="mt-1 w-full rounded-card border border-border bg-surface-muted px-3 py-2 text-sm text-text"
          >
            {availableTemplates.map((id) => (
              <option key={id} value={id}>
                {t(`demo.goals.${id}.title`)}
              </option>
            ))}
            <option value={CUSTOM_GOAL_TEMPLATE_ID}>{t('ui.addGoal.other')}</option>
          </select>
        </label>

        {isCustom ? (
          <label className="mt-4 block">
            <span className="text-xs font-medium text-text-muted">{t('ui.addGoal.customTitle')}</span>
            <input
              type="text"
              value={customTitle}
              onChange={(event) => {
                setCustomTitle(event.target.value);
                setErrorKey(null);
              }}
              placeholder={t('ui.addGoal.customTitlePlaceholder')}
              className="mt-1 w-full rounded-card border border-border bg-surface-muted px-3 py-2 text-sm text-text"
              maxLength={80}
            />
          </label>
        ) : null}

        <div className="mt-4">
          <IconPicker value={iconId} onChange={setIconId} />
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-text-muted">{t('ui.addGoal.target')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {GOAL_TARGET_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetStars(preset)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  targetStars === preset ? 'bg-primary text-white' : 'bg-surface-muted text-text'
                }`}
              >
                {preset} ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-text-muted">{t('ui.addGoal.amdValue')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {GOAL_AMD_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmdValue(preset)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  amdValue === preset ? 'bg-primary text-white' : 'bg-surface-muted text-text'
                }`}
              >
                {formatCurrency(preset, locale)}
              </button>
            ))}
          </div>
        </div>

        {errorKey ? <p className="mt-3 text-sm text-red-600">{t(errorKey)}</p> : null}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-text"
          >
            {t('ui.addGoal.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
          >
            {t('ui.addGoal.create')}
          </button>
        </div>
      </div>
    </div>
  );
}
