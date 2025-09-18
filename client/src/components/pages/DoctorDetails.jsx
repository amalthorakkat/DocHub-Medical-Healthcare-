import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAppointment } from "../../redux/slices/appointmentSlice";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Info,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import RelatedDoctors from "./RelatedDoctors";
import FadeContent from "../../animations/FadeContent";
import Transition from "../../animations/Transition";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log("Fetching doctor with ID:", id);
        const response = await axiosInstance.get(`/users/doctor/${id}`);
        console.log("Doctor fetched:", response.data.doctor);
        setDoctor(response.data.doctor);
      } catch (err) {
        console.error("Fetch doctor error:", err.response?.data || err.message);
        toast.error(
          err.response?.data?.error || "Failed to fetch doctor details",
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
        if (err.response?.status === 404) {
          navigate("/doctors");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  useEffect(() => {
    const fetchRelatedDoctors = async () => {
      if (!doctor?.specialty) {
        console.log("Skipping related doctors fetch: No doctor or specialty");
        setRelatedDoctors([]);
        setRelatedLoading(false);
        return;
      }
      setRelatedLoading(true);
      try {
        console.log(
          "Fetching related doctors for specialty:",
          doctor.specialty
        );
        const response = await axiosInstance.get(
          "/users/doctors-by-specialty",
          {
            params: { specialty: doctor.specialty, excludeId: id },
          }
        );
        console.log("Related doctors response:", response.data);
        setRelatedDoctors(response.data.doctors || []);
      } catch (err) {
        console.error(
          "Fetch related doctors error:",
          err.response?.data || err.message
        );
        toast.error(
          err.response?.data?.error || "Failed to fetch related doctors",
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
        setRelatedDoctors([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelatedDoctors();
  }, [doctor?.specialty, id]); // Update dependency to doctor.specialty

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break;
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute === 0 ? "00" : "30";
        times.push({
          value: `${hour}:${minute.toString().padStart(2, "0")}`,
          display: `${displayHour}:${displayMinute} ${period}`,
        });
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots();

  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    setSelectedTime("");
    setShowCalendar(false);
  };

  const handleCalendarSelect = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
    setShowCalendar(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatTimeDisplay = (timeValue) => {
    const [hour, minute] = timeValue.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both a date and a time slot", {
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
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to book an appointment", {
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
      navigate("/login");
      return;
    }

    if (!doctor || !doctor.appointmentFee) {
      toast.error(
        "Doctor's consultation fee is not set or doctor data is missing",
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
      return;
    }

    try {
      const appointmentData = {
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
        fee: doctor.appointmentFee,
      };
      console.log("Booking appointment:", appointmentData);
      const response = await dispatch(
        createAppointment(appointmentData)
      ).unwrap();
      console.log("Appointment created:", response);
      toast.success("Appointment booked successfully! Proceed to payment.", {
        position: "bottom-right",
        duration: 3000,
        style: {
          background: "#fff",
          color: "#1F2937",
          border: "1px solid #5f6fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#5f6fff",
          secondary: "#fff",
        },
        className: "toast-slide-in",
      });
      navigate("/my-appointments");
    } catch (error) {
      console.error("Book appointment error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to book appointment";
      toast.error(errorMessage, {
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
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[140px] flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen pt-[140px] flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <p className="text-gray-600">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[140px] bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Transition distance={30} duration={1.5} delay={0.3}>
            <div className="mb-8">
              <div className="flex items-center gap-3 ml-7 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-indigo-600 rounded-full"></div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Doctor Profile
                </h1>
              </div>
              <p className="text-gray-600 ml-7 text-sm sm:text-base">
                Book your appointment with our medical professional
              </p>
            </div>
          </Transition>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <FadeContent blur={true} delay={200}>
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5 p-6 sm:p-8 bg-gradient-to-br from-[#5f6fff] to-indigo-700 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative mb-4">
                        <img
                          src={
                            doctor.profilePic
                              ? `http://localhost:5000${doctor.profilePic}`
                              : `https://via.placeholder.com/150?text=${doctor.name.charAt(
                                  0
                                )}`
                          }
                          alt={doctor.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/20 shadow-xl"
                          onError={(e) => {
                            console.error("Image load error for doctor:", {
                              doctorId: doctor._id,
                              profilePic: doctor.profilePic,
                            });
                            e.target.src = `https://via.placeholder.com/150?text=${doctor.name.charAt(
                              0
                            )}`;
                          }}
                        />
                        <div className="absolute -bottom-1 -right-[-10px] bg-green-400 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-3 border-white flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-1">
                        {doctor.name}
                        {doctor.isVerified && (
                          <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                        )}
                      </h2>
                      <p className="text-indigo-100 text-base sm:text-lg mb-2">
                        {doctor.specialty || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
                          <h3 className="font-semibold text-sm sm:text-base">
                            About Doctor
                          </h3>
                        </div>
                        <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
                          {doctor.about || "No information available"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 flex-1">
                          <div className="text-xs sm:text-sm text-indigo-200">
                            Experience
                          </div>
                          <div className="font-bold text-base sm:text-lg">
                            <span className="flex items-center gap-1">
                              {doctor.experience || "N/A"} <p>Years</p>
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-3 flex-1">
                          <div className="text-xs sm:text-sm text-indigo-200">
                            Consultation Fee
                          </div>
                          <div className="font-bold text-base sm:text-lg">
                            ${doctor.appointmentFee || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-3/5 p-6 sm:p-8">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Book Appointment
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Choose your preferred date and time
                    </p>
                  </div>
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                        Select Date
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                      <button
                        onClick={() => navigateWeek("prev")}
                        className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600 hover:text-indigo-600"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <span className="font-medium text-sm sm:text-base text-gray-900">
                        {weekDates[0].toLocaleDateString("en-US", {
                          month: "long",
                        })}{" "}
                        {weekDates[0].getDate()} -
                        {weekDates[6].toLocaleDateString("en-US", {
                          month: "short",
                        })}{" "}
                        {weekDates[6].getDate()}
                      </span>
                      <button
                        onClick={() => navigateWeek("next")}
                        className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600 hover:text-indigo-600"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-4">
                      {weekDates.map((date, index) => (
                        <div
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          className={`p-2 sm:p-3 text-center rounded-xl cursor-pointer transition-all duration-200 border-2 hover:scale-105 ${
                            selectedDate === date.toISOString().split("T")[0]
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-600 text-white border-indigo-600 shadow-lg scale-105"
                              : isToday(date)
                              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          <div className="text-xs font-medium opacity-80">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="text-sm sm:text-lg font-bold">
                            {date.getDate()}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 flex items-center gap-1 text-sm sm:text-base"
                      >
                        <Calendar className="w-4 h-4" />
                        {showCalendar ? "Hide calendar" : "Select another date"}
                      </button>
                      {selectedDate && (
                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          Selected:{" "}
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                    {showCalendar && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleCalendarSelect}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    )}
                  </div>
                  {selectedDate && (
                    <div className="mb-6 sm:mb-8 animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                          Available Time Slots
                        </h4>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                          {timeSlots.map((time, index) => (
                            <button
                              key={index}
                              onClick={() => handleTimeSelect(time.value)}
                              className={`p-2 sm:p-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 border-2 hover:scale-105 ${
                                selectedTime === time.value
                                  ? "bg-gradient-to-r from-indigo-600 to-indigo-600 text-white border-indigo-600 shadow-lg scale-105"
                                  : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 bg-white/70"
                              }`}
                            >
                              {time.display}
                            </button>
                          ))}
                        </div>
                        {selectedTime && (
                          <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm font-medium">
                            Selected time: {formatTimeDisplay(selectedTime)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-6">
                    <button
                      onClick={handleBookAppointment}
                      disabled={!selectedDate || !selectedTime}
                      className={`w-full sm:w-auto sm:min-w-[200px] font-semibold py-3 sm:py-4 px-6 rounded-2xl transition-all duration-300 text-sm sm:text-lg ${
                        selectedDate && selectedTime
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {selectedDate && selectedTime
                        ? "✓ Book Appointment"
                        : "Select Date & Time"}
                    </button>
                    {selectedDate && selectedTime && (
                      <p className="text-center text-gray-600 text-xs sm:text-sm mt-3">
                        You will receive a confirmation email after booking
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </FadeContent>
          </div>
          <RelatedDoctors
            doctors={relatedDoctors}
            loading={relatedLoading}
            specialty={doctor?.specialty}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
