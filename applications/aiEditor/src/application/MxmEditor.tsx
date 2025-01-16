
import './style.css'
import {PlateEditor} from '@/components/editor/plate-editor'
const MxmEditor = (props: {
  children?: React.ReactNode
  className?: string
  good?: boolean
}) => {

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div 
        style={{
          height: '500px',
          width: '720px',
        }}
      className='flex border border-solid border-gray-100 justify-center'>
        <PlateEditor value={'默认的数据'}/>
      </div>
    </div>
    
  )
}

export default MxmEditor