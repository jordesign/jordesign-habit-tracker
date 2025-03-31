import {
  // Common
  Heart, Star, Home, Settings, User, Mail, Bell, Calendar,
  // Weather
  Sun, Moon, Cloud, CloudRain, CloudSnow, Wind,
  // Arrows
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown,
  // Media
  Play, Pause, Stop, Music, Video, Image,
  // Objects
  Book, File, Folder, Camera, Phone, Printer,
  // Health
  Activity, HeartPulse, Stethoscope, Pill, Weight, Dumbbell,
  // Type for LucideIcon
  type LucideIcon
} from 'lucide-react';

export const ICON_CATEGORIES = {
  Common: [
    { name: 'heart', icon: Heart },
    { name: 'star', icon: Star },
    { name: 'home', icon: Home },
    { name: 'settings', icon: Settings },
    { name: 'user', icon: User },
    { name: 'mail', icon: Mail },
    { name: 'bell', icon: Bell },
    { name: 'calendar', icon: Calendar },
  ],
  Weather: [
    { name: 'sun', icon: Sun },
    { name: 'moon', icon: Moon },
    { name: 'cloud', icon: Cloud },
    { name: 'cloudRain', icon: CloudRain },
    { name: 'cloudSnow', icon: CloudSnow },
    { name: 'wind', icon: Wind },
  ],
  Arrows: [
    { name: 'arrowUp', icon: ArrowUp },
    { name: 'arrowDown', icon: ArrowDown },
    { name: 'arrowLeft', icon: ArrowLeft },
    { name: 'arrowRight', icon: ArrowRight },
    { name: 'chevronUp', icon: ChevronUp },
    { name: 'chevronDown', icon: ChevronDown },
  ],
  Media: [
    { name: 'play', icon: Play },
    { name: 'pause', icon: Pause },
    { name: 'stop', icon: Stop },
    { name: 'music', icon: Music },
    { name: 'video', icon: Video },
    { name: 'image', icon: Image },
  ],
  Objects: [
    { name: 'book', icon: Book },
    { name: 'file', icon: File },
    { name: 'folder', icon: Folder },
    { name: 'camera', icon: Camera },
    { name: 'phone', icon: Phone },
    { name: 'printer', icon: Printer },
  ],
  Health: [
    { name: 'activity', icon: Activity },
    { name: 'heartPulse', icon: HeartPulse },
    { name: 'stethoscope', icon: Stethoscope },
    { name: 'pill', icon: Pill },
    { name: 'weight', icon: Weight },
    { name: 'dumbbell', icon: Dumbbell },
  ],
} as const;

export type IconName = typeof ICON_CATEGORIES[keyof typeof ICON_CATEGORIES][number]['name'];

export const getIconComponent = (name: IconName): LucideIcon => {
  for (const category of Object.values(ICON_CATEGORIES)) {
    const found = category.find(icon => icon.name === name);
    if (found) return found.icon;
  }
  return Settings; // fallback icon
}; 