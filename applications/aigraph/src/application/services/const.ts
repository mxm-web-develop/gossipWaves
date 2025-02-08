export const RAG_APP_NAME = "rag_ai";
export const RAG_AUTH_PLUGIN_PREFIX = "gitech_ril:";
export const MOCK_MODEL_NAME = "GienModel-32b-Finance";

/**
 * @description explanation for fields in setting page
 */

export const EXPLANATION_TEMPERATURE = `温度是模型回答的倾向性，取值范围一般是0～1; 取值趋近0代表着模型回答会更严谨，适合回答检索类问题; 取值趋近1则代表回答更发散，适合回答创新性的问题；`;
export const EXPLANATION_TOP_P = `top_p代表文本块是否取信的门槛值，例如top_p = 0.8就意味着相关性大于0.8的文本块会被提交给大模型用于回答，低于0.8的会被丢弃；`;
export const EXPLANATION_MAXTOKENS = `max_tokens代表模型窗口大小，即一次问答大模型一次能够接受的字符串最大长度，包括用户的提问和模型的回答；多轮对话中历史对话内容也包括在内；最大值取决于大模型本身是否支持；`;
export const EXPLANATION_TOP_K = `top_k代表模型最终取信的文本块数，例如门槛top_p = 0.8，top_k = 3，意味着模型会依据相似度高低取前3个大于0.8的文本块，即使当前可能有大于3个文本块的相似度大于0.8；`;
export const EXPLANATION_KB_NAME = `当前选中的知识库列表，支持多选；`;
export const EXPLANATION_PROMPT = `提示词用于指定聊天的背景和上下文，或者让助手采取某个人格来回答你的问题；`;
export const EXPLANATION_SIMILAR_THRESHOLD = `score_threshold参数是模型进行重排序时，对于文本块取舍的门槛值；`;
export const EXPLANATION_MAX_ROUND = `交互对话场景里，系统能够记忆并有效关联的用户与模型之间来回交流的最大次数；`;
