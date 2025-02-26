import React, { useEffect, useMemo, useRef, useState } from 'react';
import Papa from 'papaparse';
import { AppStatus } from '../store/system.type';
import { useStateStore } from '../store';
import { HotTable, HotTableClass } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

interface CsvDisplayProps {
  width?: number;
}

const CsvDisplay: React.FC<CsvDisplayProps> = ({ width }) => {
  const [rows, setRows] = useState<string[][]>([]);
  const { appState, setAppStatus } = useStateStore();
  const [tableHeight, setTableHeight] = useState<number>(0);
  const hotTableRef = useRef<HotTableClass>(null);
  const tableContainer = useRef<HTMLDivElement>(null);

  const updateHeight = () => {
    const parentHeight = tableContainer.current?.clientHeight || 0;
    if (parentHeight !== tableHeight) {
      setTableHeight(parentHeight);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateHeight); // 确保只在下一帧更新
    });

    if (tableContainer.current) {
      resizeObserver.observe(tableContainer.current);
      updateHeight(); // 初始化时手动调用一次
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [tableHeight]); // tableHeight 的变化不应导致循环

  useEffect(() => {
    if (appState.data?.length) {
      const currentFileData = appState.data.find((item) => item.id === appState.current_file);
      const checha_data = currentFileData?.checha_data;
      if (!checha_data) return;
      Papa.parse(checha_data, {
        complete: (results) => {
          console.log(results.data);
          setRows(results.data as string[][]);
        },
        header: false,
      });
      setAppStatus(AppStatus.LOADED);
    }
  }, [appState.data, appState.current_file]);

  const columnHeaders = useMemo(() => rows[0] || [], [rows]);

  return (
    <div ref={tableContainer} className="mx-auto" style={{ height: '100%' }}>
      <HotTable
        ref={hotTableRef}
        data={rows.slice(1)} // 使用 rows 作为数据源
        colHeaders={columnHeaders} // 设置列头
        rowHeaders={true} // 显示行头
        width={'100%'} // 设置表格宽度
        height={tableHeight || '500px'} // 设置表格高度
        manualColumnResize={true} // 启用列宽拖拽调整
        manualRowResize={true} // 启用行高拖拽调整
        licenseKey="non-commercial-and-evaluation"
        colWidths={Array(rows[0]?.length || 0).fill(160)}
      />
    </div>
  );
};

export default CsvDisplay;
