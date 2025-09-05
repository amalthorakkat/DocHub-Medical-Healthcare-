


// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchConfirmedAppointments } from "../../redux/slices/appointmentSlice";
// import { Calendar, Clock, User, Award, CheckCircle } from "lucide-react";
// import { toast } from "react-hot-toast";

// const ScheduledAppointments = () => {
//   const dispatch = useDispatch();
//   const { confirmedAppointments, loading, error } = useSelector(
//     (state) => state.appointments
//   );

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         await dispatch(fetchConfirmedAppointments()).unwrap();
//         toast.success("Scheduled appointments loaded successfully", {
//           position: "bottom-right",
//           duration: 3000,
//         });
//       } catch (err) {
//         // Error toast handled in the error useEffect
//       }
//     };
//     fetchAppointments();
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error, {
//         position: "bottom-right",
//         duration: 4000,
//       });
//       dispatch({ type: "appointments/clearError" });
//     }
//   }, [error, dispatch]);

//   const formatDate = (dateStr) => {
//     return dateStr
//       ? new Date(dateStr).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         })
//       : "N/A";
//   };

//   const formatTime = (timeStr) => {
//     if (!timeStr) return "N/A";
//     const [hour, minute] = timeStr.split(":").map(Number);
//     const period = hour >= 12 ? "PM" : "AM";
//     const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
//     return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
//   };

//   return (
//     <div className="max-w-6xl mx-auto mb-8 pt-[140px]">
//       <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-900">
//         Scheduled Appointments
//       </h1>

//       {loading && (
//         <div className="flex justify-center items-center h-32">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       )}

//       {!loading && confirmedAppointments.length === 0 && (
//         <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 text-center">
//           <p className="text-gray-600">No scheduled appointments found.</p>
//         </div>
//       )}

//       {confirmedAppointments.map((appointment) => (
//         <div
//           key={appointment._id}
//           className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-8"
//         >
//           <div className="bg-[#F7971E] px-4 sm:px-6 py-2">
//             <h2 className="text-white text-base sm:text-lg font-medium">
//               Scheduled Appointment
//             </h2>
//           </div>
//           <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
//             <div className="flex items-center justify-center md:col-span-1">
//               <img
//                 className="w-[230px] max-w-full max-h-48 sm:max-h-56 object-cover object-center"
//                 src={
//                   appointment.doctorId?.profilePic
//                     ? `http://localhost:5000${appointment.doctorId.profilePic}`
//                     : `https://via.placeholder.com/150?text=${
//                         appointment.doctorId?.name?.charAt(0) || "?"
//                       }`
//                 }
//                 alt={appointment.doctorId?.name || "Unknown Doctor"}
//               />
//             </div>
//             <div className="md:col-span-2 p-3 sm:p-4 md:p-6">
//               <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6">
//                 <div className="flex-1 space-y-2">
//                   <div>
//                     <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
//                       {appointment.doctorId?.name || "Unknown Doctor"}
//                     </h3>
//                     <div className="flex items-center space-x-2 text-gray-600 mb-1">
//                       <User className="w-3 h-3" />
//                       <span className="font-medium text-xs sm:text-sm">
//                         {appointment.doctorId?.specialty || "N/A"}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-500">
//                       <Award className="w-3 h-3" />
//                       <span className="text-xs">
//                         Experience: {appointment.doctorId?.experience || "N/A"}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="border-t border-gray-200 pt-2">
//                     <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
//                       Appointment Details
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <div className="flex items-center space-x-2">
//                         <Calendar className="w-3 h-3 text-gray-400" />
//                         <div>
//                           <div className="text-xs text-gray-500 uppercase">
//                             Date
//                           </div>
//                           <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                             {formatDate(appointment.date)}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Clock className="w-3 h-3 text-gray-400" />
//                         <div>
//                           <div className="text-xs text-gray-500 uppercase">
//                             Time
//                           </div>
//                           <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                             {formatTime(appointment.time)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="md:min-w-[180px] lg:min-w-[200px] md:pl-4 lg:pl-6 md:border-l border-gray-200">
//                   <div className="text-left md:text-right mb-4">
//                     <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//                       Consultation Fee
//                     </div>
//                     <div className="text-xl sm:text-2xl font-bold text-gray-900">
//                       ${appointment.fee || "N/A"}.00
//                     </div>
//                     <div className="text-xs text-gray-500">Per session</div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="w-full bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm">
//                       <CheckCircle className="w-3 h-3" />
//                       <span>Payment Completed</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ScheduledAppointments;


import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConfirmedAppointments } from "../../redux/slices/appointmentSlice";
import { Calendar, Clock, User, Award, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import DocPlaceholder from "../../assets/doc_placeholder.png";

const ScheduledAppointments = () => {
  const dispatch = useDispatch();
  const { confirmedAppointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const [hasFetched, setHasFetched] = useState(false); // Flag to prevent duplicate toasts
  const fetchRef = useRef(false); // Ref to track fetch status

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      if (fetchRef.current) return; // Prevent duplicate fetches
      fetchRef.current = true;

      try {
        await dispatch(fetchConfirmedAppointments()).unwrap();
        if (isMounted && !hasFetched) {
          toast.success("Scheduled appointments loaded successfully", {
            position: "bottom-right",
            duration: 3000,
            style: {
              background: "#fff",
              color: "#1F2937",
              border: "1px solid #F7971E",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
            },
            iconTheme: {
              primary: "#F7971E",
              secondary: "#fff",
            },
            className: "toast-slide-in",
          });
          setHasFetched(true);
        }
      } catch (err) {
        // Error toast handled in the error useEffect
      } finally {
        fetchRef.current = false;
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [dispatch, hasFetched]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-right",
        duration: 4000,
        style: {
          background: "#fff",
          color: "#1F2937",
          border: "1px solid #DC2626",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#DC2626",
          secondary: "#fff",
        },
        className: "toast-slide-in",
      });
      dispatch({ type: "appointments/clearError" });
    }
  }, [error, dispatch]);

  const formatDate = (dateStr) => {
    return dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="max-w-6xl mx-auto mb-8 pt-[140px]">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-900">
        Scheduled Appointments
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7971E]"></div>
        </div>
      )}

      {!loading && confirmedAppointments.length === 0 && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No scheduled appointments found.</p>
        </div>
      )}

      {confirmedAppointments.map((appointment) => {
        if (!appointment.doctorId) {
          console.warn("Missing doctorId for appointment:", appointment._id);
        }
        return (
          <div
            key={appointment._id}
            className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-8"
          >
            <div className="bg-[#F7971E] px-4 sm:px-6 py-2">
              <h2 className="text-white text-base sm:text-lg font-medium">
                Scheduled Appointment
              </h2>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
              <div className="flex items-center justify-center md:col-span-1">
                <img
                  className="w-[230px] max-w-full max-h-48 sm:max-h-56 object-cover object-center"
                  src={
                    appointment.doctorId?.profilePic
                      ? `http://localhost:5000${appointment.doctorId.profilePic}`
                      : DocPlaceholder
                  }
                  alt={appointment.doctorId?.name || "Unknown Doctor"}
                  onError={(e) => {
                    console.error("Image load error for appointment:", {
                      appointmentId: appointment._id,
                      doctorId: appointment.doctorId?._id,
                      profilePic: appointment.doctorId?.profilePic,
                    });
                    e.target.src = DocPlaceholder;
                  }}
                />
              </div>
              <div className="md:col-span-2 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6">
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                        {appointment.doctorId?.name || "Unknown Doctor"}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <User className="w-3 h-3" />
                        <span className="font-medium text-xs sm:text-sm">
                          {appointment.doctorId?.specialty || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Award className="w-3 h-3" />
                        <span className="text-xs">
                          Experience: {appointment.doctorId?.experience || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Appointment Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase">
                              Date
                            </div>
                            <div className="font-medium text-gray-900 text-xs sm:text-sm">
                              {formatDate(appointment.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase">
                              Time
                            </div>
                            <div className="font-medium text-gray-900 text-xs sm:text-sm">
                              {formatTime(appointment.time)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:min-w-[180px] lg:min-w-[200px] md:pl-4 lg:pl-6 md:border-l border-gray-200">
                    <div className="text-left md:text-right mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Consultation Fee
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        ${appointment.fee || "N/A"}.00
                      </div>
                      <div className="text-xs text-gray-500">Per session</div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3" />
                        <span>Payment Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduledAppointments;
