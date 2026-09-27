import type {ReactNode} from 'react';
export default function SectionHeading({children}:{children:ReactNode}) {
  return <h2 className="ui-section-heading">{children}</h2>;
}
