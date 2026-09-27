import {money} from './data';
import {brandPalette} from './leoConfig';
export const spendingColors=[brandPalette.mid,'#55a9ef','#62c8ad','#c8b8e5'];
const point=(radius:number,angle:number)=>{const radians=angle*Math.PI/180;return `${110+radius*Math.cos(radians)} ${110+radius*Math.sin(radians)}`};
function segment(start:number,end:number) {
  const outer=100,inner=76,corner=Math.min(4,(end-start)*Math.PI/180*inner/3);
  const a=corner/outer*180/Math.PI,b=corner/inner*180/Math.PI;
  return `M ${point(outer,start+a)} A ${outer} ${outer} 0 0 1 ${point(outer,end-a)} Q ${point(outer,end)} ${point(outer-corner,end)} L ${point(inner+corner,end)} Q ${point(inner,end)} ${point(inner,end-b)} A ${inner} ${inner} 0 0 0 ${point(inner,start+b)} Q ${point(inner,start)} ${point(inner+corner,start)} L ${point(outer-corner,start)} Q ${point(outer,start)} ${point(outer,start+a)} Z`;
}
export default function SpendingChart({rows}:{rows:Array<[string,number,number]>}) {
  const total=rows.reduce((sum,row)=>sum+row[1],0),count=rows.filter(row=>row[1]>0).length;
  const gap=3,available=180-gap*Math.max(0,count-1);let angle=180;
  return <div className="spending-chart" role="img" aria-label={`Всего ${money.format(total)} AMD. ${rows.map(([name,amount])=>`${name}: ${money.format(amount)} AMD`).join('. ')}`}>
    <svg viewBox="0 0 220 125" aria-hidden="true">
      {total?rows.map(([name,amount],index)=>{if(!amount)return null;const start=angle,end=start+amount/total*available;angle=end+gap;return <path key={name} d={segment(start,end)} fill={spendingColors[index]}/>;}):<path d={segment(180,360)} fill="#eee7f6"/>}
    </svg>
    <div className="spending-chart-total" aria-hidden="true"><strong>{money.format(total)}</strong><span>AMD всего</span></div>
  </div>;
}
