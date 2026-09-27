import { useTranslation } from 'react-i18next';

export function useDesignerChildT() {
  return useTranslation('translation', { keyPrefix: 'ui.designerChild' });
}
