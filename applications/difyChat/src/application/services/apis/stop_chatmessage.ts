import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface StopChatMessagesRequest {
  user: string;
  task_id: string;
}

export interface StopChatMessagesResponse {
  result: string;
}

const stopChatMessagesMock = {
  request: {} as StopChatMessagesRequest,
  response: {} as StopChatMessagesResponse,
};

export const stopChatMessagesConfig = {
  url: '/chat-messages/:task_id/stop',
  method: 'POST',
  headers: {},
  mockData: stopChatMessagesMock.response,
  description: '停止响应',
  request_type: stopChatMessagesMock.request,
  response_type: stopChatMessagesMock.response,
};

export const api_stopChatMessages = (
  props: ServerBase<StopChatMessagesRequest>
): Promise<StopChatMessagesResponse> => {
  const { url, method } = stopChatMessagesConfig;
  const requestData = {
    user: props.data.user,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = url.replace(':task_id', props.data.task_id);
  return http({
    url: queryUrl,
    method,
    data: requestData,
  }).then((res) => res as unknown as StopChatMessagesResponse);
};
