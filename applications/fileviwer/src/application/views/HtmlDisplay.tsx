import { useEffect, useState, useMemo, useRef } from 'react';
import { AppStatus } from '../store/system.type';
import { useStateStore } from '../store';
import { uid } from 'uid';

export const HtmlDisplay = ({ width }: any) => {
  const { appState, setAppStatus } = useStateStore();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const id = useRef(uid(8)); // 使用 useRef 来存储 id
  const currentFileData = useMemo(
    () => appState.data.find((item) => item.id === appState.current_file),
    [appState.data, appState.current_file]
  );

  useEffect(() => {
    console.log(id.current); // 注意这里是 id.current
    if (currentFileData?.checha_data) {
      const blob = currentFileData.checha_data;
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.onload = () => {
        if (appState.status !== AppStatus.PRASING) {
          setAppStatus(AppStatus.PRASING);
        }
        const content = reader.result as string;
        setHtmlContent(content);
      };
      reader.onloadend = () => {
        if (appState.status !== AppStatus.LOADED) {
          setAppStatus(AppStatus.LOADED);
        }
      };
      reader.onerror = (err) => {
        console.log(err);
      };
    }
  }, [appState.data]);

  return (
    <div className="h-full w-full flex justify-center  mx-auto relative overflow-hidden">
      {/* {htmlContent && (
        <div
          key={id.current}
          className="h-full mx-auto"
          style={{ border: 'none', width: '100%' }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )} */}

      {htmlContent && (
        <iframe
          key={id.current}
          className="h-full mx-auto"
          // width={width}
          style={{ border: 'none', width: '100%' }}
          srcDoc={htmlContent}
        />
      )}
    </div>
  );
};
