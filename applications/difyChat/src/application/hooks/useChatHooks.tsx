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
      const itemDate = new Date(item.updated_at);
      const daysDifference = differenceInDays(now, itemDate);
      let found = false;

      for (const rule of rules) {
        if (daysDifference <= rule.dayPeriod) {
          if (!sortedList[rule.label]) {
            sortedList[rule.label] = [];
          }
          sortedList[rule.label].push(item);
          found = true;
          // console.log('Matched Rule:', rule.label); // 调试输出
          break; // 确保每个数据项只分类到一个时间段
        }
      }

      if (!found) {
        sortedList.other.push(item);
        // console.log('Placed in "other" category:', item.label); // 调试输出
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