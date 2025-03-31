import {
  Activity, AlertCircle, Archive, ArrowRight, Bell, 
  Calendar, Check, ChevronDown, Clock, Edit, 
  Heart, Home, Mail, Plus, Settings, Star, 
  Sun, User, X, Zap,
  type LucideIcon
} from 'lucide-react';

// Simple array of icons for now
export const ICONS = [
  { name: 'activity', icon: Activity },
  { name: 'alert', icon: AlertCircle },
  { name: 'archive', icon: Archive },
  { name: 'arrow', icon: ArrowRight },
  { name: 'bell', icon: Bell },
  { name: 'calendar', icon: Calendar },
  { name: 'check', icon: Check },
  { name: 'chevron', icon: ChevronDown },
  { name: 'clock', icon: Clock },
  { name: 'edit', icon: Edit },
  { name: 'heart', icon: Heart },
  { name: 'home', icon: Home },
  { name: 'mail', icon: Mail },
  { name: 'plus', icon: Plus },
  { name: 'settings', icon: Settings },
  { name: 'star', icon: Star },
  { name: 'sun', icon: Sun },
  { name: 'user', icon: User },
  { name: 'x', icon: X },
  { name: 'zap', icon: Zap },
] as const;

export type IconName = typeof ICONS[number]['name'];

export const getIconComponent = (name: IconName): LucideIcon => {
  return ICONS.find(icon => icon.name === name)?.icon || Settings;
}; 