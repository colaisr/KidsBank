import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DemoTaskState } from '../data/demoBaseline';
import { updateTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { TASK_DUE_PRESETS, TASK_REWARD_PRESETS } from '../data/taskTemplates';
import { getTaskTitle } from '../lib/tasks';

type EditTaskModalProps = {
  task: DemoTaskState | null;
  open: boolean;
  onClose: () => void;
};

export function EditTaskModal({ task, open, onClose }: EditTaskModalProps) {
  const { t } = useTranslation();
  const { demo, setDemo } = useDemoState();
  const [rewardStars, setRewardStars] = useState(15);
  const [dueTime, setDueTime] = useState('18:00');

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    setRewardStars(task.rewardStars);
    setDueTime(task.dueTime);
  }, [open, task]);

  if (!open || !task) {
    return null;
  }

  function handleSubmit() {
    if (!task) {
      return;
    }

    const result = updateTask(demo, task.id, { rewardStars, dueTime });
    if (result === 'notEditable') {
      return;
    }

    setDemo(() => result);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t('ui.editTask.title')}</h2>
        <p className="mt-2 font-heading text-sm font-semibold text-text">
          {getTaskTitle(task, t)}
        </p>

        <div className="mt-4">
          <span className="text-xs font-medium text-text-muted">{t('ui.editTask.reward')}</span>
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
          <span className="text-xs font-medium text-text-muted">{t('ui.editTask.deadline')}</span>
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

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-text"
          >
            {t('ui.editTask.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
          >
            {t('ui.editTask.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
