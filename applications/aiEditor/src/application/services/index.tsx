//example 

import { renameDialogueConfig, RenameDialogueRequest, RenameDialogueResponse } from "./apis/dialog_create_mock";
import { createAxiosInstance, mockApiResponse } from "./axios_instant";
import { ServerBase } from "./services.type";

//example
export const api_renameDialogue = (props: ServerBase<RenameDialogueRequest>): Promise<RenameDialogueResponse> => {
  const { url, method, mockData } = renameDialogueConfig;
  const requestData = {
    label: props.data.label,
    sessionId: props.data.sessionId,
  };
  const http = createAxiosInstance(props.config.url, props.config.token);
  const queryUrl = `${url}`;
  if (props.config.enableMock) {
    mockApiResponse(http, method, queryUrl, mockData);
  }
  return http({
    url: queryUrl,
    method,
    data: requestData,
  }).then((res) => res.data as RenameDialogueResponse); // 添加类型断言
};