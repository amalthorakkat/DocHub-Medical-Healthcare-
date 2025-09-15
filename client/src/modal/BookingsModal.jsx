import React, { useState } from "react";
import { X, Search, Filter, Calendar, Clock, CheckCircle } from "lucide-react";
import DocPlaceholder from "../assets/doc_placeholder.png";

const BookingsModal = ({ isOpen, onClose, appointments }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [doctorSuggestions, setDoctorSuggestions] = useState([]);

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
      const suggestions = appointments
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
    const specialties = appointments
      .map((appointment) => appointment.doctorId?.specialty)
      .filter((specialty) => specialty)
      .filter((value, index, self) => self.indexOf(value) === index);
    return specialties;
  };

  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#F7971E] to-[#FFB347] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              All Confirmed Bookings
            </h2>
            <button
              onClick={() => {
                onClose();
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
            Showing {getFilteredAppointments().length} of {appointments.length}{" "}
            bookings
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {getFilteredAppointments().length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No bookings found matching your criteria.
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
                    <div className="relative flex-shrink-0">
                      <img
                        className="w-16 h-16 object-cover rounded-lg"
                        src={
                          appointment.doctorId?.profilePic
                            ? `http://localhost:5000${appointment.doctorId.profilePic}`
                            : DocPlaceholder
                        }
                        alt={appointment.doctorId?.name || "Unknown Doctor"}
                        onError={(e) => {
                          e.target.src = DocPlaceholder;
                        }}
                      />
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.doctorId?.name || "Unknown Doctor"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.doctorId?.specialty || "N/A"}
                      </p>
                    </div>
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
  );
};

export default BookingsModal;
