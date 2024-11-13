import { createAxiosInstance } from '../axios_instant';
import { ServerBase } from '../services.type';

export interface GetParametersRequest {
  user: string;
}

export interface UserInputForm {
  label: string;
  variable: string;
  required: boolean;
  default: string;
}

export interface FileUpload {
  enabled: boolean;
  number_limits: number;
  transfer_methods: string[];
}

export interface SystemParameters {
  file_size_limit: number;
  image_file_size_limit: number;
  audio_file_size_limit: number;
  video_file_size_limit: number;
}

export interface GetParametersResponse {
  opening_statement: string;
  suggested_questions: string[];
  suggested_questions_after_answer: {
    enabled: boolean;
  };
  speech_to_text: {
    enabled: boolean;
  };
  retriever_resource: {
    enabled: boolean;
  };
  annotation_reply: {
    enabled: boolean;
  };
  user_input_form: UserInputForm[];
  file_upload: FileUpload;
  system_parameters: SystemParameters;
}

export const getParametersConfig = {
  url: '/parameters',
  method: 'GET',
  headers: {},
  description: '获取应用配置信息',
};

export const api_getParameters = (
  props: ServerBase<GetParametersRequest>
): Promise<GetParametersResponse> => {
  const { url, method } = getParametersConfig;
  const requestData = {
    user: props.data.user,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = `${url}`;
  return http({
    url: queryUrl,
    method,
    params: requestData,
  }).then((res) => res as unknown as GetParametersResponse);
};
