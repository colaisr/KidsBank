/** One route transition for the child cabinet; card-design keeps its own shared flight. */
export const childTransition = {duration:.28,ease:[.22,1,.36,1] as const};
export function childScreenMotion(reduced:boolean|null){
 return {
  initial:{opacity:0,y:reduced?0:16},
  animate:{opacity:1,y:0},
  exit:{opacity:0,y:reduced?0:16},
  transition:{...childTransition,duration:reduced?0:.28},
 };
}
