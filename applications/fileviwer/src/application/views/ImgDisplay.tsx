import { useEffect, useMemo } from 'react';
import { AppStatus } from '../store/system.type';
import { useStateStore } from '../store';

export const ImgDisplay = ({ width }: { width: number }) => {
  const { appState, setAppStatus } = useStateStore();
  useEffect(() => {
    setAppStatus(AppStatus.LOADED);
  }, []);

  const file_url = useMemo(() => {
    if (appState.data?.length) {
      const currentFileData = appState.data.find((item) => item.id === appState.current_file);
      if (currentFileData) {
        return currentFileData.file_url;
      }
      return '';
    }
  }, [appState.data, appState.current_file]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <img width={'100%'} src={file_url} />
    </div>
  );
};
