import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface FeedbackMessagesRequest {
  user: string;
  message_id: string;
  rating: string;
}

export interface FeedbackMessagesResponse {
  result: string;
}

const feedbackMessagesMock = {
  request: {} as FeedbackMessagesRequest,
  response: {} as FeedbackMessagesResponse,
};

export const feedbackMessagesConfig = {
  url: '/messages/:message_id/feedbacks',
  method: 'POST',
  headers: {},
  mockData: feedbackMessagesMock.response,
  description: '消息反馈（点赞）',
  request_type: feedbackMessagesMock.request,
  response_type: feedbackMessagesMock.response,
};

export const api_feedbackMessages = (
  props: ServerBase<FeedbackMessagesRequest>
): Promise<FeedbackMessagesResponse> => {
  const { url, method } = feedbackMessagesConfig;
  const requestData = {
    user: props.data.user,
    rating: props.data.rating,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = url.replace(':message_id', props.data.message_id);
  return http({
    url: queryUrl,
    method,
    data: requestData,
  }).then((res) => res as unknown as FeedbackMessagesResponse);
};
