import { Avatar, Divider, DotLoading } from "antd-mobile";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import { ModuleState } from "@/application/types/chat.types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import './markdownStyle.css'
export default function ChatListItem({ i, chat_data, is_current_stream }: { i: any, chat_data: any, is_current_stream: boolean }) {
  console.log(i, '还在？')
  return (
    <div key={i.id}>
      <Divider
        className=" text-theme-white  bg-transparent"
        style={{
          opacity: 0.2,
          borderStyle: 'dashed',
        }}
        contentPosition='left'>
        <div className=" text-xs flex">
          <p>{dayjs.unix(i.created_at).format('YY-MM-DD HH:mm')}</p>
        </div> </Divider>
      <div className=" text-theme-black mx-5 flex items-center pb-1 gap-x-1">
        {/* <Avatar className=" " style={{ '--size': '24px' }} src='' /> */}
        <div className="relative text-theme-white py-2 rounded-lg max-w-[100%]">
          <p>{i.query}</p>
        </div>
      </div>

      <div className=" text-theme-black mx-5 flex items-center pb-5 gap-x-5">
        {/* <Avatar className=" " style={{ '--size': '24px' }} src='' /> */}
        <div className="relative bg-white p-4 rounded-lg max-w-[100%] md:max-w-[85%]">
          {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
            <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
          </div> */}
          {chat_data.state === ModuleState.Process && is_current_stream && <DotLoading color='primary' />}
          <ReactMarkdown className="markdown-container"
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >{i.answer}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}