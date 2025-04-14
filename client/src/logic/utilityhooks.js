import { useEffect, useState } from "react";


export const useWidth = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
};

export const useHeight = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  return height;
};

export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const update = () => {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", update);
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrollY;
};
