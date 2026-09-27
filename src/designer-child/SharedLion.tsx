import type {LionEmotion} from './lionEmotions';
import {useLayoutEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,type MotionValue} from 'motion/react';
import Mascot from './Mascot';
import './pet-screen.css';
export default function SharedLion({flow,emotion,reaction,onInteract,covered=false,homeOpacity,petOpacity}:{homeOpacity:MotionValue<number>;petOpacity:MotionValue<number>;covered?:boolean;flow:string|null;reaction:number;emotion:LionEmotion;onInteract():void}){
 const host=useRef<HTMLDivElement>(null);const [rect,setRect]=useState({x:0,y:0,width:100,height:100});const [ready,setReady]=useState(false);const reduced=useReducedMotion();
 useLayoutEffect(()=>{
  const shell=host.current?.parentElement;if(!shell)return;
  let target:Element|null=null;
  const measure=()=>{
   const next=shell.querySelector(flow==='pet'?'.pet-mascot-target':'.nav-pet');
   if(!next)return;
   if(next!==target){if(target)resize.unobserve(target);target=next;resize.observe(next)}
   const a=next.getBoundingClientRect(),b=shell.getBoundingClientRect(),scale=shell.offsetWidth/b.width;
   const screen=next.closest('.feature-screen');
   const transform=screen?getComputedStyle(screen).transform:'none';
   const matrix=transform==='none'?null:new DOMMatrixReadOnly(transform);
   const value={x:(a.left-b.left)*scale-(matrix?.m41??0),y:(a.top-b.top)*scale-(matrix?.m42??0),width:a.width*scale,height:a.height*scale};
   setRect(old=>Object.keys(value).every(k=>old[k as keyof typeof old]===value[k as keyof typeof value])?old:value);setReady(true);
   // The target can mount after the previous screen's exit. No frame polling.
   appeared.disconnect();
  };
  const resize=new ResizeObserver(measure);
  const appeared=new MutationObserver(measure);
  appeared.observe(shell,{childList:true,subtree:true});resize.observe(shell);measure();
  window.addEventListener('resize',measure);
  return()=>{appeared.disconnect();resize.disconnect();window.removeEventListener('resize',measure)};
 },[flow]);
 const visible=!flow||flow==='pet';
 return <motion.div ref={host} className={flow==='pet'?'shared-lion-layer shared-lion-layer--pet':'shared-lion-layer'} style={{opacity:flow==='pet'?petOpacity:homeOpacity,position:"absolute",inset:0,pointerEvents:"none",zIndex:80}}>{ready&&<motion.div className="flying-lion" initial={false} animate={{...rect,opacity:covered?0:1}} transition={reduced?{duration:0}:{type:'spring',stiffness:260,damping:24}} style={{pointerEvents:visible&&!covered?"auto":"none"}}><Mascot active={visible} emotion={flow==='pet'?emotion:undefined} reaction={reaction} onInteract={onInteract}/></motion.div>}</motion.div>
}
