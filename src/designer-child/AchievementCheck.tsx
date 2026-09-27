import {useId} from 'react';

/** Decorative achievement symbol, deliberately without a checkbox container. */
export default function AchievementCheck({className=''}:{className?:string}) {
  const id=useId();
  return <svg className={`achievement-check ${className}`} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <defs><linearGradient id={id} x1="10" y1="10" x2="29" y2="34" gradientUnits="userSpaceOnUse"><stop stopColor="#aff5ba"/><stop offset=".45" stopColor="#54c98b"/><stop offset="1" stopColor="#20845d"/></linearGradient></defs>
    <path d="m8 21 8 8L32 11" stroke="#21734f" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 2)"/>
    <path d="m8 21 8 8L32 11" stroke={`url(#${id})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m7 19 9 9L31 11" stroke="#c5f9d5" strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
