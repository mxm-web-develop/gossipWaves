'use client'
import useAppStore from "@/store";
//import Image from "next/image";
import { useRouter } from 'next/navigation'
import { isMobile, } from 'react-device-detect'
import { useEffect } from "react";

export default function Home() {
  const setAppData = useAppStore(state => state.setAppData)
  // const { orientation } = useMobileOrientation()
  const router = useRouter();
  // const o = isMobile ? orientation : undefined
  useEffect(() => {
    console.log('应用进入', router, setAppData)
    if (typeof window !== 'undefined') {
      setAppData(pre => ({
        ...pre,
        orientation: undefined,
        device: isMobile,
        app_ready: true,
      }))
      if (isMobile) {
        router.push('/m/home')
      } else {
        router.push('/p/home')
      }
    }
  }, [router])

  return null
}
