// Local demo history, separate from today's tasks. Aggregate matches the reference.
const names=['Навести порядок в комнате','Прочитать книгу','Помочь накрыть на стол','Полить растения','Собрать рюкзак','Убрать игрушки','Помочь с покупками','Покормить питомца'];
export const taskHistory=Array.from({length:31},(_,i)=>({
 id:`history-${i}`,title:names[i%names.length],reward:i<30?25:110,
 date:new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long'}).format(new Date(2026,8,18-i)),
}));
export const taskStats={completed:taskHistory.length,earned:taskHistory.reduce((sum,t)=>sum+t.reward,0)};
