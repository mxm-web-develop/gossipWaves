import MxMweb from "./application/DifyChat";

function Preview() {
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  return <MxMweb
    url="/myproxy"
    //token="app-jRRwbSXPpFdDUahm7QmPdyFq"
    token='app-H9ftP5wGNWhlqcGfy1CgyDcf'
    mock={false}
  />
}
//app-H9ftP5wGNWhlqcGfy1CgyDcf

export default Preview
