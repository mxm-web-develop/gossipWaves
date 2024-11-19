export enum StatusType {
  Pending = 0,
  Process,
  Done,
  Error,
}
export enum Modules {
  Home,
  Chat,
  Flow,
  Setting,
}

export enum States {
  Loading,
  Waiting,
  Processing,
  Error,
}

export interface SortRules {
  label: string;
  dayPeriod: number;
}

export interface AppState {
  // 单独的chat应用不需要切换 current_module: Modules;
  initial_ready: boolean;
  app_state: States;
}
