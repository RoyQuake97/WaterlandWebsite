import { 
  Umbrella, 
  Utensils, 
  Waves, 
  Building, 
  ShoppingBag, 
  IceCream, 
  Car, 
  GlassWater, 
  CheckCircle,
  Clock,
  Coffee,
  DollarSign,
  Wifi,
  MapPin,
  Info,
  Award,
  LucideIcon
} from "lucide-react";

interface AttractionIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Map icon names to their components
const iconMap: Record<string, LucideIcon> = {
  Umbrella,
  Utensils,
  Waves,
  Building,
  ShoppingBag,
  IceCream,
  Car,
  GlassWater,
  CheckCircle,
  Clock,
  Coffee,
  DollarSign,
  Wifi,
  MapPin,
  Info,
  Award
};

const AttractionIcon = ({ name, size = 20, className = '' }: AttractionIconProps) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent size={size} className={className} />;
};

export default AttractionIcon;