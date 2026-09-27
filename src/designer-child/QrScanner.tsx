import {useEffect,useRef,useState} from 'react';

import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {CircleNotch} from '@phosphor-icons/react';
import MoneyAmount from './MoneyAmount';
type Payment={merchant:string;amount:number};
type Props={stage:string;merchant:string;amount:number;error:string|null;onRecognized(payment:Payment):void;onReset():void;onPay():void};
const demoPayment:Payment={merchant:'Sweet Shop',amount:180};
export default function QrScanner({stage,merchant,amount,error,onRecognized,onReset,onPay}:Props){
 const video=useRef<HTMLVideoElement>(null),callback=useRef(onRecognized),currentStage=useRef(stage);
 callback.current=onRecognized;currentStage.current=stage;
 const [attempt,setAttempt]=useState(0),[camera,setCamera]=useState('requesting');
 const reduced=useReducedMotion();
 const scanning=stage==='camera';
 useEffect(()=>{
  let active=true,feed:MediaStream|undefined,timer:ReturnType<typeof setTimeout>|undefined;
  async function start(){
   if(!scanning)return;
   setCamera('requesting');
   if(!navigator.mediaDevices?.getUserMedia){setCamera('unavailable');return}
   try{feed=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false});if(!active){feed.getTracks().forEach(t=>t.stop());return}if(video.current){video.current.srcObject=feed;await video.current.play()}if(!active)return;setCamera('on');timer=setTimeout(()=>{if(active&&currentStage.current==='camera')callback.current(demoPayment)},1600)}
   catch(e){feed?.getTracks().forEach(t=>t.stop());if(active)setCamera(e instanceof DOMException&&e.name==='NotAllowedError'?'denied':'unavailable')}
  }
  void start();return()=>{active=false;clearTimeout(timer);feed?.getTracks().forEach(t=>t.stop());if(video.current)video.current.srcObject=null};
 },[attempt,scanning]);
 const sheet=stage==='confirm'||stage==='processing';
 return <div className="scanner-fullscreen">
  <video ref={video} autoPlay playsInline muted className="scanner-video" aria-label="Изображение с камеры"/>
  <div className="scanner-shade"/>
  {!sheet&&<><div className="scanner-target" aria-hidden="true"><i/><i/><i/><i/>{camera==='on'&&<span className="scanner-sweep"/>}</div><div className="scanner-guidance" aria-live="polite">
   <h2>{camera==='requesting'?'Открываем камеру':camera==='denied'?'Разреши доступ к камере':camera==='unavailable'?'Камера недоступна':'Наведи камеру на QR-код'}</h2>
   <p>{camera==='requesting'?'Подтверди доступ в окне браузера':camera==='denied'?'Включи доступ к камере в настройках браузера':camera==='unavailable'?'Открой приложение по HTTPS на устройстве с камерой':'Расположи код внутри рамки'}</p>
   {(camera==='denied'||camera==='unavailable')&&<><button onClick={()=>setAttempt(n=>n+1)}>Попробовать снова</button><button onClick={()=>callback.current(demoPayment)}>Продолжить без камеры</button></>}
  </div></>}
  <AnimatePresence>{sheet&&<motion.div className="scanner-sheet" initial={{y:reduced?0:32,opacity:0}} animate={{y:0,opacity:1}} exit={{y:reduced?0:32,opacity:0}} transition={{duration:.22}}>
   <div className="scanner-sheet-handle"/><h2>{stage==='processing'?'Оплата…':'Подтвердить оплату?'}</h2><dl><div><dt>Магазин</dt><dd>{merchant}</dd></div><div><dt>Сумма</dt><dd><MoneyAmount value={amount}/></dd></div></dl>
   {error&&<p role="alert" className="payment-error">{error==='insufficient'?'Недостаточно средств на карте':'Не получилось оплатить. Попробуй ещё раз.'}</p>}
   <div className="scanner-sheet-actions"><button className="payment-cta" disabled={stage==='processing'} onClick={onPay}>{stage==='processing'?<CircleNotch className="spinner" size={22}/>:'Оплатить'}</button><button className="ui-cancel" disabled={stage==='processing'} onClick={onReset}>Отмена</button></div>

  </motion.div>}</AnimatePresence>
 </div>
}
