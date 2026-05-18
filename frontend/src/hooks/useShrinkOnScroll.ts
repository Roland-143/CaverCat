import { useEffect, useState } from "react";

export const useShrinkOnScroll = (threshold = 64) => {
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsShrunk(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isShrunk;
};
