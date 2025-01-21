import { useRef, useState } from "react";
import {MxmEditor} from "./application/lib_enter";

function Preview() {
  const [data,setData] = useState<any>(null);
  const editorRef = useRef<any>(null);
  
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  const handleSubmit = () => {
    if(editorRef.current){  
      console.log('提交',editorRef.current.getHtml());
    }
  }

  return (
    <div>
      <div>编辑器</div>
      <button onClick={handleSubmit} >提交</button>
      <MxmEditor ref={editorRef} defaultValue='默认文字'/>
    </div>
  )
}


export default Preview
