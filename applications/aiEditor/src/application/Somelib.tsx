import {
  usePlateEditor,
  Plate,
  PlateContent,
} from '@udecode/plate-common/react';

import './style.css'
const MxMweb = (props: {
  children?: React.ReactNode
  className?: string
  good?: boolean
}) => {
  const editor = usePlateEditor();
  return (
    <div className={`flex flex-col justify-center items-center w-screen h-screen
     transition-colors duration-300 bg-white text-black}`}>
      <Plate editor={editor}>
        <PlateContent placeholder="Type..." />
      </Plate>
    </div>
  )
}

export default MxMweb