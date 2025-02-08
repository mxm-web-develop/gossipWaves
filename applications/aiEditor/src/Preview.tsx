import { useRef, useState } from "react";
import {MxmEditor} from "./application/lib_enter";

function Preview() {
  const [data,setData] = useState<any>(null);
  const editorRef = useRef<any>(null);
  
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  const handleSubmit = async () => {
    if(editorRef.current){  
      console.log('提交',await editorRef.current.getMarkdown());
    }
  }
  const handleDelete = async () => {
    if(editorRef.current){  
      console.log('清空',await editorRef.current.clear());
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}  >
      
      <button onClick={handleSubmit} >提交</button>
      <button onClick={handleDelete} >清空</button>
      </div>
      <MxmEditor ref={editorRef} defaultValue='默认文字'/>
    </div>
  )
}


export default Preview
