import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import {Plus,Minus} from '@phosphor-icons/react';
import {useReducedMotion} from 'motion/react';
import {allPlaces,savedPlaces,type ParentPlace} from './parentPlaces';
import {home} from './data';
import 'leaflet/dist/leaflet.css';

export default function ParentLocationMap({point,onSelect}:{point:ParentPlace;onSelect(place:ParentPlace):void}) {
  const root=useRef<HTMLDivElement>(null);
  const mapRef=useRef<L.Map|null>(null);
  const markers=useRef<L.Marker[]>([]);
  const selectRef=useRef(onSelect);
  selectRef.current=onSelect;
  const reduce=useReducedMotion();
  const [zoom,setZoom]=useState(15);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    if(!root.current)return;
    const map=L.map(root.current,{zoomControl:false,attributionControl:false,scrollWheelZoom:false,minZoom:12,maxZoom:19}).setView([savedPlaces[0].lat,savedPlaces[0].lng],15);
    mapRef.current=map;
    L.control.attribution({position:'bottomright',prefix:false}).addTo(map);
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);
    tiles.on('tileerror',()=>setFailed(true));
    tiles.on('tileload',()=>setFailed(false));
    markers.current=allPlaces.map(place=>{
      const child=place===savedPlaces[0];
      const el=document.createElement('span');
      el.className=child?'geo-marker-face':'geo-marker-dot';
      if(child){const img=document.createElement('img');img.src=home.avatar;img.alt='';el.append(img);}
      const marker=L.marker([place.lat,place.lng],{title:child?'Давид · Школа №27':place.name,alt:place.name,
        icon:L.divIcon({html:el,className:`geo-marker${child?' geo-marker-child':''}`,iconSize:child?[46,46]:[28,28],iconAnchor:child?[23,23]:[14,14]})}).addTo(map);
      marker.on('click',()=>selectRef.current(place));
      return marker;
    });
    const updateZoom=()=>setZoom(map.getZoom());map.on('zoomend',updateZoom);
    const observer=new ResizeObserver(()=>map.invalidateSize({pan:false}));observer.observe(root.current);
    return()=>{observer.disconnect();map.remove();mapRef.current=null;markers.current=[];};
  },[]);
  useEffect(()=>{
    const map=mapRef.current;if(!map)return;
    map.setView([point.lat,point.lng],map.getZoom(),{animate:!reduce,duration:.35});
    markers.current.forEach((marker,i)=>{const selected=allPlaces[i]===point;marker.getElement()?.classList.toggle('is-selected',selected);marker.setZIndexOffset(selected?100:0);});
  },[point,reduce]);
  const atSchool=point===savedPlaces[0];
  return <section className="parent-map-card" aria-label={`Карта: ${point.name}`}>
    <div className="parent-real-map" ref={root}/>
    <div className="map-zoom"><button aria-label="Приблизить карту" disabled={zoom>=19} onClick={()=>mapRef.current?.zoomIn(1,{animate:!reduce})}><Plus size={22} weight="regular"/></button><button aria-label="Отдалить карту" disabled={zoom<=12} onClick={()=>mapRef.current?.zoomOut(1,{animate:!reduce})}><Minus size={22} weight="regular"/></button></div>
    {failed&&<div className="map-load-error" role="status">Не удалось загрузить карту. Проверь подключение.</div>}
    <div className="parent-map-summary" aria-live="polite">
      <div className="parent-map-summary-copy"><h2>{atSchool?'Давид сейчас в школе':point.name}</h2><p>{atSchool?'Школа №27 · С 08:42':point.detail}</p></div>
      {atSchool&&<span className="map-online"><span className="status-dot"/>На связи</span>}
    </div>
  </section>;
}
