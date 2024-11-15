import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { cn } from '@udecode/cn';
import { useRef, useState } from 'react';

import { IConversationItem } from '../../types/chat.types';
import useAppStore from '../../store';
import { Dialog } from 'antd-mobile';
import { api_deleteConversation } from '../../services/apis/delete_conversation';
import { api_getConversations } from '../../services';



interface ITopicListItem {
  data: IConversationItem;
  isActive: boolean;
  isDisabled: boolean;
  handleEvent?: (type: string, data: any) => void;
}
const baseClass =
  'cursor-pointer relative flex text-theme-white hover:text-white items-start justify-between   flex items-center px-[16px] py-[14px] text-[12px]  relative';
const activeClass = 'shadow-sm text-theme-primary   bg-theme-dark shadow';
const disabledClass = 'disabled';

const ConversationItem = (props: ITopicListItem) => {
  const setChatData = useAppStore(state => state.setChatData)
  const ref = useRef<HTMLDivElement>(null);
  const { isActive, isDisabled, data } = props;
  const config = useAppStore(state => state.config_data)
  const chat_data = useAppStore(state => state.chat_data)
  const ItemStyles = cn(
    baseClass,
    { [activeClass]: isActive },
    { [disabledClass]: isDisabled }
    // { [hoveredClass]: isHovered && !isDisabled && !isActive } // 仅在非禁用状态下应用悬停样式
  );

  // const handleItemEvents = (e: any) => {
  //   console.log('12312312')
  //   setChatData((pre) => ({
  //     ...pre,
  //     actived_conversation: data.id
  //   }))
  // };



  return (
    <div
      key={data.id}
      onPointerDown={() => props.handleEvent && props.handleEvent('change', data.id)}
      ref={ref}
      className={ItemStyles}
    >
      <div className="line-clamp-1  break-words text-ellipsis w-[150px]">
        {data.name ? data.name : '未命名聊天'}
      </div>
      {isActive && (
        <div className="h-full  flex items-center">
          <DeleteOutlined className="text-[#999999]" onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            Dialog.show({
              className: 'custom-dialog',
              title: "提示",
              content: '确认删除该对话记录？',
              actions: [
                {
                  key: 'cancel',
                  text: '取消',
                  onClick: () => Dialog.clear()
                },
                {
                  key: 'delete',
                  text: "删除",
                  danger: true,
                  bold: true,
                  onClick: async () => {
                    try {
                      if (!chat_data.actived_conversation) return
                      await api_deleteConversation({
                        data: {
                          user: 'mxm', // 替换为实际用户ID
                          conversation_id: chat_data.actived_conversation // 替换为实际会话ID
                        },
                        config: config
                      });
                      api_getConversations({
                        data: {
                          user: 'mxm'
                        },
                        config: config
                      }).then(data => {
                        const activeId = data.data && data.data.length > 0 ? data.data[0].id : ''
                        setChatData(pre => ({
                          ...pre,
                          conversations: data as any,
                          actived_conversation: activeId
                        }))
                      })
                      Dialog.clear(); // 成功后关闭对话框
                      // 这里可以添加删除成功后的逻辑，比如刷新列表
                    } catch (error) {
                      console.error('删除失败', error);
                      // 这里可以添加错误处理逻辑
                    }
                  }
                }
              ]

            })
          }} />
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
