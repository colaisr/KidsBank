import { useTranslation } from 'react-i18next';

type ChildPageTitleProps = {
  titleKey: string;
};

export function ChildPageTitle({ titleKey }: ChildPageTitleProps) {
  const { t } = useTranslation();

  return (
    <header className="border-b border-border bg-surface px-4 py-4">
      <h1 className="font-heading text-xl font-semibold text-text">{t(titleKey)}</h1>
    </header>
  );
}
