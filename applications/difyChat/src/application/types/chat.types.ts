export interface IChatSortRule {
  label: string;
  dayPeriod: number;
}
export enum ModuleState {
  Loading,
  Waiting,
  Process,
  Error,
}
export interface ChatData {
  conversations: Conversations;
  actived_conversation?: string;
  sortRules?: IChatSortRule[];
  state: ModuleState;
  current_conversation_messages: IMessages;
  current_taskId?: string | undefined;
}

export interface IConversationItem {
  created_at: number;
  id: string;
  inputs: Record<string, any>;
  introduction: string | undefined | null;
  name: string;
  status: string;
  updated_at: number;
}
export interface Conversations {
  has_more: boolean;
  limit: number;
  data: IConversationItem[];
  [key: string]: any;
}

export interface IMessageData {
  agent_thoughts?: any;
  answer?: string;
  conversation_id?: string;
  created_at?: number;
  error?: any;
  feedback?: any;
  id?: string;
  inputs?: Record<string, any>;
  message_files?: any[];
  parent_message_id?: string;
  query?: string;
  retriever_resources?: any[];
  status?: string;
}
export interface IMessages {
  has_more: boolean;
  limit: number;
  data: IMessageData[];
}
