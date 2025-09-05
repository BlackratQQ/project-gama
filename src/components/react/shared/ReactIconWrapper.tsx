import { FaLayerGroup, FaBolt, FaRocket } from 'react-icons/fa';

interface ReactIconWrapperProps {
  iconName: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

const iconMap = {
  FaLayerGroup: FaLayerGroup,
  FaBolt: FaBolt,
  FaRocket: FaRocket,
};

export default function ReactIconWrapper({
  iconName,
  size = 24,
  className = 'text-white',
  ariaLabel,
}: ReactIconWrapperProps) {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];

  if (!IconComponent) {
    return null;
  }

  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <IconComponent size={size} />
    </div>
  );
}
