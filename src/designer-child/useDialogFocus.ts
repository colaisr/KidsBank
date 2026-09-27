import {useEffect,useRef} from 'react';
export default function useDialogFocus(){
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const root=ref.current;if(!root)return;
  root.querySelector<HTMLElement>('h1')?.focus({preventScroll:true});
  function trap(e:KeyboardEvent){if(e.key!=='Tab'||!root)return;const items=Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')).filter(x=>x.getClientRects().length);const first=items[0],last=items.at(-1);if(!first){e.preventDefault();return;}if(e.shiftKey&&(document.activeElement===first||!items.includes(document.activeElement as HTMLElement))){e.preventDefault();last?.focus({preventScroll:true});}else if(!e.shiftKey&&(document.activeElement===last||!root.contains(document.activeElement))){e.preventDefault();first.focus();}}
  root.addEventListener('keydown',trap);return()=>{root.removeEventListener('keydown',trap);requestAnimationFrame(()=>{if(previous?.isConnected&&!previous.closest('[inert]'))previous.focus({preventScroll:true})})};
 },[]);return ref;
}
