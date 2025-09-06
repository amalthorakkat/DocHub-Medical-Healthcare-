// import React, { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchPendingAppointments,
//   deleteAppointment,
//   confirmAppointment,
//   fetchConfirmedAppointments,
// } from "../../redux/slices/appointmentSlice";
// import { Calendar, Clock, User, Award, CreditCard, X } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { loadStripe } from "@stripe/stripe-js";
// import axiosInstance from "../../utils/axiosInstance";
// import ScheduledAppointments from "./ScheduledAppointments";
// import DocPlaceholder from "../../assets/doc_placeholder.png";
// import Lottie from "lottie-react";
// import DoctorAnimation from "../../assets/lottie/Doctor.json";

// // Replace with your Stripe test public key from Stripe Dashboard
// const stripePromise = loadStripe(
//   "pk_test_51S3JakIpWotxN01OqBKsywesGuzSCCxRJxYLV6a8Tvh1guvUN4OhBTKge137tQkCXIJfF92PKDDqUjpmdyrc0HHI000mKpFMeW"
// );

// const Appointments = () => {
//   const dispatch = useDispatch();
//   const { pendingAppointments, confirmedAppointments, loading, error } =
//     useSelector((state) => state.appointments);
//   const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
//   const [appointmentToRemove, setAppointmentToRemove] = useState(null);
//   const [processedSessions, setProcessedSessions] = useState(new Set());
//   const [hasFetched, setHasFetched] = useState(false); // Flag to prevent duplicate toasts
//   const fetchRef = useRef(false); // Ref to track fetch status

//   useEffect(() => {
//     let isMounted = true;

//     const fetchAppointments = async () => {
//       if (fetchRef.current) return; // Prevent duplicate fetches
//       fetchRef.current = true;

//       try {
//         await Promise.all([
//           dispatch(fetchPendingAppointments()).unwrap(),
//           dispatch(fetchConfirmedAppointments()).unwrap(),
//         ]);
//         if (isMounted && !hasFetched) {
//           toast.success("Appointments loaded successfully", {
//             position: "bottom-right",
//             duration: 3000,
//             style: {
//               background: "#fff",
//               color: "#1F2937",
//               border: "1px solid #F7971E",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               borderRadius: "8px",
//               padding: "12px 16px",
//               fontSize: "14px",
//               fontWeight: "500",
//             },
//             iconTheme: {
//               primary: "#F7971E",
//               secondary: "#fff",
//             },
//             className: "toast-slide-in",
//           });
//           setHasFetched(true);
//         }
//       } catch (err) {
//         // Error toast handled in the error useEffect
//       } finally {
//         fetchRef.current = false;
//       }
//     };

//     fetchAppointments();

//     return () => {
//       isMounted = false;
//     };
//   }, [dispatch, hasFetched]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error, {
//         position: "bottom-right",
//         duration: 4000,
//         style: {
//           background: "#fff",
//           color: "#1F2937",
//           border: "1px solid #DC2626",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//           padding: "12px 16px",
//           fontSize: "14px",
//           fontWeight: "500",
//         },
//         iconTheme: {
//           primary: "#DC2626",
//           secondary: "#fff",
//         },
//         className: "toast-slide-in",
//       });
//       dispatch({ type: "appointments/clearError" });
//     }
//   }, [error, dispatch]);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const sessionId = urlParams.get("session_id");
//     const appointmentId = urlParams.get("appointment_id");
//     if (sessionId && appointmentId && !processedSessions.has(sessionId)) {
//       dispatch(confirmAppointment(appointmentId))
//         .unwrap()
//         .then(() => {
//           toast.success("Payment successful! Appointment confirmed.", {
//             position: "bottom-right",
//             duration: 4000,
//             style: {
//               background: "#fff",
//               color: "#1F2937",
//               border: "1px solid #F7971E",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               borderRadius: "8px",
//               padding: "12px 16px",
//               fontSize: "14px",
//               fontWeight: "500",
//             },
//             iconTheme: {
//               primary: "#F7971E",
//               secondary: "#fff",
//             },
//             className: "toast-slide-in",
//           });
//           setProcessedSessions((prev) => new Set(prev).add(sessionId));
//           setHasFetched(false); // Allow new toast on refresh
//           Promise.all([
//             dispatch(fetchPendingAppointments()).unwrap(),
//             dispatch(fetchConfirmedAppointments()).unwrap(),
//           ]).catch((err) => {
//             toast.error(err || "Failed to refresh appointments", {
//               position: "bottom-right",
//               duration: 4000,
//               style: {
//                 background: "#fff",
//                 color: "#1F2937",
//                 border: "1px solid #DC2626",
//                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "12px 16px",
//                 fontSize: "14px",
//                 fontWeight: "500",
//               },
//               iconTheme: {
//                 primary: "#DC2626",
//                 secondary: "#fff",
//               },
//               className: "toast-slide-in",
//             });
//           });
//         })
//         .catch((err) => {
//           toast.error(err || "Failed to confirm appointment", {
//             position: "bottom-right",
//             duration: 4000,
//             style: {
//               background: "#fff",
//               color: "#1F2937",
//               border: "1px solid #DC2626",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               borderRadius: "8px",
//               padding: "12px 16px",
//               fontSize: "14px",
//               fontWeight: "500",
//             },
//             iconTheme: {
//               primary: "#DC2626",
//               secondary: "#fff",
//             },
//             className: "toast-slide-in",
//           });
//         });
//     }
//   }, [dispatch, processedSessions]);

//   const handleRemoveAppointment = (id) => {
//     setAppointmentToRemove(id);
//     setIsRemoveModalOpen(true);
//   };

//   const confirmRemoveAppointment = async () => {
//     try {
//       await dispatch(deleteAppointment(appointmentToRemove)).unwrap();
//       toast.success("Appointment removed successfully", {
//         position: "bottom-right",
//         duration: 3000,
//         style: {
//           background: "#fff",
//           color: "#1F2937",
//           border: "1px solid #F7971E",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//           padding: "12px 16px",
//           fontSize: "14px",
//           fontWeight: "500",
//         },
//         iconTheme: {
//           primary: "#F7971E",
//           secondary: "#fff",
//         },
//         className: "toast-slide-in",
//       });
//       setIsRemoveModalOpen(false);
//       setAppointmentToRemove(null);
//       setHasFetched(false); // Allow new toast on refresh
//     } catch (err) {
//       toast.error(err || "Failed to remove appointment", {
//         position: "bottom-right",
//         duration: 4000,
//         style: {
//           background: "#fff",
//           color: "#1F2937",
//           border: "1px solid #DC2626",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//           padding: "12px 16px",
//           fontSize: "14px",
//           fontWeight: "500",
//         },
//         iconTheme: {
//           primary: "#DC2626",
//           secondary: "#fff",
//         },
//         className: "toast-slide-in",
//       });
//       setIsRemoveModalOpen(false);
//       setAppointmentToRemove(null);
//     }
//   };

//   const closeRemoveModal = () => {
//     setIsRemoveModalOpen(false);
//     setAppointmentToRemove(null);
//   };

//   const handlePayNow = async (appointment) => {
//     try {
//       console.log("Initiating payment for appointment:", appointment._id);
//       const response = await axiosInstance.post(
//         "/appointments/create-checkout-session",
//         {
//           appointmentId: appointment._id,
//         }
//       );
//       console.log("Checkout session response:", response.data);
//       const { sessionId } = response.data;
//       const stripe = await stripePromise;
//       const { error } = await stripe.redirectToCheckout({
//         sessionId,
//       });
//       if (error) {
//         console.error("Stripe redirect error:", error);
//         toast.error(error.message || "Failed to initiate payment", {
//           position: "bottom-right",
//           duration: 4000,
//           style: {
//             background: "#fff",
//             color: "#1F2937",
//             border: "1px solid #DC2626",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             borderRadius: "8px",
//             padding: "12px 16px",
//             fontSize: "14px",
//             fontWeight: "500",
//           },
//           iconTheme: {
//             primary: "#DC2626",
//             secondary: "#fff",
//           },
//           className: "toast-slide-in",
//         });
//       }
//     } catch (error) {
//       console.error(
//         "Payment initiation error:",
//         error.response?.data || error.message
//       );
//       toast.error(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to initiate payment",
//         {
//           position: "bottom-right",
//           duration: 4000,
//           style: {
//             background: "#fff",
//             color: "#1F2937",
//             border: "1px solid #DC2626",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             borderRadius: "8px",
//             padding: "12px 16px",
//             fontSize: "14px",
//             fontWeight: "500",
//           },
//           iconTheme: {
//             primary: "#DC2626",
//             secondary: "#fff",
//           },
//           className: "toast-slide-in",
//         }
//       );
//     }
//   };

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
//     <div className="pt-16 md:pt-24 lg:pt-[140px] px-4 sm:px-6 lg:px-[70px] bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-900">
//           My Appointments
//         </h1>

//         {loading && (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7971E]"></div>
//           </div>
//         )}

//         {!loading && pendingAppointments.length === 0 && (
//           <div className="bg-white rounded-lg p-6 text-center">
//             <div className="flex justify-center">
//               <Lottie
//                 animationData={DoctorAnimation}
//                 loop={true}
//                 style={{ width: 300, height: 300 }}
//               />
//             </div>
//             <p className="text-gray-600 text-lg font-medium mt-4">
//               No pending appointments added
//             </p>
//           </div>
//         )}

//         {!loading && pendingAppointments.length > 0 && (
//           <>
//             <div className="bg-[#F7971E] px-4 sm:px-6 py-2 mb-6 rounded-lg">
//               <h2 className="text-white text-base sm:text-lg font-medium">
//                 Pending Appointments
//               </h2>
//             </div>
//             {pendingAppointments.map((appointment) => {
//               if (!appointment.doctorId) {
//                 console.warn("Missing doctorId for appointment:", appointment._id);
//               }
//               return (
//                 <div
//                   key={appointment._id}
//                   className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-8"
//                 >
//                   <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
//                     <div className="flex items-center justify-center md:col-span-1">
//                       <img
//                         className="w-[230px] max-w-full max-h-48 sm:max-h-56 object-cover object-center"
//                         src={
//                           appointment.doctorId?.profilePic
//                             ? `http://localhost:5000${appointment.doctorId.profilePic}`
//                             : DocPlaceholder
//                         }
//                         alt={appointment.doctorId?.name || "Unknown Doctor"}
//                         onError={(e) => {
//                           console.error("Image load error for appointment:", {
//                             appointmentId: appointment._id,
//                             doctorId: appointment.doctorId?._id,
//                             profilePic: appointment.doctorId?.profilePic,
//                           });
//                           e.target.src = DocPlaceholder;
//                         }}
//                       />
//                     </div>
//                     <div className="md:col-span-2 p-3 sm:p-4 md:p-6">
//                       <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6">
//                         <div className="flex-1 space-y-2">
//                           <div>
//                             <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
//                               {appointment.doctorId?.name || "Unknown Doctor"}
//                             </h3>
//                             <div className="flex items-center space-x-2 text-gray-600 mb-1">
//                               <User className="w-3 h-3" />
//                               <span className="font-medium text-xs sm:text-sm">
//                                 {appointment.doctorId?.specialty || "N/A"}
//                               </span>
//                             </div>
//                             <div className="flex items-center space-x-2 text-gray-500">
//                               <Award className="w-3 h-3" />
//                               <span className="text-xs">
//                                 Experience:{" "}
//                                 {appointment.doctorId?.experience || "N/A"}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="border-t border-gray-200 pt-2">
//                             <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
//                               Appointment Details
//                             </h4>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                               <div className="flex items-center space-x-2">
//                                 <Calendar className="w-3 h-3 text-gray-400" />
//                                 <div>
//                                   <div className="text-xs text-gray-500 uppercase">
//                                     Date
//                                   </div>
//                                   <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                                     {formatDate(appointment.date)}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <Clock className="w-3 h-3 text-gray-400" />
//                                 <div>
//                                   <div className="text-xs text-gray-500 uppercase">
//                                     Time
//                                   </div>
//                                   <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                                     {formatTime(appointment.time)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="md:min-w-[180px] lg:min-w-[200px] md:pl-4 lg:pl-6 md:border-l border-gray-200">
//                           <div className="text-left md:text-right mb-4">
//                             <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//                               Consultation Fee
//                             </div>
//                             <div className="text-xl sm:text-2xl font-bold text-gray-900">
//                               ${appointment.fee || "N/A"}.00
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Per session
//                             </div>
//                           </div>
//                           <div className="space-y-2">
//                             <button
//                               onClick={() => handlePayNow(appointment)}
//                               className="w-full bg-[#F7971E] hover:bg-[#e08a1b] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm text-xs sm:text-sm"
//                             >
//                               <CreditCard className="w-3 h-3" />
//                               <span>Pay Now</span>
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleRemoveAppointment(appointment._id)
//                               }
//                               className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm"
//                             >
//                               <X className="w-3 h-3" />
//                               <span>Remove Appointment</span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}

//         {isRemoveModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Confirm Appointment Removal
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to remove this appointment? This action
//                 cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={closeRemoveModal}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmRemoveAppointment}
//                   className="px-4 py-2 bg-[#F7971E] text-white rounded-md hover:bg-[#e08a1b] transition-colors duration-200 font-medium"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <ScheduledAppointments />
//       </div>
//     </div>
//   );
// };

// export default Appointments;

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPendingAppointments,
  deleteAppointment,
  confirmAppointment,
  fetchConfirmedAppointments,
} from "../../redux/slices/appointmentSlice";
import {
  Calendar,
  Clock,
  User,
  Award,
  CreditCard,
  X,
  Stethoscope,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../utils/axiosInstance";
import ScheduledAppointments from "./ScheduledAppointments";
import DocPlaceholder from "../../assets/doc_placeholder.png";
import Lottie from "lottie-react";
import DoctorAnimation from "../../assets/lottie/Doctor.json";

// Replace with your Stripe test public key from Stripe Dashboard
const stripePromise = loadStripe(
  "pk_test_51S3JakIpWotxN01OqBKsywesGuzSCCxRJxYLV6a8Tvh1guvUN4OhBTKge137tQkCXIJfF92PKDDqUjpmdyrc0HHI000mKpFMeW"
);

const Appointments = () => {
  const dispatch = useDispatch();
  const { pendingAppointments, confirmedAppointments, loading, error } =
    useSelector((state) => state.appointments);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [appointmentToRemove, setAppointmentToRemove] = useState(null);
  const [processedSessions, setProcessedSessions] = useState(new Set());
  const [hasFetched, setHasFetched] = useState(false);
  const fetchRef = useRef(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isRemoveModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup to restore overflow on component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRemoveModalOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      if (fetchRef.current) return;
      fetchRef.current = true;

      try {
        await Promise.all([
          dispatch(fetchPendingAppointments()).unwrap(),
          dispatch(fetchConfirmedAppointments()).unwrap(),
        ]);
        if (isMounted && !hasFetched) {
          toast.success("Appointments loaded successfully", {
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const appointmentId = urlParams.get("appointment_id");

    if (sessionId && appointmentId && !processedSessions.has(sessionId)) {
      // Check if appointment is in pendingAppointments
      const isPending = pendingAppointments.some(
        (appt) => appt._id === appointmentId && appt.status === "pending"
      );

      if (!isPending) {
        toast.error(
          "This appointment has already been processed or is invalid",
          {
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
          }
        );
        // Clear URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        setProcessedSessions((prev) => new Set(prev).add(sessionId));
        return;
      }

      dispatch(confirmAppointment(appointmentId))
        .unwrap()
        .then(() => {
          toast.success("Payment successful! Appointment confirmed.", {
            position: "bottom-right",
            duration: 4000,
            style: {
              background: "#fff",
              color: "#1F2937",
              border: "1px solid #F7971E",
              boxShadow: "0 4px 6px rgba(0, 0, 0 Biol.1)",
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
          setProcessedSessions((prev) => new Set(prev).add(sessionId));
          setHasFetched(false);
          // Clear URL parameters
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          Promise.all([
            dispatch(fetchPendingAppointments()).unwrap(),
            dispatch(fetchConfirmedAppointments()).unwrap(),
          ]).catch((err) => {
            toast.error(err || "Failed to refresh appointments", {
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
          });
        })
        .catch((err) => {
          toast.error(
            err === "Appointment is not in pending status"
              ? "This appointment has already been processed or is invalid"
              : err || "Failed to confirm appointment",
            {
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
            }
          );
          // Clear URL parameters even on error to prevent re-attempts
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        });
    }
  }, [dispatch, processedSessions, pendingAppointments]);

  const handleRemoveAppointment = (id) => {
    setAppointmentToRemove(id);
    setIsRemoveModalOpen(true);
  };

  const confirmRemoveAppointment = async () => {
    try {
      await dispatch(deleteAppointment(appointmentToRemove)).unwrap();
      toast.success("Appointment removed successfully", {
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
      setIsRemoveModalOpen(false);
      setAppointmentToRemove(null);
      setHasFetched(false);
    } catch (err) {
      toast.error(err || "Failed to remove appointment", {
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
      setIsRemoveModalOpen(false);
      setAppointmentToRemove(null);
    }
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setAppointmentToRemove(null);
  };

  const handlePayNow = async (appointment) => {
    try {
      console.log("Initiating payment for appointment:", appointment._id);
      const response = await axiosInstance.post(
        "/appointments/create-checkout-session",
        {
          appointmentId: appointment._id,
        }
      );
      console.log("Checkout session response:", response.data);
      const { sessionId } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });
      if (error) {
        console.error("Stripe redirect error:", error);
        toast.error(error.message || "Failed to initiate payment", {
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
      }
    } catch (error) {
      console.error(
        "Payment initiation error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to initiate payment",
        {
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
        }
      );
    }
  };

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
    <div className="pt-[140px] md:pt-24 lg:pt-[140px] px-4 sm:px-6 lg:px-[70px] bg-gradient-to-br from-orange-50 via-white to-orange-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#F7971E] to-[#FFB347] rounded-2xl shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                My Appointments
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your healthcare appointments
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-lg border border-orange-100">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-[#F7971E]"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F7971E] to-transparent opacity-20 animate-pulse"></div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading appointments...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && pendingAppointments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Lottie
                  animationData={DoctorAnimation}
                  loop={true}
                  style={{ width: 300, height: 300 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Pending Appointments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                You don't have any pending appointments at the moment. Book an
                appointment with your preferred doctor to get started.
              </p>
            </div>
          </div>
        )}

        {/* Pending Appointments */}
        {!loading && pendingAppointments.length > 0 && (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="relative">
              <div className="bg-gradient-to-r from-[#F7971E] to-[#FFB347] px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-white" />
                    <h2 className="text-white text-lg font-semibold">
                      Pending Appointments
                    </h2>
                  </div>
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <span className="text-gray-500 text-sm font-medium">
                      {pendingAppointments.length} pending
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7971E] to-[#FFB347] rounded-2xl blur-sm opacity-30 -z-10"></div>
            </div>

            {/* Appointment Cards */}
            <div className="grid gap-6">
              {pendingAppointments.map((appointment, index) => {
                if (!appointment.doctorId) {
                  console.warn(
                    "Missing doctorId for appointment:",
                    appointment._id
                  );
                }
                return (
                  <div
                    key={appointment._id}
                    className="group bg-white border border-orange-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
                      {/* Doctor Image */}
                      <div className="flex items-center justify-center md:col-span-1 p-6 bg-gradient-to-br from-orange-50 to-orange-100">
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                          <img
                            className="w-[240px] h-[240px] object-cover rounded-2xl shadow-lg border-4 border-white"
                            src={
                              appointment.doctorId?.profilePic
                                ? `http://localhost:5000${appointment.doctorId.profilePic}`
                                : DocPlaceholder
                            }
                            alt={appointment.doctorId?.name || "Unknown Doctor"}
                            onError={(e) => {
                              console.error(
                                "Image load error for appointment:",
                                {
                                  appointmentId: appointment._id,
                                  doctorId: appointment.doctorId?._id,
                                  profilePic: appointment.doctorId?.profilePic,
                                }
                              );
                              e.target.src = DocPlaceholder;
                            }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2 p-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                          {/* Doctor Info & Appointment Details */}
                          <div className="flex-1 space-y-4">
                            {/* Doctor Info */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#F7971E] transition-colors duration-300">
                                  Dr.{" "}
                                  {appointment.doctorId?.name ||
                                    "Unknown Doctor"}
                                </h3>
                                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                  <div className="p-1 bg-orange-100 rounded-lg">
                                    <User className="w-4 h-4 text-[#F7971E]" />
                                  </div>
                                  <span className="font-semibold text-sm">
                                    {appointment.doctorId?.specialty ||
                                      "General Practice"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <div className="p-1 bg-orange-100 rounded-lg">
                                    <Award className="w-4 h-4 text-[#F7971E]" />
                                  </div>
                                  <span className="text-sm">
                                    {appointment.doctorId?.experience || "5+"}{" "}
                                    years experience
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="bg-gradient-to-r from-orange-50 to-transparent p-4 rounded-xl border-l-4 border-[#F7971E]">
                              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-[#F7971E]" />
                                <span>Appointment Details</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Calendar className="w-4 h-4 text-[#F7971E]" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">
                                      Date
                                    </div>
                                    <div className="font-bold text-gray-900">
                                      {formatDate(appointment.date)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Clock className="w-4 h-4 text-[#F7971E]" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">
                                      Time
                                    </div>
                                    <div className="font-bold text-gray-900">
                                      {formatTime(appointment.time)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment Section */}
                          <div className="lg:min-w-[220px] lg:pl-6 lg:border-l border-gray-200">
                            <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                              <div className="text-center mb-6">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                                  Consultation Fee
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                  ${appointment.fee || "50"}.00
                                </div>
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                  Per session
                                </div>
                              </div>
                              <div className="space-y-3">
                                <button
                                  onClick={() => handlePayNow(appointment)}
                                  className="w-full bg-gradient-to-r from-[#F7971E] to-[#FFB347] hover:from-[#e08a1b] hover:to-[#F7971E] text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  <span>Pay Now</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveAppointment(appointment._id)
                                  }
                                  className="w-full border-2 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Remove</span>
                                </button>
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
          </div>
        )}

        {/* Enhanced Remove Modal */}
        {isRemoveModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Confirm Removal
                  </h3>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Are you sure you want to remove this appointment? This action
                  cannot be undone and you'll need to reschedule if you change
                  your mind.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeRemoveModal}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRemoveAppointment}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ScheduledAppointments />
      </div>
    </div>
  );
};

export default Appointments;
