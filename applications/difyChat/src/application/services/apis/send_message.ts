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
interface BaseEvent {
  task_id: string;
  message_id: string;
  conversation_id: string;
  created_at: number;
  event: string;
}

interface MessageEvent extends BaseEvent {
  answer: string;
}

interface AgentMessageEvent extends BaseEvent {
  answer: string;
}

interface TtsMessageEvent extends BaseEvent {
  audio: string;
}

type TtsMessageEndEvent = BaseEvent;

interface AgentThoughtEvent extends BaseEvent {
  id: string;
  position: number;
  thought: string;
  observation: string;
  tool: string;
  tool_input: string;
  message_files: Array<string>;
}

interface MessageFileEvent extends BaseEvent {
  id: string;
  type: string;
  belongs_to: string;
  url: string;
}

interface MessageEndEvent extends BaseEvent {
  metadata: Record<string, any>;
  usage: Record<string, any>;
  retriever_resources: Array<Record<string, any>>;
}

interface MessageReplaceEvent extends BaseEvent {
  answer: string;
}

interface ErrorEvent extends BaseEvent {
  status: number;
  code: string;
  message: string;
}

type PingEvent = BaseEvent;

type StreamEvent =
  | MessageEvent
  | AgentMessageEvent
  | TtsMessageEvent
  | TtsMessageEndEvent
  | AgentThoughtEvent
  | MessageFileEvent
  | MessageEndEvent
  | MessageReplaceEvent
  | ErrorEvent
  | PingEvent;
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
//  const api_sendMessage = (props: ServerBase<SendMessageRequest>): Promise<any> => {
//   const { url, method } = sendMessageConfig;
//   const requestData = {
//     query: props.data.query,
//     inputs: props.data.inputs || {},
//     response_mode: 'streaming',
//     user: props.data.user,
//     conversation_id: props.data.conversation_id || '',
//     files: props.data.files,
//     auto_generate_name: props.data.auto_generate_name || true,
//   };
//   const http = createAxiosInstance(props.config.url, props.config.token);
//   const queryUrl = `${url}`;
//   return new Promise((resolve, reject) => {
//     http({
//       url: queryUrl,
//       method,
//       data: requestData,
//     });
//     // .then((response) => {
//     //   if (response) {
//     //     processStreamedData(response, (data) => {
//     //       console.log(data);
//     //       return data;
//     //     });
//     //   }
//     // })
//     // .catch((err) => {
//     //   console.error(err);
//     // })
//     // .finally(() => {
//     //   console.log('11111111111111111111111,结束了');
//     // });
//   });
// };
export const processStreamedData = (streamString: string, onData: (data: StreamEvent) => void) => {
  const lines = streamString.split('\n\n'); // 分割每个 data 块

  lines.forEach((line: string) => {
    if (line.startsWith('data: ')) {
      try {
        const jsonStr = line.replace('data: ', '').trim(); // 提取JSON字符串
        const jsonData: StreamEvent = JSON.parse(jsonStr); // 解析为对象

        // 根据事件类型处理
        switch (jsonData.event) {
          case 'message':
          case 'agent_message':
          case 'message_replace':
            onData(jsonData); // 返回整个对象
            break;
          case 'tts_message': {
            const audioBase64 = (jsonData as TtsMessageEvent).audio;
            const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
            const audioUrl = URL.createObjectURL(audioBlob);
            (jsonData as TtsMessageEvent).audio = audioUrl; // 添加音频URL到对象中
            onData(jsonData);
            break;
          }
          case 'tts_message_end':
          case 'message_end':
          case 'agent_thought':
          case 'message_file':
          case 'error':
          case 'ping':
            onData(jsonData); // 直接返回整个对象
            break;
          default:
            console.log('Unknown event:', jsonData.event);
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error, line);
      }
    }
  });
};
// 工具函数：将 base64 字符串转成 Blob
// 工具函数：将 base64 字符串转成 Blob
function base64ToBlob(base64: string, mime: string) {
  const byteChars = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteChars.length; offset += 512) {
    const slice = byteChars.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: mime });
}
