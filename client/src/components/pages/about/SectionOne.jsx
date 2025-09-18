


import React from "react";
import WebsiteLogo from "../../../assets/DocHub.jpg";
import GroupImage from '../../../assets/about_image.png'
import Transition from '../../../animations/Transition'
import FadeContent from '../../../animations/FadeContent'

const SectionOne = () => {
  return (
    <div className="flex flex-col pt-[140px] lg:flex-row px-4 md:px-8 lg:px-[200px] items-center justify-center gap-8 lg:gap-[100px] h-auto lg:h-[100vh] py-16 bg-[conic-gradient(at_center,_#5F6FFF,_#7A85FF,_#A3A9FF,_#FFFFFF,_#5F6FFF)]">
      {/* Content Section */}
      <Transition distance={50} duration={1.5} delay={0.3} >
      <div className="w-full  lg:w-1/2 text-center lg:text-left">

        <h1 className="text-4xl md:text-6xl lg:text-[7.5vw] xl:text-[5.25rem]  mb-4 lg:mb-8 leading-tight">
          This is DocHub
        </h1>
        <div className="text-sm md:text-base lg:text-lg leading-relaxed">
          <p className="pb-5">
            At DocHub, our mission is to remove the complexity from healthcare
            appointments and make it effortless for patients and doctors to
            connect. We help people access the right care at the right time,
            while giving doctors a simple way to manage their schedules and
            patients.
          </p>
          <p>
            Because here’s the truth: health matters to everyone. We believe
            life feels a little easier when booking a doctor is quick,
            stress-free, and reliable—so every patient can focus on getting
            better, not on the hassle of scheduling.
          </p>
        </div>
      </div>
      </Transition >
      {/* Image Section */}

      <FadeContent blur={true} delay={200}>
      <div className="w-full lg:w-1/2 flex justify-center">
        <img className="max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-auto" src={GroupImage} alt="A group of people collaborating" />
      </div>
      </FadeContent>
    </div>
  );
};

export default SectionOne;