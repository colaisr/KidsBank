// Illustrative locations around central Yerevan; these are not live child coordinates.
export type ParentPlace = {name:string;detail:string;lat:number;lng:number};
export const savedPlaces:ParentPlace[]=[
  {name:'Школа №27',detail:'На месте с 08:42',lat:40.1878,lng:44.5145},
  {name:'Дом',detail:'Последний раз вчера в 19:15',lat:40.1835,lng:44.5078},
  {name:'Бабушка',detail:'Сохранённое место',lat:40.1912,lng:44.5218},
];
export const paymentPlaces:ParentPlace[]=[
  {name:'Sweet Shop',detail:'Вчера, 13:45 · −180 AMD',lat:40.186,lng:44.518},
  {name:'Кафе',detail:'20 августа, 12:05 · −320 AMD',lat:40.1905,lng:44.517},
  {name:'Продуктовый магазин',detail:'19 сентября, 19:10 · −260 AMD',lat:40.1849,lng:44.511},
  {name:'Игровой автомат',detail:'19 сентября, 17:32 · −100 AMD',lat:40.1824,lng:44.5165},
  {name:'Книжный',detail:'16 сентября, 15:00 · −800 AMD',lat:40.1902,lng:44.51},
];
export const allPlaces=[...savedPlaces,...paymentPlaces];
