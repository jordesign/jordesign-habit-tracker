import {
  // Common
  Heart, Star, Home, Settings, User, Mail, Bell, Calendar,
  // Actions
  Plus, Minus, Check, X, Edit, Trash,
  // Weather
  Sun, Moon, Cloud, Umbrella, Wind, Snowflake,
  // Arrows
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown,
  // Media
  Music, Image, Video, Mic, Volume2, Headphones,
  // Objects
  Bookmark, File, Folder, Smartphone, Laptop, Printer,
  // Health
  Activity, Heart as HeartIcon, Zap, Timer, Dumbbell, Apple,
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
  Actions: [
    { name: 'plus', icon: Plus },
    { name: 'minus', icon: Minus },
    { name: 'check', icon: Check },
    { name: 'x', icon: X },
    { name: 'edit', icon: Edit },
    { name: 'trash', icon: Trash },
  ],
  Weather: [
    { name: 'sun', icon: Sun },
    { name: 'moon', icon: Moon },
    { name: 'cloud', icon: Cloud },
    { name: 'umbrella', icon: Umbrella },
    { name: 'wind', icon: Wind },
    { name: 'snowflake', icon: Snowflake },
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
    { name: 'music', icon: Music },
    { name: 'image', icon: Image },
    { name: 'video', icon: Video },
    { name: 'mic', icon: Mic },
    { name: 'volume', icon: Volume2 },
    { name: 'headphones', icon: Headphones },
  ],
  Objects: [
    { name: 'bookmark', icon: Bookmark },
    { name: 'file', icon: File },
    { name: 'folder', icon: Folder },
    { name: 'smartphone', icon: Smartphone },
    { name: 'laptop', icon: Laptop },
    { name: 'printer', icon: Printer },
  ],
  Health: [
    { name: 'activity', icon: Activity },
    { name: 'heartbeat', icon: HeartIcon },
    { name: 'zap', icon: Zap },
    { name: 'timer', icon: Timer },
    { name: 'dumbbell', icon: Dumbbell },
    { name: 'apple', icon: Apple },
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