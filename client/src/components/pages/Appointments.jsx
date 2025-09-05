// import React, { useEffect, useState } from "react";
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

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         await Promise.all([
//           dispatch(fetchPendingAppointments()).unwrap(),
//           dispatch(fetchConfirmedAppointments()).unwrap(),
//         ]);
//         toast.success("Appointments loaded successfully", {
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
//           });
//           setProcessedSessions((prev) => new Set(prev).add(sessionId));
//           Promise.all([
//             dispatch(fetchPendingAppointments()).unwrap(),
//             dispatch(fetchConfirmedAppointments()).unwrap(),
//           ]).catch((err) => {
//             toast.error(err || "Failed to refresh appointments", {
//               position: "bottom-right",
//               duration: 4000,
//             });
//           });
//         })
//         .catch((err) => {
//           toast.error(err || "Failed to confirm appointment", {
//             position: "bottom-right",
//             duration: 4000,
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
//       });
//       setIsRemoveModalOpen(false);
//       setAppointmentToRemove(null);
//     } catch (err) {
//       toast.error(err || "Failed to remove appointment", {
//         position: "bottom-right",
//         duration: 4000,
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
//           <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 text-center">
//             <p className="text-gray-600">No pending appointments found.</p>
//           </div>
//         )}

//         {pendingAppointments.map((appointment) => (
//           <div
//             key={appointment._id}
//             className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-8"
//           >
//             <div className="bg-[#F7971E] px-4 sm:px-6 py-2">
//               <h2 className="text-white text-base sm:text-lg font-medium">
//                 Pending Appointment
//               </h2>
//             </div>
//             <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
//               <div className="flex items-center justify-center md:col-span-1">
//                 <img
//                   className="w-[230px] max-w-full max-h-48 sm:max-h-56 object-cover object-center"
//                   src={
//                     appointment.doctorId?.profilePic
//                       ? `http://localhost:5000${appointment.doctorId.profilePic}`
//                       : `https://via.placeholder.com/150?text=${
//                           appointment.doctorId?.name?.charAt(0) || "?"
//                         }`
//                   }
//                   alt={appointment.doctorId?.name || "Unknown Doctor"}
//                 />
//               </div>
//               <div className="md:col-span-2 p-3 sm:p-4 md:p-6">
//                 <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6">
//                   <div className="flex-1 space-y-2">
//                     <div>
//                       <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
//                         {appointment.doctorId?.name || "Unknown Doctor"}
//                       </h3>
//                       <div className="flex items-center space-x-2 text-gray-600 mb-1">
//                         <User className="w-3 h-3" />
//                         <span className="font-medium text-xs sm:text-sm">
//                           {appointment.doctorId?.specialty || "N/A"}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-2 text-gray-500">
//                         <Award className="w-3 h-3" />
//                         <span className="text-xs">
//                           Experience:{" "}
//                           {appointment.doctorId?.experience || "N/A"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="border-t border-gray-200 pt-2">
//                       <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
//                         Appointment Details
//                       </h4>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-3 h-3 text-gray-400" />
//                           <div>
//                             <div className="text-xs text-gray-500 uppercase">
//                               Date
//                             </div>
//                             <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                               {formatDate(appointment.date)}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Clock className="w-3 h-3 text-gray-400" />
//                           <div>
//                             <div className="text-xs text-gray-500 uppercase">
//                               Time
//                             </div>
//                             <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                               {formatTime(appointment.time)}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="md:min-w-[180px] lg:min-w-[200px] md:pl-4 lg:pl-6 md:border-l border-gray-200">
//                     <div className="text-left md:text-right mb-4">
//                       <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
//                         Consultation Fee
//                       </div>
//                       <div className="text-xl sm:text-2xl font-bold text-gray-900">
//                         ${appointment.fee || "N/A"}.00
//                       </div>
//                       <div className="text-xs text-gray-500">Per session</div>
//                     </div>
//                     <div className="space-y-2">
//                       <button
//                         onClick={() => handlePayNow(appointment)}
//                         className="w-full bg-[#F7971E] hover:bg-[#e08a1b] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm text-xs sm:text-sm"
//                       >
//                         <CreditCard className="w-3 h-3" />
//                         <span>Pay Now</span>
//                       </button>
//                       <button
//                         onClick={() => handleRemoveAppointment(appointment._id)}
//                         className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm"
//                       >
//                         <X className="w-3 h-3" />
//                         <span>Remove Appointment</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

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
import { Calendar, Clock, User, Award, CreditCard, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../utils/axiosInstance";
import ScheduledAppointments from "./ScheduledAppointments";
import DocPlaceholder from "../../assets/doc_placeholder.png";

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
  const [hasFetched, setHasFetched] = useState(false); // Flag to prevent duplicate toasts
  const fetchRef = useRef(false); // Ref to track fetch status

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      if (fetchRef.current) return; // Prevent duplicate fetches
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
      });
      dispatch({ type: "appointments/clearError" });
    }
  }, [error, dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const appointmentId = urlParams.get("appointment_id");
    if (sessionId && appointmentId && !processedSessions.has(sessionId)) {
      dispatch(confirmAppointment(appointmentId))
        .unwrap()
        .then(() => {
          toast.success("Payment successful! Appointment confirmed.", {
            position: "bottom-right",
            duration: 4000,
          });
          setProcessedSessions((prev) => new Set(prev).add(sessionId));
          setHasFetched(false); // Allow new toast on refresh
          Promise.all([
            dispatch(fetchPendingAppointments()).unwrap(),
            dispatch(fetchConfirmedAppointments()).unwrap(),
          ]).catch((err) => {
            toast.error(err || "Failed to refresh appointments", {
              position: "bottom-right",
              duration: 4000,
            });
          });
        })
        .catch((err) => {
          toast.error(err || "Failed to confirm appointment", {
            position: "bottom-right",
            duration: 4000,
          });
        });
    }
  }, [dispatch, processedSessions]);

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
      });
      setIsRemoveModalOpen(false);
      setAppointmentToRemove(null);
      setHasFetched(false); // Allow new toast on refresh
    } catch (err) {
      toast.error(err || "Failed to remove appointment", {
        position: "bottom-right",
        duration: 4000,
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
    <div className="pt-16 md:pt-24 lg:pt-[140px] px-4 sm:px-6 lg:px-[70px] bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-900">
          My Appointments
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7971E]"></div>
          </div>
        )}

        {!loading && pendingAppointments.length === 0 && (
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No pending appointments found.</p>
          </div>
        )}

        {pendingAppointments.map((appointment) => {
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
                  Pending Appointment
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
                            Experience:{" "}
                            {appointment.doctorId?.experience || "N/A"}
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
                        <button
                          onClick={() => handlePayNow(appointment)}
                          className="w-full bg-[#F7971E] hover:bg-[#e08a1b] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm text-xs sm:text-sm"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Now</span>
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveAppointment(appointment._id)
                          }
                          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-xs sm:text-sm"
                        >
                          <X className="w-3 h-3" />
                          <span>Remove Appointment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isRemoveModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Appointment Removal
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this appointment? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRemoveModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveAppointment}
                  className="px-4 py-2 bg-[#F7971E] text-white rounded-md hover:bg-[#e08a1b] transition-colors duration-200 font-medium"
                >
                  Confirm
                </button>
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
