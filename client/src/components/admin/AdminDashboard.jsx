import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { Users, Stethoscope } from "lucide-react";
import UserDetails from "./UserDetails";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    role: activeTab === "doctors" ? "doctor" : "patient",
    specialty: "",
    experience: "",
    about: "",
    appointmentFee: "",
    profilePic: null,
  });
  const [editUserId, setEditUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const specialties = [
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "General physician",
    "Gastroenterologist",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const patientResponse = await axiosInstance.get(
          "/users/admin/patients"
        );
        console.log("Patients Response:", patientResponse.data); // Debug
        setPatients(patientResponse.data.patients || []);
        const doctorResponse = await axiosInstance.get("/users/admin/doctors");
        console.log("Doctors Response:", doctorResponse.data); // Debug
        setDoctors(doctorResponse.data.doctors || []);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message); // Debug
        const errorMessage =
          err.response?.data?.error ||
          "Failed to fetch data. Please check server connectivity.";
        toast.error(errorMessage);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: activeTab === "doctors" ? "doctor" : "patient",
      specialty: activeTab === "doctors" ? prev.specialty : "",
      experience: activeTab === "doctors" ? prev.experience : "",
      about: activeTab === "doctors" ? prev.about : "",
      appointmentFee: activeTab === "doctors" ? prev.appointmentFee : "",
    }));
  }, [activeTab]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!editUserId && (!formData.password || formData.password.length < 8))
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.dob || new Date(formData.dob) >= new Date())
      newErrors.dob = "Invalid date of birth";
    if (formData.role === "doctor") {
      if (!formData.specialty)
        newErrors.specialty = "Specialty is required for doctors";
      if (!formData.experience)
        newErrors.experience = "Experience is required for doctors";
      if (!formData.about) newErrors.about = "About is required for doctors";
      if (
        !formData.appointmentFee ||
        isNaN(formData.appointmentFee) ||
        formData.appointmentFee <= 0
      )
        newErrors.appointmentFee = "Valid appointment fee is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "")
        form.append(key, formData[key]);
    }

    try {
      if (editUserId) {
        await axiosInstance.put(`/users/admin/users/${editUserId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User updated successfully");
      } else {
        await axiosInstance.post("/users/admin/users", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User created successfully");
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        dob: "",
        role: activeTab === "doctors" ? "doctor" : "patient",
        specialty: "",
        experience: "",
        about: "",
        appointmentFee: "",
        profilePic: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setEditUserId(null);
      setErrors({});
      const patientResponse = await axiosInstance.get("/users/admin/patients");
      console.log("Patients Response (after update):", patientResponse.data); // Debug
      setPatients(patientResponse.data.patients || []);
      const doctorResponse = await axiosInstance.get("/users/admin/doctors");
      console.log("Doctors Response (after update):", doctorResponse.data); // Debug
      setDoctors(doctorResponse.data.doctors || []);
    } catch (err) {
      console.error("Save User Error:", err.response?.data || err.message); // Debug
      toast.error(err.response?.data?.error || "Failed to save user");
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      role: user.role || (activeTab === "doctors" ? "doctor" : "patient"),
      specialty: user.specialty || "",
      experience: user.experience || "",
      about: user.about || "",
      appointmentFee: user.appointmentFee || "",
      profilePic: null,
    });
    setEditUserId(user._id);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setPatients(patients.filter((user) => user._id !== userId));
      setDoctors(doctors.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Delete User Error:", err.response?.data || err.message); // Debug
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleDeleteProfilePic = async (userId) => {
    if (!window.confirm("Are you sure you want to delete the profile picture?"))
      return;
    try {
      await axiosInstance.delete(`/users/admin/users/${userId}/profile-pic`);
      toast.success("Profile picture deleted successfully");
      setPatients(
        patients.map((user) =>
          user._id === userId ? { ...user, profilePic: null } : user
        )
      );
      setDoctors(
        doctors.map((user) =>
          user._id === userId ? { ...user, profilePic: null } : user
        )
      );
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, profilePic: null });
      }
    } catch (err) {
      console.error(
        "Delete Profile Pic Error:",
        err.response?.data || err.message
      ); // Debug
      toast.error(
        err.response?.data?.error || "Failed to delete profile picture"
      );
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleDoctorVerification = async (doctorId) => {
    try {
      await axiosInstance.put(`/users/admin/doctors/${doctorId}/verify`);
      toast.success("Doctor verified successfully");
      setDoctors(
        doctors.map((doctor) =>
          doctor._id === doctorId ? { ...doctor, isVerified: true } : doctor
        )
      );
    } catch (err) {
      console.error("Verify Doctor Error:", err.response?.data || err.message); // Debug
      toast.error(err.response?.data?.error || "Failed to verify doctor");
    }
  };

  const menuItems = [
    { key: "patients", label: "Patients", icon: <Users size={18} /> },
    { key: "doctors", label: "Doctors", icon: <Stethoscope size={18} /> },
  ];

  const renderContent = () => {
    if (selectedUser) {
      return <UserDetails user={selectedUser} onBack={handleBack} />;
    }

    switch (activeTab) {
      case "patients":
        return (
          <div className="p-6  ">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Patient Management
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                {editUserId ? "Edit Patient" : "Add New Patient"}
              </h3>
              <form
                onSubmit={handleCreateOrUpdateUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.name ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.email ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editUserId && "(Leave blank to keep unchanged)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.dob ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800`}
                    placeholder="Select date of birth"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.dob}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-200 bg-gray-50 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F5961D] file:text-white hover:file:bg-[#D87D17] transition-all duration-200"
                    accept="image/*"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#F5961D] text-white py-2.5 rounded-lg hover:bg-[#D87D17] transition-all duration-300 font-medium"
                  >
                    {editUserId ? "Update Patient" : "Add Patient"}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Patients List
              </h3>
              {patients.length === 0 ? (
                <p className="text-gray-500 text-sm">No patients found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-left">
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Email</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {user.profilePic ? (
                                <img
                                  src={`http://localhost:5000${user.profilePic}`}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <span
                                className="cursor-pointer text-[#F5961D] hover:text-[#D87D17] font-medium"
                                onClick={() => handleViewDetails(user)}
                              >
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{user.email}</td>
                          <td className="p-3 text-gray-600">{user.status}</td>
                          <td className="p-3 flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="px-4 py-1.5 bg-[#F5961D] text-white rounded-lg hover:bg-[#D87D17] transition-all duration-200 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                            >
                              Delete
                            </button>
                            {user.profilePic && (
                              <button
                                onClick={() => handleDeleteProfilePic(user._id)}
                                className="px-4 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 text-sm font-medium"
                              >
                                Delete Pic
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case "doctors":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Doctor Management
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                {editUserId ? "Edit Doctor" : "Add New Doctor"}
              </h3>
              <form
                onSubmit={handleCreateOrUpdateUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.name ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.email ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editUserId && "(Leave blank to keep unchanged)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.dob ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800`}
                    placeholder="Select date of birth"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.dob}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.specialty ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800`}
                  >
                    <option value="" disabled>
                      Select specialty
                    </option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.specialty}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.experience ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter experience (e.g., 4 Years)"
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.experience}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.about ? "border-red-400" : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter about the doctor"
                    rows="4"
                  />
                  {errors.about && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.about}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Fee
                  </label>
                  <input
                    type="number"
                    name="appointmentFee"
                    value={formData.appointmentFee}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5961D] transition-all duration-200 ${
                      errors.appointmentFee
                        ? "border-red-400"
                        : "border-gray-200"
                    } bg-gray-50 text-gray-800 placeholder-gray-400`}
                    placeholder="Enter appointment fee"
                  />
                  {errors.appointmentFee && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.appointmentFee}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-200 bg-gray-50 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#F5961D] file:text-white hover:file:bg-[#D87D17] transition-all duration-200"
                    accept="image/*"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#F5961D] text-white py-2.5 rounded-lg hover:bg-[#D87D17] transition-all duration-300 font-medium"
                  >
                    {editUserId ? "Update Doctor" : "Add Doctor"}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Doctors List
              </h3>
              {doctors.length === 0 ? (
                <p className="text-gray-500 text-sm">No doctors found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-left">
                        <th className="p-3 font-semibold">Name</th>
                        <th className="p-3 font-semibold">Email</th>
                        <th className="p-3 font-semibold">Specialty</th>
                        <th className="p-3 font-semibold">Verified</th>
                        <th className="p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr
                          key={doctor._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {doctor.profilePic ? (
                                <img
                                  src={`http://localhost:5000${doctor.profilePic}`}
                                  alt={doctor.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                  {doctor.name.charAt(0)}
                                </div>
                              )}
                              <span
                                className="cursor-pointer text-[#F5961D] hover:text-[#D87D17] font-medium"
                                onClick={() => handleViewDetails(doctor)}
                              >
                                {doctor.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{doctor.email}</td>
                          <td className="p-3 text-gray-600">
                            {doctor.specialty || "N/A"}
                          </td>
                          <td className="p-3 text-gray-600">
                            {doctor.isVerified ? "Yes" : "No"}
                          </td>
                          <td className="p-3 flex gap-2">
                            <button
                              onClick={() => handleEditUser(doctor)}
                              className="px-4 py-1.5 bg-[#F5961D] text-white rounded-lg hover:bg-[#D87D17] transition-all duration-200 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(doctor._id)}
                              className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                            >
                              Delete
                            </button>
                            {doctor.profilePic && (
                              <button
                                onClick={() =>
                                  handleDeleteProfilePic(doctor._id)
                                }
                                className="px-4 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 text-sm font-medium"
                              >
                                Delete Pic
                              </button>
                            )}
                            {!doctor.isVerified && (
                              <button
                                onClick={() =>
                                  handleDoctorVerification(doctor._id)
                                }
                                className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium"
                              >
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to Admin Panel
          </h2>
        );
    }
  };

  return (
    <div className=" pt-[140px] min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-4 bg-white shadow-sm p-4 rounded-xl border border-gray-100">
          <div className="flex gap-3 flex-wrap">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-[#F5961D] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-[#F5961D]/10 hover:text-[#D87D17]"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F5961D]"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
