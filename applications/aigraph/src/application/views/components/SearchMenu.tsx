/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import SearchPng from '../../assets/img/Search.png';
import SearchClick from '../../assets/img/SearchClick.png';
import CaretDown from '../../assets/img/CaretDown.png';
import { AI_GRAPH_TYPE } from '../GraphView';
import layoutClick from '../../assets/img/layoutClick.png';

const SearchMenu = ({
  handleEvent,
  open,
  setOpen,
}: {
  handleEvent?: (type: string, data?: any) => any;
  open: boolean;
  setOpen: (arg: boolean) => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px 0 20px',
        height: '30px',
      }}
      onClick={() => {
        handleEvent && handleEvent(AI_GRAPH_TYPE.SEARCH);
      }}
    >
      <img
        src={open ? SearchClick : SearchPng}
        width={16}
        height={16}
        style={{ marginRight: '6px' }}
      />
      <div style={{ color: open ? '#055AFF' : '#555555', fontSize: '12px', marginRight: '8px' }}>
        查询
      </div>
      <img src={open ? layoutClick : CaretDown} width={10} height={10} />
    </div>
  );
};

export default SearchMenu;
