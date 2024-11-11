import { cn } from "@udecode/cn";
import { PlayOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useMobileOrientation } from "react-device-detect";
interface MInputProps {
  onSend?: (value: string) => void;
}

export default function MInput({ onSend }: MInputProps) {
  const { isPortrait } = useMobileOrientation()
  const [value, setValue] = useState<string>("")
  // const handleOnChange = (v) => setValue(v)
  return (
    <div className="w-[80%] max-w-[480px] mx-auto ">
      <div className="relative">
        <input
          id="name"
          name="name"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="mxm ai"
          className="block w-full rounded-full border-0
           bg-white
           px-4 py-3 text-theme-dark shadow-sm pr-[42px]
            ring-theme-primary placeholder:text-gray-400 sm:text-sm/6"
        />


        <button
          type="button"
          onClick={() => {
            if (onSend) {
              onSend(value)
              setValue('')
            }
            return
          }}
          className={cn("rounded-full absolute top-0 right-0 my-[9px] mr-2  bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", {
            "my-2 mr-2": isPortrait,
          })}
        >
          <PlayOutline />
        </button>
      </div>
    </div>
  )
}