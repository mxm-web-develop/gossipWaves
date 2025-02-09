
// import useAppStore from "@/store";

import Upload from "@/components/Upload";

// import { isMobile, } from 'react-device-detect'
// import { useEffect } from "react";

export default async function Home() {
  return (
    <div>
      <h3 className=" text-lg">视频列表模块</h3>
      <div className="mb-8">
        <h4 className="text-md mb-2">上传新视频</h4>
        <Upload />
      </div>
    </div>
  )
}
