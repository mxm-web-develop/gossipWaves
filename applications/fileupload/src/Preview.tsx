import { Main } from "./application/lib_enter";

function Preview() {
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  return (
    <div className="w-[800px] h-[600px] bg-gray-100">
      <Main />
    </div>
  )
}
//app-H9ftP5wGNWhlqcGfy1CgyDcf

export default Preview
