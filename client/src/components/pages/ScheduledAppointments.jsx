import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConfirmedAppointments } from "../../redux/slices/appointmentSlice";
import {
  Calendar,
  Clock,
  User,
  Award,
  CheckCircle,
  X,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DocPlaceholder from "../../assets/doc_placeholder.png";
import Lottie from "lottie-react";
import MedicineOnline from "../../assets/lottie/medicineonline.json";
import { useLocation } from "react-router-dom";
import Transition from "../../animations/Transition";
import FadeContent from "../../animations/FadeContent";

const ScheduledAppointments = () => {
  const dispatch = useDispatch();
  const { confirmedAppointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const [hasFetched, setHasFetched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [doctorSuggestions, setDoctorSuggestions] = useState([]);
  const fetchRef = useRef(false);
  const location = useLocation();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup to restore default overflow when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      if (fetchRef.current) return;
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const suggestions = confirmedAppointments
        .filter((appointment) =>
          appointment.doctorId?.name
            ?.toLowerCase()
            .includes(value.toLowerCase())
        )
        .map((appointment) => appointment.doctorId.name)
        .filter((name, index, self) => self.indexOf(name) === index);
      setDoctorSuggestions(suggestions);
    } else {
      setDoctorSuggestions([]);
    }
  };

  const getUniqueSpecialties = () => {
    const specialties = confirmedAppointments
      .map((appointment) => appointment.doctorId?.specialty)
      .filter((specialty) => specialty)
      .filter((value, index, self) => self.indexOf(value) === index);
    return specialties;
  };

  const getFilteredAppointments = () => {
    return confirmedAppointments.filter((appointment) => {
      const matchesSearch = searchTerm
        ? appointment.doctorId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      const matchesSpecialty = selectedSpecialty
        ? appointment.doctorId?.specialty === selectedSpecialty
        : true;
      const matchesDate = selectedDate
        ? formatDate(appointment.date) === formatDate(selectedDate)
        : true;
      return matchesSearch && matchesSpecialty && matchesDate;
    });
  };

  const containerClasses = `max-w-6xl mx-auto mb-8 pb-[50px] ${
    location.pathname === "/scheduled-appointments" ? "pt-[140px]" : ""
  }`;

  return (
    <div className={containerClasses}>
      {/* Minimal Header */}

      <Transition distance={50} duration={1.5} delay={0.3}>
        <div className="flex items-center justify-between pb-10 pt-20 ">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#F7971E] to-[#FFB347] rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Scheduled Appointments
            </h1>
          </div>

          {/* Button to Open Modal */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F7971E] text-white px-4 py-2 rounded-lg hover:bg-[#FFB347] transition-colors duration-200"
            >
              View All Appointments
            </button>
          </div>
        </div>
      </Transition>

      {/* Loading State - Minimal */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-100 border-t-[#F7971E]"></div>
            <div className="absolute inset-0 rounded-full bg-[#F7971E] opacity-10 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Empty State - Minimal */}
      {!loading && confirmedAppointments.length === 0 && (
        <div className="bg-white rounded-xl border border-orange-100 p-6 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <Lottie
              animationData={MedicineOnline}
              loop={true}
              style={{ width: 250, height: 250 }}
            />
          </div>
          <p className="text-gray-600 text-lg font-medium">
            No scheduled appointments found
          </p>
        </div>
      )}

      {/* Appointment Cards - Compact & Minimal */}
      {confirmedAppointments.map((appointment, index) => {
        if (!appointment.doctorId) {
          console.warn("Missing doctorId for appointment:", appointment._id);
        }
        return (
          <FadeContent
            blur={true}
            duration={800}
            delay={0}
            easing="ease-out"
            threshold={0.2}
            initialOpacity={0}
          >
            <div
              key={appointment._id}
              className="bg-white border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-4 group"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeIn 0.5s ease-out forwards",
              }}
            >
              <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
                {/* Doctor Image - Compact */}
                <div className="flex items-center justify-center md:col-span-1 p-4 bg-gradient-to-br from-orange-50 to-white">
                  <div className="relative group-hover:scale-105 transition-transform duration-200">
                    <img
                      className="w-[120px] h-[120px] object-cover object-center rounded-lg shadow-sm border-2 border-white"
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
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 shadow-sm">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content - Compact */}
                <div className="md:col-span-2 p-2 sm:p-3 md:p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Doctor Info - Minimal */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#F7971E] transition-colors duration-200">
                          {appointment.doctorId?.name || "Unknown Doctor"}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600 mb-1">
                          <User className="w-3 h-3" />
                          <span className="font-medium text-xs">
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

                      {/* Appointment Details - Compact */}
                      <div className="border-t border-gray-200 pt-2">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                          Appointment Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-500 uppercase">
                                Date
                              </div>
                              <div className="font-medium text-gray-900 text-xs">
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
                              <div className="font-medium text-gray-900 text-xs">
                                {formatTime(appointment.time)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Section - Compact */}
                    <div className="md:min-w-[140px] lg:min-w-[160px] md:pl-4 lg:pl-4 md:border-l border-gray-200">
                      <div className="text-left md:text-right mb-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          Consultation Fee
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                          ${appointment.fee || "N/A"}.00
                        </div>
                        <div className="text-xs text-gray-500">Per session</div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full bg-green-100 text-green-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium flex items-center justify-center space-x-2 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          <span>Payment Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeContent>
        );
      })}

      {/* Modal for All Appointments */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#F7971E] to-[#FFB347] px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  All Scheduled Appointments
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSearchTerm("");
                    setSelectedSpecialty("");
                    setSelectedDate("");
                    setDoctorSuggestions([]);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-2 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-grey-500" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Doctor Search with Suggestions */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Doctor
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Type doctor name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7971E] focus:border-transparent"
                    />
                    {doctorSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-40 overflow-y-auto">
                        {doctorSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchTerm(suggestion);
                              setDoctorSuggestions([]);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700 border-b border-gray-100 last:border-b-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7971E] focus:border-transparent"
                    >
                      <option value="">All Specialties</option>
                      {getUniqueSpecialties().map((specialty, index) => (
                        <option key={index} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7971E] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {getFilteredAppointments().length} of{" "}
                {confirmedAppointments.length} appointments
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {getFilteredAppointments().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No appointments found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredAppointments().map((appointment, index) => (
                    <div
                      key={appointment._id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Doctor Image - Small */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              className="w-16 h-16 object-cover object-center rounded-lg"
                              src={
                                appointment.doctorId?.profilePic
                                  ? `http://localhost:5000${appointment.doctorId.profilePic}`
                                  : DocPlaceholder
                              }
                              alt={
                                appointment.doctorId?.name || "Unknown Doctor"
                              }
                              onError={(e) => {
                                e.target.src = DocPlaceholder;
                              }}
                            />
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900">
                            {appointment.doctorId?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.doctorId?.specialty}
                          </p>
                        </div>

                        {/* Appointment Details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(appointment.time)}</span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            ${appointment.fee || "N/A"}.00
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledAppointments;
