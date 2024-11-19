import { differenceInDays } from 'date-fns';
import { SortRules } from '../types/system';
import { IConversationItem } from '../types/chat.types';
const useChatHooks = () => {

  const chunkDataByTimeStamp = (
    data: IConversationItem[],
    rules: SortRules[]
  ): Record<string, IConversationItem[]> => {
    const now = new Date();
    const sortedList: Record<string, IConversationItem[]> = {
      other: [],
    };

    data.forEach((item) => {
      const itemDate = new Date(item.updated_at * 1000); // 如果时间戳是秒级，需要乘以1000
      const daysDifference = differenceInDays(now, itemDate);
      let found = false;

      for (const rule of rules) {
        if (daysDifference <= rule.dayPeriod) {
          if (!sortedList[rule.label]) {
            sortedList[rule.label] = [];
          }
          sortedList[rule.label].push(item);
          found = true;
          break;
        }
      }
      if (!found) {
        if (!sortedList['others']) {
          sortedList['others'] = [];
        }
        sortedList['others'].push(item);
      }
    });

    // console.log('Sorted List:', sortedList); // 调试输出
    return sortedList;
  };

  return {
    chunkDataByTimeStamp
  }
}

export {
  useChatHooks
}