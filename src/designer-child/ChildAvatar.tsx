import { usePreferences } from '../context/PreferencesContext';
import { designerChildAvatarSrc } from './designerChildAvatar';

export default function ChildAvatar() {
  const { bank } = usePreferences();
  return (
    <span className="avatar">
      <span className="avatar-crop">
        <img src={designerChildAvatarSrc(bank)} alt="" width="64" height="64" />
      </span>
    </span>
  );
}
