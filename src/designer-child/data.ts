// Snapshot of the public demo, 2026-09-17. No live account connection.
// Rewards are credited by parent approval; there is no child claim action.
export type Task = {
  id: string;
  title: string;
  reward: number;
  deadline: string;
  status: "open" | "waitingParent";
};
export const home = {
  name: "Давид",
  avatar: "/assets/avatar.png",
  age: 7,
  balance: 2567.48,
  stars: 860,
  tasks: [
    {
      id: "homework",
      title: "Сделать уроки",
      reward: 25,
      deadline: "18:00",
      status: "open",
    },
    {
      id: "walkDog",
      title: "Погулять с собакой",
      reward: 15,
      deadline: "20:00",
      status: "waitingParent",
    },
    {
      id: "hangLaundry",
      title: "Развесь бельё после стирки",
      reward: 10,
      deadline: "16:00",
      status: "waitingParent",
    },
  ] satisfies Task[],
};
const wholeMoney = new Intl.NumberFormat("ru-RU", {maximumFractionDigits:0});
const fractionalMoney = new Intl.NumberFormat("ru-RU", {minimumFractionDigits:2,maximumFractionDigits:2});
export const money = {format(value:number) {
  const rounded=Math.round(value*100)/100;
  return (Number.isInteger(rounded)?wholeMoney:fractionalMoney).format(rounded);
}};
