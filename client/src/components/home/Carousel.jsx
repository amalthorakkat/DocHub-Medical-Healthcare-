// import React from "react";
// import {
//   SiMongodb,
//   SiExpress,
//   SiReact,
//   SiNodedotjs,
//   SiTailwindcss,
//   SiStripe,
//   SiGreensock,
// } from "react-icons/si";
// import LogoLoop from "../../animations/LogoLoop";

// const Carousel = () => {
//   const techLogos = [
//     { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com/" },
//     { node: <SiExpress />, title: "Express", href: "https://expressjs.com/" },
//     { node: <SiReact />, title: "React", href: "https://react.dev/" },
//     { node: <SiNodedotjs />, title: "Node", href: "https://nodejs.org/en" },
//     {
//       node: <SiTailwindcss />,
//       title: "TailwindCss",
//       href: "https://tailwindcss.com/",
//     },
//     { node: <SiStripe />, title: "Stripe", href: "https://stripe.com/in" },
//     { node: <SiGreensock />, title: "GSAP", href: "https://gsap.com/" },
//   ];

//   return (
//     <div className=" flex items-center justify-center w-[600px] h-[200px] relative overflow-hidden mt-10 mb-10 ">
//       <LogoLoop
//         logos={techLogos}
//         speed={120}
//         direction="left"
//         logoHeight={48}
//         gap={40}
//         pauseOnHover
//         scaleOnHover
//         fadeOut
//         fadeOutColor="#ffffff"
//         ariaLabel="Technology partners"
//       />
//     </div>
//   );
// };

// export default Carousel;


import React from "react";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiStripe,
  SiGreensock,
} from "react-icons/si";
import LogoLoop from "../../animations/LogoLoop";

const Carousel = () => {
  const techLogos = [
    { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com/" },
    { node: <SiExpress />, title: "Express", href: "https://expressjs.com/" },
    { node: <SiReact />, title: "React", href: "https://react.dev/" },
    { node: <SiNodedotjs />, title: "Node", href: "https://nodejs.org/en" },
    {
      node: <SiTailwindcss />,
      title: "TailwindCss",
      href: "https://tailwindcss.com/",
    },
    { node: <SiStripe />, title: "Stripe", href: "https://stripe.com/in" },
    { node: <SiGreensock />, title: "GSAP", href: "https://gsap.com/" },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-[1000px] h-[200px] mx-auto relative overflow-hidden mt-10 mb-10">
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={48}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );
};

export default Carousel;