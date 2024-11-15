import anime from "animejs";
import { useEffect, useRef } from "react";

const Loading = () => {
  const textRef = useRef<any>(null);

  useEffect(() => {
    // 获取每个字符的DOM节点
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll('.letter');

      // 为每个字符添加动画
      anime({
        targets: letters,
        translateY: [
          { value: -10, duration: 300, easing: 'easeOutQuad' },
          { value: 10, duration: 300, easing: 'easeInQuad' },
          { value: 0, duration: 300, easing: 'easeOutQuad' },
        ],
        opacity: [
          { value: 0.3, duration: 300 },
          { value: 1, duration: 300 }
        ],
        delay: anime.stagger(100), // 逐个延迟启动
        loop: true,
      });
    }
  }, []);

  return (
    <div className="w-full h-full flex relative items-center justify-center">
      <span ref={textRef} className=" text-xs">
        {[...'mxm.ai'].map((char, index) => (
          <span key={index} className=" font-cRoboto letter text-theme-white font-semibold text-2xl inline-block">
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}

export default Loading