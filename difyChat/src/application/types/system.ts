export enum StatusType {
  Pending = 0,
  Process,
  Done,
  Error,
}
export interface ListItemType {
  label: string;
  sessionId: string;
  gmtModified: number;
  assistant?: any;
  [key: string]: any;
}

export interface IAppData {
  conversations_list: ListItemType[];
  retriever_info: any;
  // assist_list: IAssistant[];
  activedConversation: string | undefined;
  status: any;
  sortRules: { label: string; dayPeriod: number }[];
  conversations_list_pagging: {
    pageNo: number;
    totalPages: number;
  };
}
