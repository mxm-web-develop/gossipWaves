import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface DeleteConversationRequest {
  user: string;
  conversation_id: string;
}

export interface DeleteConversationResponse {
  result: string;
}

export const deleteConversationConfig = {
  url: '/conversations',
  method: 'DELETE',
  headers: {},
  description: '删除会话',
};

export const api_deleteConversation = (
  props: ServerBase<DeleteConversationRequest>
): Promise<DeleteConversationResponse> => {
  const { url, method } = deleteConversationConfig;
  const requestData = {
    user: props.data.user,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = `${url}/${props.data.conversation_id}`;
  return http({
    url: queryUrl,
    method,
    data: requestData,
  }).then((res) => res as unknown as DeleteConversationResponse);
};
