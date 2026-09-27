import { Star } from '@phosphor-icons/react';
import { money } from './data';

export default function StarAmount({value}:{value:number}) {
  return <span className="star-value" aria-label={`${money.format(value)} звёзд`}><span>{money.format(value)}</span><Star size={14} weight="fill" aria-hidden="true"/></span>;
}
