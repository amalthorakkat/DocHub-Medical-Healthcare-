

// import React from "react";
// import PosterImage from "../../assets/appointment_img.png";
// import { useNavigate } from "react-router-dom";
// import FadeContent from "../../animations/FadeContent";


// const Poster2 = () => {
//   const navigate = useNavigate()
//   return (
//     <div className="lg:px-[70px] px-[15px] ">
//       <FadeContent blur={true} delay={200} > 

     
//       <section className="relative bg-[#5f6fff] rounded-2xl shadow-lg my-10 mx-4 lg:mx-20">
//         <div className="w-full h-[450px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10">
//           {/* Left Text */}
//           <div className="flex flex-col justify-center text-center md:text-left">
//             <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-4">
//               Book Appointments <br /> With Trusted Doctors
//             </h1>
//             <p className="text-base md:text-lg text-white/90 mb-6 max-w-md mx-auto md:mx-0">
//               Access 100+ verified doctors across multiple specialties. Schedule
//               your visit quickly and hassle-free.
//             </p>
//             <div>
//               <button
//               onClick={()=>navigate('/signup')}
//                 className="px-6 py-3 bg-[#f5961d] text-[white] font-medium rounded-full shadow-md
//              hover:bg-[white] hover:text-black cursor-pointer active:scale-95 transition transform duration-200"
//               >
//                 Create Account
//               </button>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="relative hidden md:flex justify-center items-end">
//             <img
//               src={PosterImage}
//               alt="Doctor Appointment"
//               className="w-full max-w-sm md:max-w-md drop-shadow-xl rounded-xl 
//                          -mt-20 object-bottom "
//             />
//           </div>
//         </div>
//       </section>
//        </FadeContent>
//     </div>
//   );
// };

// export default Poster2;


import React from "react";
import PosterImage from "../../assets/appointment_img.png";
import { useNavigate } from "react-router-dom";
import FadeContent from "../../animations/FadeContent";
import { useSelector } from "react-redux";  // ✅ bring in Redux state

const Poster2 = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // ✅ get logged-in user

  return (
    <div className="lg:px-[70px] px-[15px] ">
      <FadeContent blur={true} delay={200}>
        <section className="relative bg-[#5f6fff] rounded-2xl shadow-lg my-10 mx-4 lg:mx-20">
          <div className="w-full h-[450px] mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10">
            {/* Left Text */}
            <div className="flex flex-col justify-center text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-4">
                Book Appointments <br /> With Trusted Doctors
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-md mx-auto md:mx-0">
                Access 100+ verified doctors across multiple specialties.
                Schedule your visit quickly and hassle-free.
              </p>
              <div>
                {user ? (
                  <button
                    onClick={() => navigate("/all-doctors")}
                    className="px-6 py-3 bg-[#f5961d] text-white font-medium rounded-full shadow-md
                               hover:bg-white hover:text-black cursor-pointer active:scale-95 
                               transition transform duration-200"
                  >
                    Browse Doctors
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-6 py-3 bg-[#f5961d] text-white font-medium rounded-full shadow-md
                               hover:bg-white hover:text-black cursor-pointer active:scale-95 
                               transition transform duration-200"
                  >
                    Create Account
                  </button>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden md:flex justify-center items-end">
              <img
                src={PosterImage}
                alt="Doctor Appointment"
                className="w-full max-w-sm md:max-w-md drop-shadow-xl rounded-xl 
                           -mt-20 object-bottom"
              />
            </div>
          </div>
        </section>
      </FadeContent>
    </div>
  );
};

export default Poster2;
