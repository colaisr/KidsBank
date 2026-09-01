import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import {
  CUSTOM_TASK_TEMPLATE_ID,
  TASK_DUE_PRESETS,
  TASK_REWARD_PRESETS,
  TASK_TEMPLATE_DEFAULT_DUE,
  TASK_TEMPLATE_DEFAULT_REWARDS,
  TASK_TEMPLATES,
  type TaskTemplateId,
} from '../data/taskTemplates';
import { isActiveTaskTemplate } from '../lib/tasks';

type AddTaskSelection = TaskTemplateId | typeof CUSTOM_TASK_TEMPLATE_ID;

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  const { t } = useTranslation();
  const { demo, setDemo } = useDemoState();
  const [templateId, setTemplateId] = useState<AddTaskSelection>('homework');
  const [customTitle, setCustomTitle] = useState('');
  const [rewardStars, setRewardStars] = useState(TASK_TEMPLATE_DEFAULT_REWARDS.homework);
  const [dueTime, setDueTime] = useState(TASK_TEMPLATE_DEFAULT_DUE.homework);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const availableTemplates = TASK_TEMPLATES.filter(
    (id) => !isActiveTaskTemplate(demo.tasks, id),
  );
  const isCustom = templateId === CUSTOM_TASK_TEMPLATE_ID;

  useEffect(() => {
    if (!open) {
      return;
    }

    const available = TASK_TEMPLATES.filter(
      (id) => !isActiveTaskTemplate(demo.tasks, id),
    );
    const nextTemplate: AddTaskSelection =
      available.length > 0 ? available[0] : CUSTOM_TASK_TEMPLATE_ID;
    setTemplateId(nextTemplate);
    setCustomTitle('');
    setRewardStars(
      nextTemplate === CUSTOM_TASK_TEMPLATE_ID
        ? TASK_REWARD_PRESETS[1]
        : TASK_TEMPLATE_DEFAULT_REWARDS[nextTemplate],
    );
    setDueTime(
      nextTemplate === CUSTOM_TASK_TEMPLATE_ID
        ? TASK_DUE_PRESETS[1]
        : TASK_TEMPLATE_DEFAULT_DUE[nextTemplate],
    );
    setErrorKey(null);
  }, [open, demo.tasks]);

  if (!open) {
    return null;
  }

  function handleTemplateChange(nextTemplateId: AddTaskSelection) {
    setTemplateId(nextTemplateId);
    if (nextTemplateId === CUSTOM_TASK_TEMPLATE_ID) {
      setRewardStars(TASK_REWARD_PRESETS[1]);
      setDueTime(TASK_DUE_PRESETS[1]);
    } else {
      setRewardStars(TASK_TEMPLATE_DEFAULT_REWARDS[nextTemplateId]);
      setDueTime(TASK_TEMPLATE_DEFAULT_DUE[nextTemplateId]);
    }
    setErrorKey(null);
  }

  function handleSubmit() {
    const result = addTask(demo, {
      templateId,
      rewardStars,
      dueTime,
      customTitle: isCustom ? customTitle : undefined,
    });

    if (result === 'duplicate') {
      setErrorKey('ui.addTask.duplicate');
      return;
    }

    if (result === 'emptyTitle') {
      setErrorKey('ui.addTask.customTitleRequired');
      return;
    }

    setDemo(() => result);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t('ui.addTask.title')}</h2>
        <p className="mt-1 text-sm text-text-muted">{t('ui.addTask.hint')}</p>

        <label className="mt-4 block">
          <span className="text-xs font-medium text-text-muted">{t('ui.addTask.template')}</span>
          <select
            value={templateId}
            onChange={(event) => handleTemplateChange(event.target.value as AddTaskSelection)}
            className="mt-1 w-full rounded-card border border-border bg-surface-muted px-3 py-2 text-sm text-text"
          >
            {availableTemplates.map((id) => (
              <option key={id} value={id}>
                {t(`demo.tasks.${id}.title`)}
              </option>
            ))}
            <option value={CUSTOM_TASK_TEMPLATE_ID}>{t('ui.addTask.other')}</option>
          </select>
        </label>

        {isCustom ? (
          <label className="mt-4 block">
            <span className="text-xs font-medium text-text-muted">{t('ui.addTask.customTitle')}</span>
            <input
              type="text"
              value={customTitle}
              onChange={(event) => {
                setCustomTitle(event.target.value);
                setErrorKey(null);
              }}
              placeholder={t('ui.addTask.customTitlePlaceholder')}
              className="mt-1 w-full rounded-card border border-border bg-surface-muted px-3 py-2 text-sm text-text"
              maxLength={80}
            />
          </label>
        ) : null}

        <div className="mt-4">
          <span className="text-xs font-medium text-text-muted">{t('ui.addTask.reward')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TASK_REWARD_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setRewardStars(preset)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  rewardStars === preset ? 'bg-primary text-white' : 'bg-surface-muted text-text'
                }`}
              >
                {preset} ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-text-muted">{t('ui.addTask.deadline')}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TASK_DUE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDueTime(preset)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  dueTime === preset ? 'bg-primary text-white' : 'bg-surface-muted text-text'
                }`}
              >
                {t('ui.tasks.deadline', { time: preset })}
              </button>
            ))}
          </div>
          <input
            type="time"
            value={dueTime}
            onChange={(event) => setDueTime(event.target.value)}
            className="mt-2 w-full rounded-card border border-border bg-surface-muted px-3 py-2 text-sm text-text"
          />
        </div>

        {errorKey ? <p className="mt-3 text-sm text-red-600">{t(errorKey)}</p> : null}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-text"
          >
            {t('ui.addTask.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
          >
            {t('ui.addTask.create')}
          </button>
        </div>
      </div>
    </div>
  );
}
