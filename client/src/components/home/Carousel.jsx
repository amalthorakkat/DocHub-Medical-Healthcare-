


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
import ShinyText from "../../animations/ShinyText "; // Ensure correct path
import FadeContent from "../../animations/FadeContent";

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
    <div className="mt-10 mb-10">
      <FadeContent blur={true} delay={200}>
      <h1 className="text-center  ">
        <ShinyText
          text="A MERN Stack Based Project"
          speed={4}
          className="text-2xl font-medium"
        />
      </h1>
      <div className="flex items-center justify-center w-full max-w-[1000px] h-[100px] mx-auto relative overflow-hidden">
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={28}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#272B32"
          ariaLabel="Technology partners"
        />
      </div>
      </FadeContent>
    </div>
  );
};

export default Carousel;
