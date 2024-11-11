import anime from 'animejs';
import React, { useEffect, useRef } from 'react';

interface AnimatedIconProps {
  collapsed: boolean;
  hovered: boolean;
  style?: React.CSSProperties;
}

const AnimatedIcon = ({ collapsed, hovered, style }: AnimatedIconProps) => {
  const defaultStyle: React.CSSProperties = {
    transition: 'transform 0.5s ease-in-out', // Keep transition for transform
    transform: 'translateX(0%)', // Always center initially
    ...style,
  };
  const pathRef = useRef(null);

  useEffect(() => {
    anime({
      targets: pathRef.current,
      d: [
        {
          value: hovered ? (collapsed ? rightArrowPath : leftArrowPath) : verticalPath,
        },
      ],
      easing: 'easeInOutQuad',
      duration: 225,
      loop: false,
    });
  }, [collapsed, hovered]); // Dependencies array to re-run the animation when states change

  // Default vertical line path
  const verticalPath =
    'M3 1.31134e-07C4.65685 2.03558e-07 6 1.34315 6 3L6 19L6 35C6 36.6569 4.65685 38 3 38C1.34314 38 -1.60232e-06 36.6569 -1.5299e-06 35L-8.30517e-07 19L-1.31134e-07 3C-5.87108e-08 1.34315 1.34315 5.87108e-08 3 1.31134e-07Z';
  // Dynamic paths based on collapsed state
  const rightArrowPath =
    'M3.59865 0.5C5.25551 0.5 6.59865 1.84315 6.59865 3.5L12.5987 19.5L6.59865 35.5C6.59865 37.1569 5.25551 38.5 3.59865 38.5C1.9418 38.5 0.598652 37.1569 0.598652 35.5L6.59865 19.5L0.598654 3.5C0.598654 1.84315 1.9418 0.5 3.59865 0.5Z'; // Arrow points to the right
  const leftArrowPath =
    'M9.59848 0.5C11.2553 0.5 12.5985 1.84315 12.5985 3.5L6.59848 19.5L12.5985 35.5C12.5985 37.1569 11.2553 38.5 9.59848 38.5C7.94162 38.5 6.59848 37.1569 6.59848 35.5L0.697131 19.5L6.59848 3.5C6.59848 1.84315 7.94162 0.5 9.59848 0.5Z';

  return (
    <svg width="24" height="24" viewBox="0 0 6 38" fill="black" xmlns="http://www.w3.org/2000/svg">
      <path
        ref={pathRef}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 1.31134e-07C4.65685 2.03558e-07 6 1.34315 6 3L6 19L6 35C6 36.6569 4.65685 38 3 38C1.34314 38 -1.60232e-06 36.6569 -1.5299e-06 35L-8.30517e-07 19L-1.31134e-07 3C-5.87108e-08 1.34315 1.34315 5.87108e-08 3 1.31134e-07Z"
        fill="#999999"
      />
    </svg>
  );
};

export default AnimatedIcon;
