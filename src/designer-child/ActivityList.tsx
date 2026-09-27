import type {ReactNode} from 'react';
export default function ActivityList({label,children}:{label:string;children:ReactNode}) {
  return <section className="activity-list" aria-label={label}>{children}</section>;
}
