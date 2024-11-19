import { api_stopChatMessages } from "@/application/services/apis/stop_chatmessage";
import useAppStore from "@/application/store";
import { ModuleState } from "@/application/types/chat.types";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@udecode/cn";

import { CircleStop, LoaderCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useMobileOrientation } from "react-device-detect";
interface MInputProps {
  onSend?: (value: string) => void;
}

export default function MInput({ onSend }: MInputProps) {
  const { isPortrait } = useMobileOrientation()
  const [value, setValue] = useState<string>("")

  const config = useAppStore(state => state.config_data)
  const chat_data = useAppStore(state => state.chat_data)
  // const handleOnChange = (v) => setValue(v)
  const handleStop = async () => {
    if (chat_data.current_taskId) {
      await api_stopChatMessages({
        data: {
          user: 'mxm',
          task_id: chat_data.current_taskId
        },
        config: config
      })
    }

    console.log('这里拿到了么', chat_data.current_taskId)
  }
  // useEffect(()=>{
  //   queryClient.getQueryData(['API_GETCHATHISTORY', chat_data.actived_conversation])
  // },[])
  return (
    <div className="w-[80%] max-w-[480px] mx-auto ">
      <div className="relative">
        <input
          id="name"
          name="name"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`mxm ai ${chat_data.state}`}
          className="block w-full rounded-full border-0
           bg-white
           px-4 py-3 text-theme-dark shadow-sm pr-[42px]
            ring-theme-primary placeholder:text-gray-400 sm:text-sm/6"
        />


        <button
          type="button"
          onClick={() => {
            if (onSend) {
              onSend(value)
              setValue('')
            }
            return
          }}
          className={cn("rounded-full absolute top-0 right-0 my-[9px] mr-2  bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", {
            "my-2 mr-2": isPortrait,
          })}
        >
          {chat_data.state === ModuleState.Waiting && <Play size={14} />}
          {chat_data.state === ModuleState.Process && <CircleStop onPointerDown={handleStop} size={14} />}
          {chat_data.state === ModuleState.Loading && <LoaderCircle size={14} className="spin" />}
        </button>
      </div>
    </div>
  )
}