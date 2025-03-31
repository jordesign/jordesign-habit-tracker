export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system"
}

export enum DefaultView {
  DASHBOARD = "dashboard",
  HABITS = "habits",
  METRICS = "metrics",
  JOURNAL = "journal"
}

export interface AppSettings {
  email: string;
  enableReminders: boolean;
  reminderTime: string; // 24-hour format: "HH:mm"
  metricsToRemind: string[];
  defaultView: DefaultView;
  theme: Theme;
} 