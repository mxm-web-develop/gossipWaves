import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useStateStore } from '../store';
import { AppStatus } from '../store/system.type';
import { HotTable, HotTableClass } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import { Tabs } from '@radix-ui/themes';
// import { registerRenderer, textRenderer } from 'handsontable/renderers';

interface XlsxDisplayProps {
  width?: number;
}

function findLongestNumberLength(matrix: any[]) {
  let maxLength = 0;

  for (const row of matrix) {
    const length = row.length;
    if (length > maxLength) {
      maxLength = length;
    }
  }

  return maxLength;
}

const XlsxDisplay: React.FC<XlsxDisplayProps> = ({ width }) => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const { appState, setAppStatus } = useStateStore();
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [tableHeight, setTableHeight] = useState<number>(0); // 用于存储表格高度
  const hotTableRef = useRef<HotTableClass>(null); // 引入 ref
  const tableContainer = useRef<HTMLDivElement>(null); // 添加 ref

  useEffect(() => {
    const handleResize = () => {
      const parentHeight = tableContainer.current?.clientHeight || 0; // 使用 ref 获取高度
      const newHeight = parentHeight - 45; // 计算动态高度
      // 仅在高度变化时更新 tableHeight
      if (newHeight !== tableHeight) {
        setTableHeight(newHeight);
      }
    };

    // 初始化时设置高度
    handleResize();

    // // // 使用 ResizeObserver 监听 tableContainer 的高度变化
    // const resizeObserver = new ResizeObserver(handleResize);
    // if (tableContainer.current) {
    //   resizeObserver.observe(tableContainer.current);
    // }

    // // 清理 ResizeObserver
    // return () => {
    //   if (tableContainer.current) {
    //     resizeObserver.unobserve(tableContainer.current);
    //   }
    // };
  }, []);

  useEffect(() => {
    if (appState.data?.length) {
      const currentFileData = appState.data.find((item) => item.id === appState.current_file);
      const checha_data = currentFileData?.checha_data;
      if (!checha_data) return;
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array', cellStyles: true });
        console.log(wb);
        setWorkbook(wb);
        const sheetNames = wb.SheetNames;
        setSheets(sheetNames);
        if (sheetNames.length > 0) {
          const initialSheet = wb.Sheets[sheetNames[0]];
          updateSheetData(initialSheet);
          setSelectedSheet(sheetNames[0]); // 确保设置默认选中的工作表
        }
      };

      try {
        fileReader.readAsArrayBuffer(checha_data);
        setAppStatus(AppStatus.LOADED);
      } catch (err) {
        console.error(err);
      }
    }
  }, [appState.data, appState.current_file]);

  const updateSheetData = (worksheet: XLSX.WorkSheet) => {
    let jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
    const maxRows = findLongestNumberLength(jsonData);
    jsonData = jsonData.map((item) => {
      return [...item, ...Array(maxRows - item.length).fill([])];
    });
    setRows(jsonData);
    const merges = worksheet['!merges'] || [];

    // Validate merges
    const validMerges = merges.filter((merge) => {
      return (
        merge.s.r < jsonData.length &&
        merge.e.r < jsonData.length &&
        merge.s.c < (maxRows || 0) &&
        merge.e.c < (maxRows || 0)
      );
    });

    if (hotTableRef.current && hotTableRef.current.hotInstance) {
      const columnCount = maxRows || 0;
      const colWidths = Array(columnCount).fill(160);
      hotTableRef.current.hotInstance.updateSettings({
        data: jsonData,
        colWidths: colWidths,
        mergeCells: validMerges.map((merge) => ({
          row: merge.s.r,
          col: merge.s.c,
          rowspan: merge.e.r - merge.s.r + 1,
          colspan: merge.e.c - merge.s.c + 1,
        })),
        // cells: (row, col) => {
        //   const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        //   const cellStyle = cell && cell.s; // 获取单元格样式

        //   const cellMeta: any = {};
        //   if (cellStyle) {
        //     if (cellStyle.bgColor) {
        //       cellMeta.className = 'custom-bg'; // 使用类名来设置背景色
        //       cellMeta.style = { backgroundColor: `#${cellStyle.bgColor.rgb}` }; // 背景色
        //     }
        //     if (cellStyle.fgColor) {
        //       cellMeta.style = { ...cellMeta.style, color: `#${cellStyle.fgColor.rgb}` }; // 字体颜色
        //     }
        //     if (cellStyle.patternType === 'solid') {
        //       cellMeta.style = { ...cellMeta.style, border: '1px solid black' }; // 边框样式
        //     }
        //     if (cellStyle.alignment && cellStyle.alignment.horizontal === 'center') {
        //       cellMeta.style = { ...cellMeta.style, textAlign: 'center' }; // 居中对齐
        //     }
        //   }
        //   return cellMeta; // 返回单元格元数据
        // },
      });
      hotTableRef.current.hotInstance.render();
    }
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      const worksheet = workbook.Sheets[sheetName];
      updateSheetData(worksheet);
    }
  };
  // excel用统一的头
  //const columnHeaders = useMemo(() => rows[0] || [], [rows]);

  return (
    <div
      ref={tableContainer}
      id="table-container"
      className="mx-auto"
      style={{ height: `calc(100%)` }}
    >
      <HotTable
        ref={hotTableRef}
        data={rows} // 使用 rows 作为数据源
        colHeaders={true} // 设置列头
        rowHeaders={true} // 显示行头
        width={'100%'} // 设置表格宽度
        height={tableHeight || '500px'} // 设置表格高度
        //readOnly={true}
        manualColumnResize={true} // 启用列宽拖拽调整
        manualRowResize={true}
        bindRowsWithHeaders={true}
        // mergeCells={merges.map((merge) => ({
        //   row: merge.s.r,
        //   col: merge.s.c,
        //   rowspan: merge.e.r - merge.s.r + 1,
        //   colspan: merge.e.c - merge.s.c + 1,
        // }))}
        licenseKey="non-commercial-and-evaluation"
      />
      <div className="my-2">
        <Tabs.Root value={selectedSheet} onValueChange={handleSheetChange}>
          <Tabs.List className="flex border-b-2 border-gray-300">
            {sheets.map((sheet) => (
              <Tabs.Trigger
                key={sheet}
                value={sheet}
                className="px-4 h-[40px] border border-solid border-gray-300 py-2 cursor-pointer transition-colors duration-300 
                       data-[state=active]:bg-green-500 data-[state=active]:text-white 
                       hover:bg-blue-200"
              >
                {sheet}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {/* <Tabs.Content value={selectedSheet}>
            2323
          </Tabs.Content> */}
        </Tabs.Root>
      </div>
    </div>
  );
};

export default XlsxDisplay;
