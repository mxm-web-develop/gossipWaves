enum Navs {
  Home,
  Chat,
  Flow,
  Setting,
}

enum States {
  Loading,
  Waiting,
  Processing,
  Errorec,
}

export interface AppState {
  current_nav: Navs;
  app_state: States;
}
