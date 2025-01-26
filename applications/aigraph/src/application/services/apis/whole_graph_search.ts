export interface WholeGraphSearchRequest {
  limit?: number;
  spaceName: string;
  fileId?: string;
}

export interface WholeGraphSearchResponse {
  // 由于响应类型在文档中未显示，这里先定义一个基础结构
  // 可以根据实际响应进行调整
  data: any;
  success: boolean;
  message?: string;
}

const wholeGraphSearchMock = {
  data: {},
  success: true
};

export const wholeGraphSearchConfig = {
  url: '/search/wholeGraphSearch',
  method: 'post',
  mockData: wholeGraphSearchMock,
  description: '全图查询',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};

import { createAxiosInstance, mockApiResponse } from '../axios_instant';

export async function wholeGraphSearch(
  network:{
    baseURL: string,
    token?: string
  },  
  data: WholeGraphSearchRequest,
  //params: WholeGraphSearchRequest,
  // headers?: { userName?: string; userId?: string },
  //token?: string
  
): Promise<WholeGraphSearchResponse> {
  const instance = createAxiosInstance(
    network.baseURL,
    network.token,
  );
  console.log(data,'data')
  // 如果需要mock数据，取消注释下面这行
  // mockApiResponse(instance, wholeGraphSearchConfig.method, wholeGraphSearchConfig.url, wholeGraphSearchMock);
  try {
    const response = await instance({
      url: wholeGraphSearchConfig.url,
      method: wholeGraphSearchConfig.method,
      data: data
    });
    return response.data as unknown as WholeGraphSearchResponse;
  } catch (error) {
    console.error('Whole graph search failed:', error);
    throw error;
  }
} 