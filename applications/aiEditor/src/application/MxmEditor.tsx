import { useEditorState } from '@udecode/plate/react'
import './style.css'
import PlateEditor, { PlateEditorRef } from '@/components/editor/plate-editor'
import { forwardRef, useEffect, useImperativeHandle, ForwardedRef } from 'react'

const MxmEditor = forwardRef((props: {
  children?: React.ReactNode
  className?: string
  token?: string
  url?: string
  defaultValue?: string
}, ref: ForwardedRef<PlateEditorRef>) => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div 
        style={{
          height: '500px',
          width: '720px',
        }}
      className='flex border border-solid border-gray-100 justify-center'>
        <PlateEditor ref={ref} value={props.defaultValue}/>
      </div>
    </div>
    
  )
})

export default MxmEditor