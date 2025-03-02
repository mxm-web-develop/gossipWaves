import { ConfigProvider, Modal } from 'antd';
import Editor, { loader } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { highlightAll } from 'prismjs';
import './CodeSearchTemplate.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-cypher';
loader.config({
  paths: {
    vs: '/vs',
  },
});
interface ICodeSearchTemplate {
  searchCode?: string;
  eventsEmitter: (t: string, d?: any) => void;
}
const CodeSearchTemplate = (props: ICodeSearchTemplate) => {
  const { searchCode, eventsEmitter } = props;
  const [open, setOpen] = useState(false);

  // 使用 Monaco API
  useEffect(() => {
    highlightAll();
  }, [searchCode]);

  const onEdit = (data: any) => {
    if (eventsEmitter) {
      eventsEmitter('code-search:setCode', data);
    }
  };

  return (
    <div className="h-full">
      {' '}
      <ConfigProvider
        modal={{
          styles: {
            content: {
              padding: 0,
              margin: 0,
              border: 'none',
            },
            body: { padding: 0, margin: 0, border: 'none' },
          },
        }}
      >
        {' '}
        <Modal
          open={open}
          width={800}
          onCancel={() => setOpen(false)}
          maskClosable
          centered
          keyboard
          closable={false}
          footer={null}
          forceRender
        >
          <Editor
            theme="vs-dark"
            width={'100%'}
            height="70vh"
            defaultLanguage="cypher"
            value={searchCode}
            onChange={onEdit}
          />
        </Modal>
      </ConfigProvider>
      <pre
        onClick={() => setOpen(true)}
        style={{
          cursor: 'nesw-resize',
          backgroundColor: '#2d2d2d',
          color: 'white',
          borderRadius: '0.5rem',
          overflowX: 'auto',
          height: '100%',
        }}
      >
        <code className="language-javascript">{searchCode}</code>
      </pre>
    </div>
  );
};

export default CodeSearchTemplate;
