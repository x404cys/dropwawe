// Purpose: Icon maps for category icons and service icons.
// getCategoryIcon → maps string name to lucide-react icon component (ICON_MAP).
// getIconComponent → maps string name to service icon component (SERVICE_ICON_MAP).

import {
  Palette,
  Monitor,
  Code,
  Camera,
  PenTool,
  Briefcase,
  Sparkles,
  Zap,
  Heart,
  Star,
  Package,
  Shirt,
  Watch,
  Smartphone,
  Footprints,
  Truck,
  Play,
  BookOpen,
  Layers,
  FileText,
  Globe,
  Image,
  Quote,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Monitor,
  Code,
  Camera,
  PenTool,
  Briefcase,
  Sparkles,
  Zap,
  Heart,
  Star,
  Package,
  Shirt,
  Watch,
  Smartphone,
  Footprints,
  Truck,
  Play,
  BookOpen,
  Layers,
  FileText,
};

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Sparkles,
  PenTool,
  Zap,
  Star,
  Globe,
  Image,
  Quote,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Package;
}

export function getIconComponent(iconName: string): LucideIcon {
  return SERVICE_ICON_MAP[iconName] ?? Sparkles;
}
