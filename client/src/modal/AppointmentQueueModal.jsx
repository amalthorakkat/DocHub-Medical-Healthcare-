import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Search, Calendar, Clock, CheckCircle } from "lucide-react";
import { deleteAbsence } from "../redux/slices/appointmentSlice";
import toast from "react-hot-toast";

const AppointmentQueueModal = ({ isOpen, onClose, appointments }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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
    setSearchTerm(e.target.value);
  };

  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
      const matchesSearch = searchTerm
        ? appointment.patientId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      const matchesDate = selectedDate
        ? formatDate(appointment.date) === formatDate(selectedDate)
        : true;
      return matchesSearch && matchesDate;
    });
  };

  const handleCancelAppointment = (appointmentId) => {
    dispatch(deleteAbsence(appointmentId))
      .unwrap()
      .then(() => {
        toast.success("Appointment cancelled", {
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
        toast.error(err.message || "Failed to cancel appointment", {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Appointment Queue
            </h2>
            <button
              onClick={() => {
                onClose();
                setSearchTerm("");
                setSelectedDate("");
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-2 transition-all duration-200"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Patient
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Type patient name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                />
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {getFilteredAppointments().length} of {appointments.length}{" "}
            appointments
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {getFilteredAppointments().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">
                No appointments found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {getFilteredAppointments().map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-lg"
                        src={
                          appointment.patientId?.profilePic
                            ? `http://localhost:5000${appointment.patientId.profilePic}`
                            : `https://via.placeholder.com/40?text=${
                                appointment.patientId?.name?.charAt(0) || "?"
                              }`
                        }
                        alt={appointment.patientId?.name || "Unknown"}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/40?text=?`;
                        }}
                      />
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                        {appointment.patientId?.name || "Unknown Patient"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(appointment.date)} at{" "}
                        {formatTime(appointment.time)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm text-gray-600">
                      <div className="font-semibold text-gray-900">
                        ${appointment.fee || "N/A"}
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 sm:w-5 h-4 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentQueueModal;