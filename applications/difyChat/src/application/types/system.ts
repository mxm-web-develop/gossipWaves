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
  Errorec,
}

export interface SortRules {
  label: string;
  dayPeriod: number;
}

export interface AppState {
  current_module: Modules;
  initial_ready: boolean;
  app_state: States;
}
