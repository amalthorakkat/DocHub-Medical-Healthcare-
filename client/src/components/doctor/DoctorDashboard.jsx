import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchConfirmedAppointments,
  fetchConfirmedAppointmentsCount,
  createAbsence,
  fetchAbsences,
  deleteAbsence,
  clearError,
} from "../../redux/slices/appointmentSlice";
import toast from "react-hot-toast";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Transition from "../../animations/Transition";
import FadeContent from "../../animations/FadeContent";
import AppointmentQueueModal from "../../modal/AppointmentQueueModal";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    confirmedAppointments,
    confirmedAppointmentsCount,
    absences,
    loading,
    error,
  } = useSelector((state) => state.appointments);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [removedDate, setRemovedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "doctor") {
      dispatch(fetchConfirmedAppointments());
      dispatch(fetchConfirmedAppointmentsCount());
      dispatch(fetchAbsences());
    }
  }, [dispatch, user]);

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

  // Clear selectedDate and removedDate after 3 seconds
  useEffect(() => {
    if (selectedDate) {
      const timer = setTimeout(() => setSelectedDate(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (removedDate) {
      const timer = setTimeout(() => setRemovedDate(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [removedDate]);

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

  const isAbsent = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return absences.some((absence) => absence.date === formattedDate);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleDateSelect = async (date) => {
    if (isToday(date)) {
      toast.error("Cannot select today's date", {
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
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];
    if (isAbsent(date)) {
      const absence = absences.find((a) => a.date === formattedDate);
      dispatch(deleteAbsence(absence._id))
        .unwrap()
        .then(() => {
          setRemovedDate(formattedDate);
          toast.success("Absence removed successfully", {
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
          });
        })
        .catch((err) => {
          toast.error(err.message || "Failed to remove absence", {
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
        });
    } else {
      dispatch(createAbsence({ date: formattedDate }))
        .unwrap()
        .then(() => {
          setSelectedDate(formattedDate);
          toast.success("Absence marked successfully", {
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
          });
        })
        .catch((err) => {
          toast.error(err.message || "Failed to mark absence", {
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
        });
    }
  };

  const handleCalendarSelect = (e) => {
    const formattedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (formattedDate === today) {
      toast.error("Cannot select today's date", {
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
      return;
    }
    setSelectedDate(formattedDate);
    dispatch(createAbsence({ date: formattedDate }))
      .unwrap()
      .then(() => {
        toast.success("Absence marked successfully", {
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
        });
      })
      .catch((err) => {
        toast.error(err.message || "Failed to mark absence", {
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
      });
    setShowCalendar(false);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (newDate < tomorrow) {
      setCurrentWeekStart(tomorrow);
    } else {
      setCurrentWeekStart(newDate);
    }
  };

  // Sort appointments by date and time (latest first)
  const sortedAppointments = [...confirmedAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  // Limit to first 5 appointments for dashboard display
  const displayedAppointments = sortedAppointments.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen pt-[140px] flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[140px] bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Transition distance={30} duration={1.5} delay={0.3}>
          <div className="mb-8">
            <div className="flex items-center gap-3 ml-4 sm:ml-7 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-indigo-600 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Doctor Dashboard
              </h1>
            </div>
            <p className="text-gray-600 ml-4 sm:ml-7 text-sm sm:text-base">
              Manage your appointments and availability
            </p>
          </div>
        </Transition>
        <FadeContent blur={true} delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white flex flex-col gap-3 items-center justify-center rounded-3xl shadow-xl p-4 sm:p-6 transform hover:scale-[1.02] transition-transform duration-200">
              <h2 className="text-lg sm:text-xl lg:text-[30px] font-bold text-gray-900 ">
                Total Bookings
              </h2>
              <p className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-indigo-600">
                {confirmedAppointmentsCount}
              </p>
              <p className="text-gray-600 text-sm">Confirmed Appointments</p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 transform hover:scale-[1.02] transition-transform duration-200 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Mark Absence
                </h2>
              </div>
              <div className="flex items-center justify-between mb-4 p-2 sm:p-3 bg-gray-50 rounded-xl">
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600 hover:text-indigo-600"
                >
                  <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
                <span className="font-medium text-sm sm:text-base text-gray-900">
                  {weekDates[0].toLocaleDateString("en-US", { month: "long" })}{" "}
                  {weekDates[0].getDate()} -{" "}
                  {weekDates[6].toLocaleDateString("en-US", { month: "short" })}{" "}
                  {weekDates[6].getDate()}
                </span>
                <button
                  onClick={() => navigateWeek("next")}
                  className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200 text-gray-600 hover:text-indigo-600"
                >
                  <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3 mb-4">
                {weekDates.map((date, index) => (
                  <div
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 sm:p-3 text-center rounded-xl transition-all duration-200 border-2 hover:scale-105 ${
                      isAbsent(date)
                        ? "bg-red-500 text-white border-red-500 shadow-lg scale-105 cursor-pointer"
                        : selectedDate === date.toISOString().split("T")[0]
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-600 text-white border-indigo-600 shadow-lg scale-105 cursor-pointer"
                        : isToday(date)
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
                    }`}
                  >
                    <div className="text-xs font-medium opacity-80">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-sm sm:text-lg font-bold">{date.getDate()}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 flex items-center gap-1 text-sm sm:text-base"
                >
                  <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                  {showCalendar ? "Hide calendar" : "Select another date"}
                </button>
                <div className="flex items-center gap-2">
                  {selectedDate && (
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Selected:{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {removedDate && (
                    <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Removed:{" "}
                      {new Date(removedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </div>
              {showCalendar && (
                <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleCalendarSelect}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    min={getTomorrowDate()}
                  />
                </div>
              )}
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Appointment Queue
                </h2>
                {confirmedAppointments.length > 5 && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    View All Appointments
                  </button>
                )}
              </div>
              {displayedAppointments.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">No Patients Scheduled</p>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto">
                  {displayedAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={
                            appointment.patientId?.profilePic
                              ? `http://localhost:5000${appointment.patientId.profilePic}`
                              : `https://via.placeholder.com/40?text=${
                                  appointment.patientId?.name?.charAt(0) || "?"
                                }`
                          }
                          alt={appointment.patientId?.name || "Unknown"}
                          className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border-2 border-indigo-200"
                          onError={(e) => {
                            console.error("Image load error for appointment:", {
                              appointmentId: appointment._id,
                              patientId: appointment.patientId,
                            });
                            e.target.src = `https://via.placeholder.com/40?text=?`;
                          }}
                        />
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-gray-900">
                            {appointment.patientId?.name || "Unknown Patient"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}{" "}
                            at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm font-medium text-indigo-600">
                          ${appointment.fee}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeContent>
      </div>
      <AppointmentQueueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointments={sortedAppointments}
      />
    </div>
  );
};

export default DoctorDashboard;