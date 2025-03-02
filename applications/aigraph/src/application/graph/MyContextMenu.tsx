/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Menu } from 'antd';
import './style.css';
import Arrowright from '../assets/img/Arrowright.png';
import { relative } from 'path';
import { useState } from 'react';
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
        <NodeMenu handleContextMenuEvent={handleContextMenuEvent} targetInfo={targetInfo} />
      )}
    </div>
  );
};

export default MyContextMenu;

const NodeMenu = ({ handleContextMenuEvent, targetInfo }: any) => {
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
  const [subMenu, setSubMenu] = useState([]);
  return (
    // <Menu
    //   selectable={false}
    //   mode="vertical"
    //   style={{ width: 120, borderRadius: '4px 0 0 4px', padding: 0, fontSize: '12px' }}
    //   items={items}
    //   onClick={({ item, key, keyPath, domEvent }: any) => {
    //     handleContextMenuEvent && handleContextMenuEvent(key, targetInfo);
    //   }}
    // />
    <div
      style={{
        backgroundColor: '#fff',
        width: '120px',
        height: '156px',
        boxShadow: '0 4px 12px 0 #eee',
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
        padding: '4px 0 0 0',
        position: 'relative',
      }}
    >
      {items.map((item: any, index: number) => {
        return (
          <div
            key={item.key}
            style={{
              height: '32px',
              marginTop: '4px',
              cursor: 'pointer',
              lineHeight: '32px',
              color: '#2a2a2a',
              fontSize: '12px',
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            className="myContextMenuItem"
            onClick={() => {
              handleContextMenuEvent && handleContextMenuEvent(item.key, targetInfo);
            }}
            onMouseOver={() => {
              setSubMenu(item.children || []);
            }}
          >
            {item.label}
            {item.children?.length && <img src={Arrowright} width={10} height={10} />}
          </div>
        );
      })}
      {!!subMenu.length && (
        <div
          style={{
            backgroundColor: '#fff',
            width: '86px',
            height: '156px',
            boxShadow: '0 4px 12px 0 #eee',
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
            padding: '4px 0 0 0',
            position: 'absolute',
            top: 0,
            left: '120px',
            borderLeft: '1px solid #eee',
          }}
        >
          {subMenu.map((item: any, index: number) => {
            return (
              <div
                key={item.key}
                style={{
                  height: '32px',
                  marginTop: '4px',
                  cursor: 'pointer',
                  lineHeight: '32px',
                  color: '#2a2a2a',
                  fontSize: '12px',
                  padding: '0 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                className="myContextMenuItem"
                onClick={() => {
                  handleContextMenuEvent && handleContextMenuEvent(item.key, targetInfo);
                }}
              >
                {item.label}
                {item.children?.length && <img src={Arrowright} width={10} height={10} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
