import React from "react";
import { ReactLenis } from "lenis/react";

function SmoothScroll({ children }) {
  // const lenisOptions = {
  //   duration: 1.2,
  //   easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), // A slightly different easing curve
  //   smoothTouch: true,
  //   smooth: true,
  // };

  const lenisOptions = {
    duration: 1.2,
    easing: (t) => Math.sin((t * Math.PI) / 2),
    smoothTouch: true,
    smooth: true,

    lerp: 1,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
