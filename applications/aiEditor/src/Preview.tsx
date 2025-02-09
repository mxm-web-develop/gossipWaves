import { useRef, useState } from "react";
import { MxmEditor } from "./application/lib_enter";

function Preview() {
  const [data, setData] = useState<any>(null);
  const editorRef = useRef<any>(null);

  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  const handleSubmit = async () => {
    if (editorRef.current) {
      console.log('提交', await editorRef.current.getHtml());
    }
  }
  const handleDelete = async () => {
    if (editorRef.current) {
      console.log('清空', await editorRef.current.clear());
    }
  }
  const handleGetData = async () => {
    if (editorRef.current) {
      console.log('获取数据', await editorRef.current.getData());
    }
  }
  const handleGetMd = async () => {
    if (editorRef.current) {
      console.log('获取Markdown', await editorRef.current.getMarkdown());
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}  >
        <button onClick={handleSubmit} >获取HTML</button>
        <button onClick={handleDelete} >清空</button>
        <button onClick={handleGetData} >获取数据</button>
        <button onClick={handleGetMd} >获取Markdown</button>
      </div>
      <MxmEditor ref={editorRef} defaultValue='默认文字' />
    </div>
  )
}


export default Preview
