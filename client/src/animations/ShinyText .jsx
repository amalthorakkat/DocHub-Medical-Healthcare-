// import React from "react";

// const ShinyText = ({ text, disabled = false, speed = 5, className = "" }) => {
//   return (
//     <div
//       className={`inline-block text-[#b5b5b5a4] ${
//         disabled ? "" : "animate-shine"
//       } ${className}`}
//       style={{
//         backgroundImage:
//           "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
//         backgroundSize: "200% 100%",
//         backgroundClip: "text",
//         WebkitBackgroundClip: "text",
//         color: "transparent", // Required for background-clip to show through
//         animation: disabled ? "none" : `shine ${speed}s linear infinite`, // Apply animation directly
//       }}
//     >
//       {text}
//     </div>
//   );
// };

// export default ShinyText;

import React from "react";

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : 'linear-gradient(120deg, rgba(0, 0, 0, 0.3) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0.3) 60%)', // White shine
        backgroundSize: '200% 100%',
        backgroundClip: disabled ? 'initial' : 'text',
        WebkitBackgroundClip: disabled ? 'initial' : 'text',
        color: disabled ? '#3C3743' : 'transparent', // Text color #3C3743 when disabled
        animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 200%;
          }
          100% {
            background-position: -200%;
          }
        }
      `}</style>
    </div>
  );
};

export default ShinyText;