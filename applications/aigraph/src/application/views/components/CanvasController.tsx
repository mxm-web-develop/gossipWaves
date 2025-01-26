import Fullscreen from '../../assets/img/Fullscreen.png';
import ScaleDown from '../../assets/img/scaleDown.png';
import ScaleUp from '../../assets/img/scaleUp.png';
import Refresh from '../../assets/img/refresh.png'; 

export default function CanvasController(props: {
  handleEvent: (type: string, data?: any) => any;
}) {
  const { handleEvent } = props;
  return    <div
  style={{ top: '80px', width: '44px' }}
  className="absolute z-50 right-[15px] border-[1px] border-solid border-[#EEEEEE] rounded-[4px] bg-white"
>
  {[
    { img: Fullscreen, type: 'fullScreen' },
    { img: ScaleUp, type: 'scaleUp' },
    { img: ScaleDown, type: 'scaleDown' },
    { img: Refresh, type: 'refresh' },
  ].map((item, index: number) => {
    return (
      <div
        key={item.type}
        style={{ borderTop: index !== 0 ? '1px solid #eeeeee' : 'none' }}
        className={`graphBtns w-full h-[44px] flex justify-center items-center cursor-pointer`}
        onClick={() => handleEvent(item.type)}  
      >
        <img src={item.img} width={20} height={20} />
      </div>
    );
  })}
  </div>  
}
