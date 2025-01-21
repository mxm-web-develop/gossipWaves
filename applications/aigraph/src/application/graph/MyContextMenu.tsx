/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createPortal } from 'react-dom';
import { Menu } from 'antd';
import './style.css';
import { useEffect } from 'react';

export enum contextMenuType {
  'NODE:ONCE' = 'node:once',
  'NODE:SECOND_DEGREE' = 'node:second_degree',
  'NODE:THIRD_DEGREE' = 'node:third_degree',
  'NODE:FOUR_DEGREE' = 'node:four_degree',
  'NODE:ANT_SELECT' = 'node:ant_select',
  'NODE:DELETE' = 'node:delete',
  'NODE:VIEW' = 'node:view',
}

const MyContextMenu = ({
  targetInfo,
  handleContextMenuEvent,
}: {
  targetInfo: { info: any; targetType: string };
  handleContextMenuEvent: (type: string, data?: any) => void;
}) => {
  return (
    <div id="context-menu" className="fixed bg-white rounded-md shadow-md dark:bg-slate-950">
      {targetInfo.targetType === 'node' && (
        <NodeMenu handleContextMenuEvent={handleContextMenuEvent} />
      )}
    </div>
  );
};

export default MyContextMenu;

const NodeMenu = ({ handleContextMenuEvent }: any) => {
  const items = [
    {
      key: 'graphAiSub1',
      label: '展开',
      popupClassName: 'graphSubMenu',
      popupOffset: [-4, -5],
      children: [
        {
          key: contextMenuType['NODE:ONCE'],
          label: '一度',
          width: 86,
        },
        { key: contextMenuType['NODE:SECOND_DEGREE'], label: '二度' },
        { key: contextMenuType['NODE:THIRD_DEGREE'], label: '三度' },
        { key: contextMenuType['NODE:FOUR_DEGREE'], label: '四度' },
      ],
    },
    {
      key: contextMenuType['NODE:ANT_SELECT'],
      label: '反选',
    },
    {
      key: contextMenuType['NODE:DELETE'],
      label: '清除节点',
    },
    {
      key: contextMenuType['NODE:VIEW'],
      label: '节点详细信息',
    },
  ];
  return (
    <Menu
      selectable={false}
      mode="vertical"
      style={{ width: 120, borderRadius: '4px 0 0 4px', padding: 0, fontSize: '12px' }}
      items={items}
      onClick={({ item, key, keyPath, domEvent }: any) => {
        handleContextMenuEvent && handleContextMenuEvent(key);
        console.log('====================================');
        console.log(item, key, keyPath, domEvent);
        console.log('====================================');
      }}
    />
  );
};
