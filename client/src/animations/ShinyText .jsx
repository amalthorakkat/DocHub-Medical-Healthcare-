

// import React from "react";

// const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
//   return (
//     <div
//       className={`inline-block ${className}`}
//       style={{
//         backgroundImage: disabled
//           ? 'none'
//           : 'linear-gradient(120deg, rgba(0, 0, 0, 0.3) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0.3) 60%)',
//         backgroundSize: '200% 100%',
//         backgroundClip: disabled ? 'initial' : 'text',
//         WebkitBackgroundClip: disabled ? 'initial' : 'text',
//         color: disabled ? '#3C3743' : 'transparent',
//         animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
//       }}
//     >
//       {text}
//       <style jsx="true">{`
//         @keyframes shine {
//           0% {
//             background-position: 200%;
//           }
//           100% {
//             background-position: -200%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ShinyText;


import React from "react";

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  return (
    <div
      className={`inline-block font-bold ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
        color: disabled ? "#A0A0A0" : "#ffffff", // text stays white
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {text}
      </span>
      {!disabled && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            height: "100%",
            width: "100%",
            background: "linear-gradient(120deg, transparent 40%, #272B32 50%, transparent 60%)",
            animation: `shine ${speed}s linear infinite`,
            zIndex: 2,
            mixBlendMode: "multiply", // blends dark streak with white text
          }}
        />
      )}
      <style jsx="true">{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ShinyText;
