import { ConfigProvider, Modal } from 'antd';
import Editor, { loader } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { highlightAll } from 'prismjs';
import './CodeSearchTemplate.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-cypher';

interface ICodeSearchTemplate {
  searchCode?: string;
  eventsEmitter: (t: string, d?: any) => void;
}
const CodeSearchTemplate = (props: ICodeSearchTemplate) => {
  const { searchCode, eventsEmitter } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loader.config({
      paths: {
        vs: '/vs',
      },
    });
  }, []);

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
        className="cursor-nesw-resize h-[75vh] bg-gray-800  text-white rounded-lg overflow-y-scroll overflow-x-auto"
        style={{ height: '100%' }}
      >
        <code className="language-javascript">{searchCode}</code>
      </pre>
    </div>
  );
};

export default CodeSearchTemplate;
