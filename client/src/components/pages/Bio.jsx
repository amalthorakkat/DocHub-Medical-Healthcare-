// import React, { useEffect, useState } from "react";
// import Dp from "../../assets/dp.png"; // remove/leave empty to test fallback
// import { Edit, User } from "lucide-react";

// const Bio = () => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const end = 10; // your target number
//     const duration = 500; // total animation time in ms
//     const stepTime = Math.abs(Math.floor(duration / end));

//     const timer = setInterval(() => {
//       start += 1;
//       setCount(start);
//       if (start === end) clearInterval(timer);
//     }, stepTime);

//     return () => clearInterval(timer);
//   }, []);

//   const hasDp = Dp && Dp.trim() !== "";

//   return (
//     <div className="pt-[140px]">
//       <div className="grid grid-cols-6 grid-rows-8 gap-4 mx-[250px]">
//         {/* 1st Grid (Profile Section) */}
//         <div className="col-span-3 row-span-4 flex items-center gap-[60px]">
//           <div className="relative w-60 h-60">
//             {hasDp ? (
//               <img
//                 src={Dp}
//                 alt="Profile"
//                 className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center rounded-full border-2 border-gray-300 shadow bg-gray-100">
//                 <User size={64} className="text-gray-400" />
//               </div>
//             )}

//             {/* Edit Icon */}
//             <button className="absolute cursor-pointer bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
//               <Edit size={18} className="text-gray-600" />
//             </button>
//           </div>

//           <div>
//             <h1 className="text-2xl font-semibold">Irene Books</h1>
//             <p className="text-gray-600">irene@gmail.com</p>
//             <p className="text-gray-600">Date of Birth : 01/01/2003</p>
//           </div>

//           <button className=" bg-[#F7971E] px-4 py-2 rounded cursor-pointer text-white" > Profile Edit </button>
//         </div>

//         {/* 2nd Grid */}
//         <div className="col-span-3 row-span-4 col-start-4 bg-gray-100 rounded-lg p-6 flex flex-col justify-center items-center">
//           <h1 className="text-xl font-semibold mb-2">Total Bookings</h1>
//           <p className="text-4xl font-bold text-blue-600">{count}</p>
//         </div>

//         {/* 3rd Grid */}
//         <div className="col-span-6 row-span-4 row-start-5 bg-gray-100 rounded-lg p-4">
//           <h1 className="text-xl">Bookings</h1>
//           <div className=" bg-amber-100 ">previous payed bookings here</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Bio;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Edit, User, Trash2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { setCredentials } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import ImageCropModal from "../../modal/ImageCropModal";

const Bio = () => {
  const [count, setCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", dob: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false); // State for modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let start = 0;
    const end = 10; // your target number
    const duration = 500; // total animation time in ms
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      });
      setProfilePic(
        user.profilePic ? `http://localhost:5000${user.profilePic}` : null
      );
    }
  }, [user]);

  // Modified: Open crop modal instead of directly uploading
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsCropModalOpen(true);
    }
  };

  // New: Handle cropped image upload
  const handleCropComplete = async (croppedImageBlob) => {
    if (croppedImageBlob) {
      const formData = new FormData();
      formData.append("profilePic", croppedImageBlob, "profile-pic.jpg"); // Convert blob to file
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
        toast.success("Profile picture updated successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to update profile picture"
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
      toast.success("Profile picture removed successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to remove profile picture"
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
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
      console.error("Profile Update Error:", error);
    }
  };

  const hasDp = profilePic && profilePic.trim() !== "";

  return (
    <div className="pt-[140px]">
      <div className="grid grid-cols-6 grid-rows-8 gap-4 mx-[250px]">
        <div className="col-span-3 row-span-4 flex items-center gap-[60px]">
          <div className="relative w-60 h-60">
            {hasDp ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full border-2 border-gray-300 shadow bg-gray-100">
                <User size={64} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100">
                <Edit size={18} className="text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
              {hasDp && (
                <button
                  className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  onClick={handleRemoveProfilePic}
                >
                  <Trash2 size={18} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
          <div>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-2xl font-semibold border rounded p-1"
                />
                <p className="text-gray-600">{user.email}</p>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="text-gray-600 border rounded p-1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-[#F7971E] px-4 py-2 rounded cursor-pointer text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 px-4 py-2 rounded cursor-pointer text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-semibold">
                  {user?.name || "Loading..."}
                </h1>
                <p className="text-gray-600">{user?.email || "Loading..."}</p>
                <p className="text-gray-600">
                  Date of Birth:{" "}
                  {user?.dob
                    ? new Date(user.dob).toLocaleDateString()
                    : "Loading..."}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#F7971E] px-4 py-2 rounded cursor-pointer text-white mt-2"
                >
                  Profile Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3 row-span-4 col-start-4 bg-gray-100 rounded-lg p-6 flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold mb-2">Total Bookings</h1>
          <p className="text-4xl font-bold text-blue-600">{count}</p>
        </div>
        <div className="col-span-6 row-span-4 row-start-5 bg-gray-100 rounded-lg p-4">
          <h1 className="text-xl">Bookings</h1>
          <div className="bg-amber-100">previous payed bookings here</div>
        </div>
      </div>
      {/* Add ImageCropModal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        image={selectedImage}
        onClose={() => {
          setIsCropModalOpen(false);
          setSelectedImage(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default Bio;
