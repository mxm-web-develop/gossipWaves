import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface GetAppInfoRequest {
  user: string;
}

export interface GetAppInfoResponse {
  name: string;
  description: string;
  tags: string[];
}

export const getAppInfoConfig = {
  url: '/info',
  method: 'GET',
  headers: {},
  description: '获取应用基本信息',
};

export const api_getAppInfo = (
  props: ServerBase<GetAppInfoRequest>
): Promise<GetAppInfoResponse> => {
  const { url, method } = getAppInfoConfig;
  const requestData = {
    user: props.data.user,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = `${url}`;
  return http({
    url: queryUrl,
    method,
    params: requestData,
  }).then((res) => res as unknown as GetAppInfoResponse);
};
