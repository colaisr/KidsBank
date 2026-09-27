import {MapPin, ArrowUpRight, SlidersHorizontal, ClipboardText, ChartPieSlice, Receipt, Target} from '@phosphor-icons/react';

type ServiceArtworkProps = {
  name: "geolocation" | "transfer" | "limits" | "tasks" | "reports" | "spending-history" | "goals";
};

const iconByName = {
  geolocation: MapPin,
  transfer: ArrowUpRight,
  limits: SlidersHorizontal,
  tasks: ClipboardText,
  reports: ChartPieSlice,
  "spending-history": Receipt,
  goals: Target,
};

export default function ParentServiceArtwork({ name }: ServiceArtworkProps) {
  const Icon = iconByName[name];
  return <Icon className="parent-service-art" size={30} weight="regular" aria-hidden="true" />;
}
