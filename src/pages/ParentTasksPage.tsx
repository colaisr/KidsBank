import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddTaskModal } from '../components/AddTaskModal';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { EditTaskModal } from '../components/EditTaskModal';
import { ParentBottomSheet } from '../components/ParentBottomSheet';
import { ParentTaskListRow } from '../components/ParentTaskListRow';
import type { DemoTaskState } from '../data/demoBaseline';
import { cancelTask, confirmTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import {
  getParentPendingTasks,
  getTasksCompletedToday,
} from '../lib/tasks';

export function ParentTasksPage() {
  const { t } = useTranslation();
  const { demo, setDemo } = useDemoState();
  const [addOpen, setAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DemoTaskState | null>(null);
  const [sheetTask, setSheetTask] = useState<DemoTaskState | null>(null);

  const pendingTasks = getParentPendingTasks(demo.tasks);
  const completedToday = getTasksCompletedToday(demo.tasks);

  function openTask(task: DemoTaskState) {
    if (task.statusId === 'waitingParent') {
      setSheetTask(task);
      return;
    }
    setEditingTask(task);
  }

  function handleConfirm(taskId: string) {
    setDemo((s) => confirmTask(s, taskId));
    setSheetTask(null);
  }

  function handleCancel(taskId: string) {
    setDemo((s) => cancelTask(s, taskId));
    setSheetTask(null);
    setEditingTask(null);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.parent.tasksScreen.title"
        backTo="/parent"
        showSettingsLink={false}
      />

      <div className="px-4 pb-8">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-heading text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.99]"
          style={{ background: 'var(--kb-header-gradient)' }}
        >
          <span aria-hidden="true">+</span>
          {t('ui.parent.tasksScreen.newTask')}
        </button>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.parent.tasksScreen.sectionPending')}
          </h2>
          <div className="mt-3 overflow-hidden rounded-card border border-border bg-surface shadow-sm">
            {pendingTasks.length > 0 ? (
              <ul className="divide-y divide-border">
                {pendingTasks.map((task) => (
                  <li key={task.id}>
                    <ParentTaskListRow
                      task={task}
                      variant="pending"
                      onPress={() => openTask(task)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-text-muted">
                {t('ui.parent.tasksScreen.pendingEmpty')}
              </p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.parent.tasksScreen.sectionCompletedToday')}
          </h2>
          <div className="mt-3 overflow-hidden rounded-card border border-border bg-surface shadow-sm">
            {completedToday.length > 0 ? (
              <ul className="divide-y divide-border">
                {completedToday.map((task) => (
                  <li key={task.id}>
                    <ParentTaskListRow
                      task={task}
                      variant="completed"
                      onPress={() => setEditingTask(task)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-text-muted">
                {t('ui.parent.tasksScreen.completedEmpty')}
              </p>
            )}
          </div>
        </section>
      </div>

      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditTaskModal
        task={editingTask}
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
      />

      <ParentBottomSheet
        open={sheetTask !== null}
        onClose={() => setSheetTask(null)}
        title={sheetTask ? t('ui.parent.tasksScreen.confirmSheetTitle') : ''}
      >
        {sheetTask ? (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">
              {t('ui.parent.tasksScreen.confirmSheetHint')}
            </p>
            <button
              type="button"
              onClick={() => handleConfirm(sheetTask.id)}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white"
            >
              {t('ui.parent.confirmTask')}
            </button>
            <button
              type="button"
              onClick={() => {
                setSheetTask(null);
                setEditingTask(sheetTask);
              }}
              className="w-full rounded-full border border-border py-3 text-sm font-semibold text-text"
            >
              {t('ui.parent.editTask')}
            </button>
            <button
              type="button"
              onClick={() => handleCancel(sheetTask.id)}
              className="w-full py-2 text-sm font-medium text-red-600"
            >
              {t('ui.parent.cancelTask')}
            </button>
          </div>
        ) : null}
      </ParentBottomSheet>
    </div>
  );
}
