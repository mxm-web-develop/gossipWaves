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
  success: true,
};

export const wholeGraphSearchConfig = {
  url: '/search/wholeGraphSearch',
  method: 'post',
  mockData: wholeGraphSearchMock,
  description: '全图查询',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};

export const getWholeGraphStatisticsConfig = {
  url: '/graphStatistics/getWholeGraphStatistics',
  method: 'get',
  mockData: wholeGraphSearchMock,
  description: '图谱统计信息查询',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};

export const getNodeInfoConfig = {
  url: '/info/nodes',
  method: 'get',
  mockData: wholeGraphSearchMock,
  description: '',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};
export const getEdgeInfoConfig = {
  url: '/info/edges',
  method: 'get',
  mockData: wholeGraphSearchMock,
  description: '',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};

export const nodeSearchConfig = {
  url: '/search/nodeSearch',
  method: 'post',
  mockData: wholeGraphSearchMock,
  description: '',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};

export const edgeSearchConfig = {
  url: '/search/edgeSearch',
  method: 'post',
  mockData: wholeGraphSearchMock,
  description: '',
  request_type: {} as WholeGraphSearchRequest,
  response_type: {} as WholeGraphSearchResponse,
};

import { createAxiosInstance, mockApiResponse } from '../axios_instant';

let instance: any = null;

export async function wholeGraphSearch(
  network: {
    baseURL: string;
    token?: string;
  },
  data: WholeGraphSearchRequest
  //params: WholeGraphSearchRequest,
  // headers?: { userName?: string; userId?: string },
  //token?: string
): Promise<WholeGraphSearchResponse> {
  instance = instance || createAxiosInstance(network.baseURL, network.token);
  console.log(data, 'data');
  // 如果需要mock数据，取消注释下面这行
  // mockApiResponse(instance, wholeGraphSearchConfig.method, wholeGraphSearchConfig.url, wholeGraphSearchMock);
  try {
    const response = await instance({
      url: wholeGraphSearchConfig.url,
      method: wholeGraphSearchConfig.method,
      data: data,
    });
    return response.data as unknown as WholeGraphSearchResponse;
  } catch (error) {
    console.error('Whole graph search failed:', error);
    throw error;
  }
}

export async function getWholeGraphStatistics(
  network: {
    baseURL: string;
    token?: string;
  },
  data: any
): Promise<any> {
  instance = instance || createAxiosInstance(network.baseURL, network.token);
  try {
    const response = await instance({
      url: `${getWholeGraphStatisticsConfig.url}?spaceName=${data.spaceName}`,
      method: getWholeGraphStatisticsConfig.method,
      data,
    });
    return response.data as unknown as WholeGraphSearchResponse;
  } catch (error) {
    console.error('Whole graph search failed:', error);
    throw error;
  }
}

export async function getNodeInfo(
  network: {
    baseURL: string;
    token?: string;
  },
  data: any
): Promise<any> {
  instance = instance || createAxiosInstance(network.baseURL, network.token);
  try {
    const params = new URLSearchParams(data).toString();
    const response = await instance({
      url: `${getNodeInfoConfig.url}?${params}`,
      method: getNodeInfoConfig.method,
      data,
    });
    return response.data as unknown as any;
  } catch (error) {
    console.error('search failed:', error);
    throw error;
  }
}
export async function getEdgeInfo(
  network: {
    baseURL: string;
    token?: string;
  },
  data: any
): Promise<any> {
  instance = instance || createAxiosInstance(network.baseURL, network.token);
  try {
    const params = new URLSearchParams(data).toString();
    const response = await instance({
      url: `${getEdgeInfoConfig.url}?${params}`,
      method: getEdgeInfoConfig.method,
    });
    return response.data as unknown as any;
  } catch (error) {
    console.error('search failed:', error);
    throw error;
  }
}

export async function nodeSearch(
  network: {
    baseURL: string;
    token?: string;
  },
  data: any
): Promise<any> {
  instance = instance || createAxiosInstance(network.baseURL, network.token);
  try {
    const response = await instance({
      url: nodeSearchConfig.url,
      method: nodeSearchConfig.method,
      data,
    });
    return response.data as unknown as any;
  } catch (error) {
    console.error('search failed:', error);
    throw error;
  }
}

export async function edgeSearch(
  network: {
    baseURL: string;
    token?: string;
  },
  data: any
): Promise<any> {
  instance = instance || createAxiosInstance(network.baseURL, network.token);
  try {
    const response = await instance({
      url: edgeSearchConfig.url,
      method: edgeSearchConfig.method,
      data,
    });
    return response.data as unknown as any;
  } catch (error) {
    console.error('search failed:', error);
    throw error;
  }
}
