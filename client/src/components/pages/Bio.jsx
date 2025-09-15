


  // import React, { useEffect, useState } from "react";
  // import { useSelector, useDispatch } from "react-redux";
  // import { Edit, User, Trash2, Calendar, Clock, CheckCircle } from "lucide-react";
  // import axiosInstance from "../../utils/axiosInstance";
  // import { setCredentials } from "../../redux/slices/authSlice";
  // import { fetchConfirmedAppointments, fetchConfirmedAppointmentsCount, clearError } from "../../redux/slices/appointmentSlice";
  // import toast from "react-hot-toast";
  // import ImageCropModal from "../../modal/ImageCropModal";
  // import BookingsModal from "../../modal/BookingsModal";
  // import DocPlaceholder from "../../assets/doc_placeholder.png";
  // import Lottie from "lottie-react";
  // import MedicineOnline from "../../assets/lottie/medicineonline.json";

  // const Bio = () => {
  //   const [isEditing, setIsEditing] = useState(false);
  //   const [formData, setFormData] = useState({ name: "", dob: "" });
  //   const [profilePic, setProfilePic] = useState(null);
  //   const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  //   const [selectedImage, setSelectedImage] = useState(null);
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const { user } = useSelector((state) => state.auth);
  //   const { confirmedAppointments, confirmedAppointmentsCount, loading, error } = useSelector((state) => state.appointments);
  //   const dispatch = useDispatch();

  //   useEffect(() => {
  //     if (user) {
  //       setFormData({
  //         name: user.name || "",
  //         dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
  //       });
  //       setProfilePic(
  //         user.profilePic ? `http://localhost:5000${user.profilePic}` : null
  //       );
  //       dispatch(fetchConfirmedAppointmentsCount());
  //       dispatch(fetchConfirmedAppointments());
  //     }
  //   }, [user, dispatch]);

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
  //       });
  //       dispatch(clearError());
  //     }
  //   }, [error, dispatch]);

  //   useEffect(() => {
  //     if (isModalOpen) {
  //       document.body.style.overflow = "hidden";
  //     } else {
  //       document.body.style.overflow = "";
  //     }
  //     return () => {
  //       document.body.style.overflow = "";
  //     };
  //   }, [isModalOpen]);

  //   const handleProfilePicChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const imageUrl = URL.createObjectURL(file);
  //       setSelectedImage(imageUrl);
  //       setIsCropModalOpen(true);
  //     }
  //   };

  //   const handleCropComplete = async (croppedImageBlob) => {
  //     if (croppedImageBlob) {
  //       const formData = new FormData();
  //       formData.append("profilePic", croppedImageBlob, "profile-pic.jpg");
  //       formData.append("name", user.name || "");
  //       formData.append(
  //         "dob",
  //         user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
  //       );
  //       try {
  //         const response = await axiosInstance.put("/users/me", formData, {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         });
  //         setProfilePic(`http://localhost:5000${response.data.user.profilePic}`);
  //         dispatch(
  //           setCredentials({
  //             user: response.data.user,
  //             token: localStorage.getItem("token"),
  //           })
  //         );
  //         toast.success("Profile picture updated successfully", {
  //           position: "bottom-right",
  //           style: {
  //             background: "#fff",
  //             color: "#1F2937",
  //             border: "1px solid #F7971E",
  //             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //             borderRadius: "8px",
  //             padding: "12px 16px",
  //             fontSize: "14px",
  //             fontWeight: "500",
  //           },
  //           iconTheme: {
  //             primary: "#F7971E",
  //             secondary: "#fff",
  //           },
  //         });
  //       } catch (error) {
  //         toast.error(
  //           error.response?.data?.error || "Failed to update profile picture",
  //           {
  //             position: "bottom-right",
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
  //           }
  //         );
  //         console.error("Profile Pic Update Error:", error);
  //       }
  //     }
  //     setIsCropModalOpen(false);
  //     setSelectedImage(null);
  //   };

  //   const handleRemoveProfilePic = async () => {
  //     try {
  //       const response = await axiosInstance.delete("/users/me/profile-pic");
  //       setProfilePic(null);
  //       dispatch(
  //         setCredentials({
  //           user: response.data.user,
  //           token: localStorage.getItem("token"),
  //         })
  //       );
  //       toast.success("Profile picture removed successfully", {
  //         position: "bottom-right",
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
  //       });
  //     } catch (error) {
  //       toast.error(
  //         error.response?.data?.error || "Failed to remove profile picture",
  //         {
  //           position: "bottom-right",
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
  //         }
  //       );
  //       console.error("Profile Pic Delete Error:", error);
  //     }
  //   };

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   };

  //   const handleSave = async () => {
  //     try {
  //       const response = await axiosInstance.put("/users/me", {
  //         name: formData.name,
  //         dob: formData.dob,
  //       });
  //       dispatch(
  //         setCredentials({
  //           user: response.data.user,
  //           token: localStorage.getItem("token"),
  //         })
  //       );
  //       setIsEditing(false);
  //       toast.success("Profile updated successfully", {
  //         position: "bottom-right",
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
  //       });
  //     } catch (error) {
  //       toast.error(error.response?.data?.error || "Failed to update profile", {
  //         position: "bottom-right",
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
  //       });
  //       console.error("Profile Update Error:", error);
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

  //   const hasDp = profilePic && profilePic.trim() !== "";

  //   return (
  //     <div className="pt-[190px] pb-[100px]">
  //       <div className="grid grid-cols-6 grid-rows-8 gap-4 mx-[250px]">
  //         <div className="col-span-3 row-span-4 flex items-center gap-[60px]">
  //           <div className="relative w-60 h-60">
  //             {hasDp ? (
  //               <img
  //                 src={profilePic}
  //                 alt="Profile"
  //                 className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow"
  //               />
  //             ) : (
  //               <div className="w-full h-full flex items-center justify-center rounded-full border-2 border-gray-300 shadow bg-gray-100">
  //                 <User size={64} className="text-gray-400" />
  //               </div>
  //             )}
  //             <div className="absolute bottom-2 right-2 flex gap-2">
  //               <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
  //                 <Edit size={18} className="text-gray-600" />
  //                 <input
  //                   type="file"
  //                   accept="image/*"
  //                   className="hidden"
  //                   onChange={handleProfilePicChange}
  //                 />
  //               </label>
  //               {hasDp && (
  //                 <button
  //                   className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100"
  //                   onClick={handleRemoveProfilePic}
  //                 >
  //                   <Trash2 size={18} className="text-gray-600" />
  //                 </button>
  //               )}
  //             </div>
  //           </div>
  //           <div>
  //             {isEditing ? (
  //               <div className="flex flex-col gap-2">
  //                 <input
  //                   type="text"
  //                   name="name"
  //                   value={formData.name}
  //                   onChange={handleInputChange}
  //                   className="text-2xl font-semibold border rounded p-1"
  //                 />
  //                 <p className="text-gray-600">{user.email}</p>
  //                 <input
  //                   type="date"
  //                   name="dob"
  //                   value={formData.dob}
  //                   onChange={handleInputChange}
  //                   className="text-gray-600 border rounded p-1"
  //                 />
  //                 <div className="flex gap-2">
  //                   <button
  //                     onClick={handleSave}
  //                     className="bg-[#F7971E] px-4 py-2 rounded cursor-pointer text-white"
  //                   >
  //                     Save
  //                   </button>
  //                   <button
  //                     onClick={() => setIsEditing(false)}
  //                     className="bg-gray-300 px-4 py-2 rounded cursor-pointer text-white"
  //                   >
  //                     Cancel
  //                   </button>
  //                 </div>
  //               </div>
  //             ) : (
  //               <div>
  //                 <h1 className="text-2xl font-semibold">
  //                   {user?.name || "Loading..."}
  //                 </h1>
  //                 <p className="text-gray-600">{user?.email || "Loading..."}</p>
  //                 <p className="text-gray-600">
  //                   Date of Birth:{" "}
  //                   {user?.dob
  //                     ? new Date(user.dob).toLocaleDateString()
  //                     : "Loading..."}
  //                 </p>
  //                 <button
  //                   onClick={() => setIsEditing(true)}
  //                   className="bg-[#F7971E] px-4 py-2 rounded cursor-pointer text-white mt-2"
  //                 >
  //                   Profile Edit
  //                 </button>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //         <div className="col-span-3 row-span-4 col-start-4 bg-gray-100 rounded-lg p-6 flex flex-col justify-center items-center">
  //           <h1 className="text-xl font-semibold mb-2">Total Bookings</h1>
  //           {loading ? (
  //             <p className="text-4xl font-bold text-blue-600">Loading...</p>
  //           ) : (
  //             <p className="text-4xl font-bold text-blue-600">{confirmedAppointmentsCount}</p>
  //           )}
  //         </div>
  //         <div className="col-span-6 row-span-4 row-start-5 bg-gray-100 rounded-lg p-4">
  //           <div className="flex items-center justify-between mb-4">
  //             <h1 className="text-xl font-semibold">Bookings</h1>
  //             {confirmedAppointments.length > 4 && (
  //               <button
  //                 onClick={() => setIsModalOpen(true)}
  //                 className="bg-[#F7971E] text-white px-4 py-2 rounded-lg hover:bg-[#FFB347] transition-colors duration-200"
  //               >
  //                 View More
  //               </button>
  //             )}
  //           </div>
  //           {loading ? (
  //             <div className="flex justify-center items-center h-32">
  //               <div className="relative">
  //                 <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-100 border-t-[#F7971E]"></div>
  //                 <div className="absolute inset-0 rounded-full bg-[#F7971E] opacity-10 animate-pulse"></div>
  //               </div>
  //             </div>
  //           ) : confirmedAppointments.length === 0 ? (
  //             <div className="bg-white rounded-lg border border-orange-100 p-6 text-center shadow-sm">
  //               <div className="flex justify-center mb-4">
  //                 <Lottie
  //                   animationData={MedicineOnline}
  //                   loop={true}
  //                   style={{ width: 200, height: 200 }}
  //                 />
  //               </div>
  //               <p className="text-gray-600 text-lg font-medium">
  //                 No confirmed bookings found
  //               </p>
  //             </div>
  //           ) : (
  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //               {confirmedAppointments.slice(0, 4).map((appointment, index) => (
  //                 <div
  //                   key={appointment._id}
  //                   className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
  //                   style={{
  //                     animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`,
  //                   }}
  //                 >
  //                   <div className="flex items-center gap-4">
  //                     <div className="relative flex-shrink-0">
  //                       <img
  //                         className="w-16 h-16 object-cover rounded-full border border-gray-300"
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
  //                       <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
  //                         <CheckCircle className="w-3 h-3 text-white" />
  //                       </div>
  //                     </div>
  //                     <div className="flex-grow">
  //                       <h3 className="text-base font-semibold text-gray-900">
  //                         {appointment.doctorId?.name || "Unknown Doctor"}
  //                       </h3>
  //                       <p className="text-sm text-gray-600">
  //                         {appointment.doctorId?.specialty || "N/A"}
  //                       </p>
  //                       <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
  //                         <div className="flex items-center gap-1">
  //                           <Calendar className="w-4 h-4" />
  //                           <span>{formatDate(appointment.date)}</span>
  //                         </div>
  //                         <div className="flex items-center gap-1">
  //                           <Clock className="w-4 h-4" />
  //                           <span>{formatTime(appointment.time)}</span>
  //                         </div>
  //                       </div>
  //                       <div className="mt-2 flex items-center justify-between">
  //                         <span className="text-sm font-semibold text-gray-900">
  //                           ${appointment.fee || "N/A"}.00
  //                         </span>
  //                         <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
  //                           Confirmed
  //                         </span>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //       <ImageCropModal
  //         isOpen={isCropModalOpen}
  //         image={selectedImage}
  //         onClose={() => {
  //           setIsCropModalOpen(false);
  //           setSelectedImage(null);
  //         }}
  //         onCropComplete={handleCropComplete}
  //       />
  //       <BookingsModal
  //         isOpen={isModalOpen}
  //         onClose={() => setIsModalOpen(false)}
  //         appointments={confirmedAppointments}
  //       />
  //       <style jsx>{`
  //         @keyframes fadeIn {
  //           from {
  //             opacity: 0;
  //             transform: translateY(10px);
  //           }
  //           to {
  //             opacity: 1;
  //             transform: translateY(0);
  //           }
  //         }
  //       `}</style>
  //     </div>
  //   );
  // };

  // export default Bio;


  import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Edit, User, Trash2, Calendar, Clock, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { setCredentials } from "../../redux/slices/authSlice";
import { fetchConfirmedAppointments, fetchConfirmedAppointmentsCount, clearError } from "../../redux/slices/appointmentSlice";
import toast from "react-hot-toast";
import ImageCropModal from "../../modal/ImageCropModal";
import BookingsModal from "../../modal/BookingsModal";
import DocPlaceholder from "../../assets/doc_placeholder.png";
import Lottie from "lottie-react";
import MedicineOnline from "../../assets/lottie/medicineonline.json";

const Bio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", dob: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { confirmedAppointments, confirmedAppointmentsCount, loading, error } = useSelector((state) => state.appointments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      });
      setProfilePic(
        user.profilePic ? `http://localhost:5000${user.profilePic}` : null
      );
      dispatch(fetchConfirmedAppointmentsCount());
      dispatch(fetchConfirmedAppointments());
    }
  }, [user, dispatch]);

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
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsCropModalOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob) => {
    if (croppedImageBlob) {
      const formData = new FormData();
      formData.append("profilePic", croppedImageBlob, "profile-pic.jpg");
      formData.append("name", user.name || "");
      formData.append(
        "dob",
        user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
      );
      try {
        const response = await axiosInstance.put("/users/me", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProfilePic(`http://localhost:5000${response.data.user.profilePic}`);
        dispatch(
          setCredentials({
            user: response.data.user,
            token: localStorage.getItem("token"),
          })
        );
        toast.success("Profile picture updated successfully", {
          position: "bottom-right",
          style: {
            background: "#fff",
            color: "#1F2937",
            border: "1px solid #F6981F",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          iconTheme: {
            primary: "#F6981F",
            secondary: "#fff",
          },
        });
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to update profile picture",
          {
            position: "bottom-right",
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
          }
        );
        console.error("Profile Pic Update Error:", error);
      }
    }
    setIsCropModalOpen(false);
    setSelectedImage(null);
  };

  const handleRemoveProfilePic = async () => {
    try {
      const response = await axiosInstance.delete("/users/me/profile-pic");
      setProfilePic(null);
      dispatch(
        setCredentials({
          user: response.data.user,
          token: localStorage.getItem("token"),
        })
      );
      toast.success("Profile picture removed successfully", {
        position: "bottom-right",
        style: {
          background: "#fff",
          color: "#1F2937",
          border: "1px solid #F6981F",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#F6981F",
          secondary: "#fff",
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to remove profile picture",
        {
          position: "bottom-right",
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
        }
      );
      console.error("Profile Pic Delete Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put("/users/me", {
        name: formData.name,
        dob: formData.dob,
      });
      dispatch(
        setCredentials({
          user: response.data.user,
          token: localStorage.getItem("token"),
        })
      );
      setIsEditing(false);
      toast.success("Profile updated successfully", {
        position: "bottom-right",
        style: {
          background: "#fff",
          color: "#1F2937",
          border: "1px solid #F6981F",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#F6981F",
          secondary: "#fff",
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile", {
        position: "bottom-right",
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
      });
      console.error("Profile Update Error:", error);
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

  const hasDp = profilePic && profilePic.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-[190px] pb-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative group">
                <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                  {hasDp ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl group-hover:shadow-orange-200 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-full border-4 border-gray-200 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-orange-200 transition-all duration-300">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <label className="cursor-pointer bg-[#F6981F] text-white p-3 rounded-full shadow-lg hover:bg-[#e8860b] hover:scale-110 transition-all duration-200">
                      <Edit size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicChange}
                      />
                    </label>
                    {hasDp && (
                      <button
                        className="cursor-pointer bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
                        onClick={handleRemoveProfilePic}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full text-xl font-semibold border-2 border-gray-200 rounded-xl p-3 focus:border-[#F6981F] focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                        placeholder="Enter your name"
                      />
                    </div>
                    <p className="text-gray-600 text-lg">{user.email}</p>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#F6981F] focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                      />
                    </div>
                    <div className="flex gap-3 justify-center lg:justify-start pt-4">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-[#F6981F] to-[#e8860b] hover:from-[#e8860b] hover:to-[#d67b0a] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user?.name || "Loading..."}
                      </h1>
                      <p className="text-gray-600 text-lg font-medium">
                        {user?.email || "Loading..."}
                      </p>
                      <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">
                          Born: {user?.dob ? new Date(user.dob).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : "Not specified"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-[#F6981F] to-[#e8860b] hover:from-[#e8860b] hover:to-[#d67b0a] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-gradient-to-br from-[#F6981F] to-[#e8860b] rounded-2xl shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Total Bookings</h2>
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-white border-t-transparent"></div>
                </div>
              ) : (
                <p className="text-5xl font-bold mb-2">{confirmedAppointmentsCount}</p>
              )}
              <p className="text-white/80 text-lg">Confirmed Appointments</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Bookings</h2>
              <p className="text-gray-600">Your latest confirmed appointments</p>
            </div>
            {confirmedAppointments.length > 4 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#F6981F] to-[#e8860b] hover:from-[#e8860b] hover:to-[#d67b0a] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                View All Bookings
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-[#F6981F]"></div>
                <div className="absolute inset-0 rounded-full bg-[#F6981F] opacity-10 animate-pulse"></div>
              </div>
            </div>
          ) : confirmedAppointments.length === 0 ? (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border-2 border-dashed border-orange-200 p-12 text-center">
              <div className="flex justify-center mb-6">
                <Lottie
                  animationData={MedicineOnline}
                  loop={true}
                  style={{ width: 200, height: 200 }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Confirmed Bookings
              </h3>
              <p className="text-gray-600">
                Your confirmed appointments will appear here once you book them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {confirmedAppointments.slice(0, 4).map((appointment, index) => (
                <div
                  key={appointment._id}
                  className="bg-gradient-to-r from-white to-orange-50/30 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${index * 150}ms forwards`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        className="w-16 h-16 object-cover rounded-full border-3 border-white shadow-lg group-hover:shadow-orange-200 transition-all duration-300"
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
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {appointment.doctorId?.name || "Unknown Doctor"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 font-medium">
                        {appointment.doctorId?.specialty || "N/A"}
                      </p>
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 text-[#F6981F]" />
                          <span className="font-medium">{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-[#F6981F]" />
                          <span className="font-medium">{formatTime(appointment.time)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${appointment.fee || "N/A"}.00
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
                          ✓ Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ImageCropModal
        isOpen={isCropModalOpen}
        image={selectedImage}
        onClose={() => {
          setIsCropModalOpen(false);
          setSelectedImage(null);
        }}
        onCropComplete={handleCropComplete}
      />
      <BookingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointments={confirmedAppointments}
      />
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Bio;