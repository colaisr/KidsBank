import type {ReactNode} from 'react';
import {useSmoothCorners} from './useSmoothCorners';
import {useTapFeedback} from './Feedback';

export default function ActionTile({icon,label,children,detail,disabled,onClick}:{icon:ReactNode;label:string;children:ReactNode;detail?:ReactNode;disabled?:boolean;onClick():void}) {
  const ref=useSmoothCorners<HTMLButtonElement>();
  const tap=useTapFeedback();
  return <button ref={ref} type="button" className="action-tile" aria-label={label} disabled={disabled} onClick={()=>{tap();onClick()}}>
    <span className="action-tile-icon" aria-hidden="true">{icon}</span>
    <span className="action-tile-copy"><span>{children}</span>{detail&&<small>{detail}</small>}</span>
  </button>;
}
