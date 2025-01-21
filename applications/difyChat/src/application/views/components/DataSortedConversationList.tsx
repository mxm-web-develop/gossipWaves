import React from "react";
import ConversationItem from "./ConversationItem";
import { IChatSortRule, IConversationItem } from "../../types/chat.types";
import useAppStore from "../../store";
import { useChatHooks } from "../../hooks/useChatHooks";

interface IDataSortedConversationList {
  data: IConversationItem[]
  sortRule?: IChatSortRule
  setOpen?: any
}

const DataSortedConversationList = (props: IDataSortedConversationList) => {
  const chat_data = useAppStore(state => state.chat_data)
  const setChatData = useAppStore(state => state.setChatData)
  const { chunkDataByTimeStamp } = useChatHooks()
  const handleEvent = (type: string, data?: any) => {
    switch (type) {
      case 'change':
        setChatData((pre) => ({
          ...pre,
          actived_conversation: data
        }))
        props.setOpen && props.setOpen(false)
        break;
    }
  }
  if (!props.data || props.data.length <= 0) {
    return <div className=" flex justify-center h-full w-full items-center py-5">无历史对话</div>;
  } else {
    // 排序列表
    const rules = chat_data.sortRules ? chat_data.sortRules : [{ label: '当天', dayPeriod: 1 }];
    const sortedList = chunkDataByTimeStamp(props.data, rules);
    const hasOtherOnly = rules.every(
      (rule) => !sortedList[rule.label] || sortedList[rule.label].length === 0
    );
    console.log(rules, sortedList, hasOtherOnly)
    return (
      <>
        {rules.map(
          (rule) =>
            sortedList[rule.label] &&
            sortedList[rule.label].length > 0 && (
              <React.Fragment key={rule.label} >
                <div className="pt-[16px] w-full" >
                  <div className="text-[12px] text-[#888888]">{rule.label}</div>
                </div>
                <div className="mt-[8px]">
                  {sortedList[rule.label].map((i) => (
                    <ConversationItem
                      isActive={chat_data.actived_conversation === i.id}
                      isDisabled={false}
                      key={i.id}
                      data={i}
                      handleEvent={handleEvent}
                    />
                  ))}
                </div>
              </React.Fragment>
            )
        )}
        {sortedList.other.length > 0 && !hasOtherOnly && (
          <React.Fragment key="other" >
            <div className="pt-[16px] w-full" >
              <div className="text-[12px] text-[#888888]">其他</div>
            </div>

            {sortedList.other.map((i) => (
              <ConversationItem
                isActive={chat_data.actived_conversation === i.id}
                isDisabled={false}
                key={i.id}
                data={i}
                handleEvent={handleEvent}
              />
            ))}
          </React.Fragment>
        )}
        {hasOtherOnly && sortedList.other.length > 0 && (
          <React.Fragment key="other">
            {sortedList.other.map((i) => (
              <ConversationItem
                isActive={chat_data.actived_conversation === i.id}
                isDisabled={false}
                key={i.id}
                data={i}
                handleEvent={handleEvent}
              />
            ))}
          </React.Fragment>
        )}
      </>
    );
  }
}


export default DataSortedConversationList