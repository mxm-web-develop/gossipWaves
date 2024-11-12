import MxMweb from "./application/DifyChat";

function Preview() {
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  return <MxMweb
    url="/myproxy"
    token="app-oo9gDHKOTUN3eDX7oXMvkIv8"
    mock={false}
  />
}


export default Preview
