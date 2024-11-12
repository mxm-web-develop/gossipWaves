import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface SendMessageRequest {
  query: string;
  inputs?: Record<string, any>;
  response_mode?: string;
  user: string;
  conversation_id?: string;
  files?: Array<{
    type: string;
    transfer_method: string;
    url?: string;
    upload_file_id?: string;
  }>;
  auto_generate_name?: boolean;
}

export interface SendMessageResponse {
  message_id: string;
  conversation_id: string;
  mode: string;
  answer: string;
  metadata: Record<string, any>;
  usage: Record<string, any>;
  retriever_resources: Array<Record<string, any>>;
  created_at: number;
}

export const sendMessageConfig = {
  url: '/chat-messages',
  method: 'POST',
  headers: {},
  description: '发送对话消息',
};

export const api_sendMessage = (
  props: ServerBase<SendMessageRequest>
): Promise<SendMessageResponse> => {
  const { url, method } = sendMessageConfig;
  const requestData = {
    query: props.data.query,
    inputs: props.data.inputs || {},
    response_mode: props.data.response_mode || 'streaming',
    user: props.data.user,
    conversation_id: props.data.conversation_id || '',
    files: props.data.files,
    auto_generate_name: props.data.auto_generate_name || true,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = `${url}`;
  return http({
    url: queryUrl,
    method,
    data: requestData,
  }).then((res) => res as unknown as SendMessageResponse);
};
