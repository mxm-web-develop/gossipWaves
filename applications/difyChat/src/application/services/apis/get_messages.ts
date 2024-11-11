import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface GetMessagesRequest {
  user: string;
  conversation_id: string;
  first_id?: string;
  limit?: number;
}

export interface MessageFile {
  id: string;
  type: string;
  url: string;
  belongs_to: string;
}

export interface AgentThought {
  id: string;
  message_id: string;
  position: number;
  thought: string;
  observation: string;
  tool: string;
  tool_input: string;
  created_at: number;
  message_files: string[];
}

export interface RetrieverResource {
  position: number;
  dataset_id: string;
  dataset_name: string;
  document_id: string;
  document_name: string;
  segment_id: string;
  score: number;
  content: string;
}

export interface MessageData {
  id: string;
  conversation_id: string;
  inputs: Record<string, any>;
  query: string;
  answer: string;
  message_files: MessageFile[];
  feedback: {
    rating: string;
  } | null;
  retriever_resources: RetrieverResource[];
  agent_thoughts: AgentThought[];
  created_at: number;
}

export interface GetMessagesResponse {
  limit: number;
  has_more: boolean;
  data: MessageData[];
}

export const getMessagesConfig = {
  url: '/messages',
  method: 'GET',
  headers: {},
  description: '获取会话历史消息',
};

export const api_getMessages = (
  props: ServerBase<GetMessagesRequest>
): Promise<GetMessagesResponse> => {
  const { url, method } = getMessagesConfig;
  const requestData = {
    user: props.data.user,
    conversation_id: props.data.conversation_id,
    first_id: props.data.first_id,
    limit: props.data.limit || 20, // 默认 20 条
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = `${url}`;
  return http({
    url: queryUrl,
    method,
    params: requestData,
  }).then((res) => res as unknown as GetMessagesResponse);
};
