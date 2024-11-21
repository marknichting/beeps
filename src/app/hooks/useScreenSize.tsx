import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const useScreenSize = (breakpoint: Breakpoint, initialValue: boolean) => {
  const [isLargerThan, setIsLargerThan] = useState(initialValue);

  useEffect(() => {
    const checkSize = () => {
      setIsLargerThan(window.innerWidth >= breakpoints[breakpoint]);
      console.log('checkSize');
    };

    checkSize();

    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isLargerThan;
};

export default useScreenSize;
