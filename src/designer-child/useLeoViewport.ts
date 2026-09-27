import {useLayoutEffect, useState, type RefObject} from 'react';

/** Keep the whole mobile scene inside Safari's visible viewport, including native focus pan. */
export default function useLeoViewport(root:RefObject<HTMLDivElement|null>){
 const [keyboardOpen,setKeyboardOpen]=useState(false);
 useLayoutEffect(()=>{
  const shell=root.current;
  const viewport=window.visualViewport;
  if(!shell||!viewport)return;
  const html=document.documentElement,theme=document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const previousTheme=theme?.content;
  let baseline=window.innerHeight,frame=0,pinned=false;
  const clear=()=>{
   pinned=false;delete shell.dataset.leoViewport;delete html.dataset.leoKeyboard;
   shell.style.removeProperty('--leo-visible-top');shell.style.removeProperty('--leo-visible-height');
   shell.querySelector<HTMLElement>('.feature-screen--pet')?.style.removeProperty('--leo-keyboard-inset');
   if(theme&&previousTheme)theme.content=previousTheme;
  };
  const update=()=>{
   const screen=shell.querySelector<HTMLElement>('.feature-screen--pet');
   const focused=!!screen?.contains(document.activeElement)&&document.activeElement instanceof HTMLTextAreaElement;
   const mobile=matchMedia('(max-width:479px)').matches;
   const obstructed=Math.max(baseline,window.innerHeight)-viewport.height>120;
   // Do not release the visible-viewport frame halfway through keyboard dismissal.
   const keep=focused||(pinned&&obstructed);
   setKeyboardOpen(keep&&obstructed);
   if(mobile&&keep&&Math.abs(viewport.scale-1)<.05&&viewport.height>0){
    pinned=true;shell.dataset.leoViewport='pinned';html.dataset.leoKeyboard='true';
    // iOS standalone pans fixed content along with its layout viewport. offsetTop
    // is the actual focus-pan displacement; subtracting scrollY cancels it out.
    shell.style.setProperty('--leo-visible-top',`${Math.max(0,viewport.offsetTop)}px`);
    shell.style.setProperty('--leo-visible-height',`${viewport.height}px`);
    shell.querySelector<HTMLElement>('.feature-screen--pet')?.style.removeProperty('--leo-keyboard-inset');
    if(theme)theme.content='#fcfaff';
   }else{
    clear();
    if(focused&&screen&&Math.abs(viewport.scale-1)<.05){
     const bounds=shell.getBoundingClientRect(),scale=bounds.height?shell.offsetHeight/bounds.height:1;
     const overlap=(bounds.bottom+window.scrollY-viewport.pageTop-viewport.height)*scale;
     const available=screen.querySelector<HTMLElement>('.leo-screen')?.clientHeight??0;
     screen.style.setProperty('--leo-keyboard-inset',`${Math.max(0,Math.min(overlap,Math.max(0,available-160)))}px`);
    }
   }
   if(!keep)baseline=window.innerHeight;
  };
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)};
  viewport.addEventListener('resize',schedule);viewport.addEventListener('scroll',schedule);
  window.addEventListener('resize',schedule);window.addEventListener('scroll',schedule);
  shell.addEventListener('focusin',schedule);shell.addEventListener('focusout',schedule);
  update();
  return()=>{cancelAnimationFrame(frame);viewport.removeEventListener('resize',schedule);viewport.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule);shell.removeEventListener('focusin',schedule);shell.removeEventListener('focusout',schedule);clear();};
 },[root]);
 return keyboardOpen;
}
