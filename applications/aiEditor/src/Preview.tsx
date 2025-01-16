import {MxmEditor} from "./application/lib_enter";

function Preview() {
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  return <MxmEditor />
}


export default Preview
