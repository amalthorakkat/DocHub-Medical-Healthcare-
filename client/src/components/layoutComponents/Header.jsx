// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
// import DocHubLogo from "../../assets/DocHub.jpg";
// import toast from "react-hot-toast";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // Update user state from localStorage
//   const updateUser = () => {
//     const storedUser = localStorage.getItem("user");
//     setUser(storedUser ? JSON.parse(storedUser) : null);
//   };

//   // Run on mount and route changes
//   useEffect(() => {
//     updateUser();
//   }, [location.pathname]);

//   // Listen for localStorage changes
//   useEffect(() => {
//     window.addEventListener("storage", updateUser);
//     return () => window.removeEventListener("storage", updateUser);
//   }, []);

//   const borderClass =
//     location.pathname === "/"
//       ? "border border-gray-800"
//       : "border border-gray-900";
//   const textColor = location.pathname === "/" ? "text-white" : "text-gray-900";

//   const menuItems = [
//     { name: "Home", path: "/" },
//     { name: "All Doctors", path: "/all-doctors" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   const profileMenuItems = [
//     { name: "My Profile", path: "/bio" },
//     { name: "My Appointments", path: "/my-appointments" },
//     { name: "Logout", action: "logout" },
//   ];

//   // Button classes
//   const loginClasses = `px-4 py-2 border rounded-md transition-all duration-300 transform
//     ${
//       location.pathname === "/"
//         ? "text-gray-900 bg-white border-white hover:bg-gray-100 hover:scale-105 active:scale-95"
//         : "text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-105 active:scale-95"
//     }`;

//   const signupClasses = `px-4 py-2 rounded-md transition-all duration-300 transform
//     ${
//       location.pathname === "/"
//         ? "bg-[#f7971e] text-white hover:bg-[#e68614] hover:scale-105 active:scale-95"
//         : "bg-gray-900 text-white hover:bg-gray-700 hover:scale-105 active:scale-95"
//     }`;

//   const adminButtonClasses = `bg-white border border-black text-black py-2 px-4 text-[13px] rounded-2xl cursor-pointer hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300`;

//   const handleAvatarClick = () => {
//     if (user) {
//       setIsProfileOpen(!isProfileOpen);
//     }
//   };

//   const handleProfileItemClick = (item) => {
//     if (item.action === "logout") {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       setIsProfileOpen(false);
//       setIsOpen(false);
//       navigate("/login");
//       toast.success("Logged out successfully");
//     } else {
//       navigate(item.path);
//       setIsProfileOpen(false);
//       setIsOpen(false);
//     }
//   };

//   return (
//     <header
//       className={`relative z-50 mb-[-110px] lg:mt-5 lg:mx-40 flex items-center p-5 justify-between lg:px-10 lg:rounded-[30px] shadow-md
//                   bg-white/10 backdrop-blur-md ${borderClass} transition-all duration-300`}
//     >
//       {/* Logo */}
//       <Link to="/">
//         <img
//           src={DocHubLogo}
//           alt="DocHub Logo"
//           className="h-10 mr-4 rounded-[5px] hover:scale-110 transition-transform duration-300"
//         />
//       </Link>

//       {/* Desktop Menu */}
//       <div className={`hidden md:flex items-center gap-10 ${textColor}`}>
//         {menuItems.map((item) => (
//           <Link
//             key={item.name}
//             to={item.path}
//             className={`cursor-pointer relative font-medium
//                        hover:text-gray-600
//                        after:block after:absolute after:bottom-0 after:left-0
//                        after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all
//                        after:duration-300 hover:after:w-full`}
//           >
//             {item.name}
//           </Link>
//         ))}

//         {/* Conditional Rendering: Avatar with Dropdown or Login/Signup Buttons */}
//         <div className="flex items-center gap-4">
//           {user ? (
//             <>
//               <div className="relative flex items-center gap-2">
//                 <div
//                   onClick={handleAvatarClick}
//                   className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 overflow-hidden"
//                 >
//                   {user.profilePic ? (
//                     <img
//                       src={`http://localhost:5000${user.profilePic}`}
//                       alt={user.name || "Profile"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-white">
//                       {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                     </span>
//                   )}
//                 </div>
//                 {isProfileOpen ? (
//                   <ChevronUp size={16} className={textColor} />
//                 ) : (
//                   <ChevronDown size={16} className={textColor} />
//                 )}
//                 {isProfileOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-900 rounded-lg shadow-lg z-50">
//                     <ul className="flex flex-col items-start p-4 space-y-3">
//                       {profileMenuItems.map((item) => (
//                         <li key={item.name}>
//                           <button
//                             onClick={() => handleProfileItemClick(item)}
//                             className="w-full cursor-pointer text-left text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
//                           >
//                             {item.name}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//               {user.role === "admin" && (
//                 <Link to="/admin" className={adminButtonClasses}>
//                   Admin Panel
//                 </Link>
//               )}
//             </>
//           ) : (
//             <>
//               <Link to="/login" className={loginClasses}>
//                 Login
//               </Link>
//               <Link to="/signup" className={signupClasses}>
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Mobile Hamburger */}
//       <button
//         className={textColor + " md:hidden"}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={28} /> : <Menu size={28} />}
//       </button>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full right-5 mt-3 w-48 bg-white/95 backdrop-blur-md border border-gray-900 rounded-lg shadow-lg md:hidden z-50">
//           <ul className="flex flex-col items-start p-4 space-y-3">
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.path}
//                   className="cursor-pointer text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//             {/* Mobile Conditional Rendering */}
//             {user ? (
//               <>
//                 <li>
//                   <div
//                     onClick={handleAvatarClick}
//                     className="flex items-center gap-2"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 overflow-hidden">
//                       {user.profilePic ? (
//                         <img
//                           src={`http://localhost:5000${user.profilePic}`}
//                           alt={user.name || "Profile"}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-white">
//                           {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                         </span>
//                       )}
//                     </div>
//                     {isProfileOpen ? (
//                       <ChevronUp size={16} className="text-gray-900" />
//                     ) : (
//                       <ChevronDown size={16} className="text-gray-900" />
//                     )}
//                   </div>
//                 </li>
//                 {isProfileOpen && (
//                   <ul className="flex flex-col items-start pl-4 space-y-3">
//                     {profileMenuItems.map((item) => (
//                       <li key={item.name}>
//                         <button
//                           onClick={() => handleProfileItemClick(item)}
//                           className="w-full text-left text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
//                         >
//                           {item.name}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 {user.role === "admin" && (
//                   <li>
//                     <Link
//                       to="/admin"
//                       className={`${adminButtonClasses} w-full text-center`}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       Admin Panel
//                     </Link>
//                   </li>
//                 )}
//               </>
//             ) : (
//               <>
//                 <li>
//                   <Link
//                     to="/login"
//                     className={`${loginClasses} w-full text-center`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Login
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/signup"
//                     className={`${signupClasses} w-full text-center`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
// import DocHubLogo from "../../assets/DocHub.jpg";
// import toast from "react-hot-toast";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // Update user state from localStorage
//   const updateUser = () => {
//     const storedUser = localStorage.getItem("user");
//     setUser(storedUser ? JSON.parse(storedUser) : null);
//   };

//   // Run on mount and route changes
//   useEffect(() => {
//     updateUser();
//   }, [location.pathname]);

//   // Listen for localStorage changes
//   useEffect(() => {
//     window.addEventListener("storage", updateUser);
//     return () => window.removeEventListener("storage", updateUser);
//   }, []);

//   const borderClass =
//     location.pathname === "/"
//       ? "border border-gray-800"
//       : "border border-gray-900";
//   const textColor = location.pathname === "/" ? "text-white" : "text-gray-900";

//   const menuItems = [
//     { name: "Home", path: "/" },
//     { name: "All Doctors", path: "/all-doctors" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   const profileMenuItems = [
//     { name: "My Profile", path: "/bio" },
//     { name: "My Appointments", path: "/my-appointments" },
//     { name: "Scheduled Appointments", path: "/scheduled-appointments" },
//     { name: "Logout", action: "logout" },
//   ];

//   // Button classes
//   const loginClasses = `px-4 py-2 border rounded-md transition-all duration-300 transform
//     ${
//       location.pathname === "/"
//         ? "text-gray-900 bg-white border-white hover:bg-gray-100 hover:scale-105 active:scale-95"
//         : "text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-105 active:scale-95"
//     }`;

//   const signupClasses = `px-4 py-2 rounded-md transition-all duration-300 transform
//     ${
//       location.pathname === "/"
//         ? "bg-[#f7971e] text-white hover:bg-[#e68614] hover:scale-105 active:scale-95"
//         : "bg-gray-900 text-white hover:bg-gray-700 hover:scale-105 active:scale-95"
//     }`;

//   const adminButtonClasses = `bg-white border border-black text-black py-2 px-4 text-[13px] rounded-2xl cursor-pointer hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300`;

//   const handleAvatarClick = () => {
//     if (user) {
//       setIsProfileOpen(!isProfileOpen);
//     }
//   };

//   const handleProfileItemClick = (item) => {
//     if (item.action === "logout") {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       setIsProfileOpen(false);
//       setIsOpen(false);
//       navigate("/login");
//       toast.success("Logged out successfully");
//     } else {
//       navigate(item.path);
//       setIsProfileOpen(false);
//       setIsOpen(false);
//     }
//   };

//   return (
//     <header
//       className={`relative z-50 mb-[-110px] lg:mt-5 lg:mx-40 flex items-center p-5 justify-between lg:px-10 lg:rounded-[30px] shadow-md
//                   bg-white/10 backdrop-blur-md ${borderClass} transition-all duration-300`}
//     >
//       {/* Logo */}
//       <Link to="/">
//         <img
//           src={DocHubLogo}
//           alt="DocHub Logo"
//           className="h-10 mr-4 rounded-[5px] hover:scale-110 transition-transform duration-300"
//         />
//       </Link>

//       {/* Desktop Menu */}
//       <div className={`hidden md:flex items-center gap-10 ${textColor}`}>
//         {menuItems.map((item) => (
//           <Link
//             key={item.name}
//             to={item.path}
//             className={`cursor-pointer relative font-medium
//                        hover:text-gray-600
//                        after:block after:absolute after:bottom-0 after:left-0
//                        after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all
//                        after:duration-300 hover:after:w-full`}
//           >
//             {item.name}
//           </Link>
//         ))}

//         {/* Conditional Rendering: Avatar with Dropdown or Login/Signup Buttons */}
//         <div className="flex items-center gap-4">
//           {user ? (
//             <>
//               <div className="relative flex items-center gap-2">
//                 <div
//                   onClick={handleAvatarClick}
//                   className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 overflow-hidden"
//                 >
//                   {user.profilePic ? (
//                     <img
//                       src={`http://localhost:5000${user.profilePic}`}
//                       alt={user.name || "Profile"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-white">
//                       {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                     </span>
//                   )}
//                 </div>
//                 {isProfileOpen ? (
//                   <ChevronUp size={16} className={textColor} />
//                 ) : (
//                   <ChevronDown size={16} className={textColor} />
//                 )}
//                 {isProfileOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-900 rounded-lg shadow-lg z-50">
//                     <ul className="flex flex-col items-start p-4 space-y-3">
//                       {profileMenuItems.map((item) => (
//                         <li key={item.name}>
//                           <button
//                             onClick={() => handleProfileItemClick(item)}
//                             className="w-full cursor-pointer text-left text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
//                           >
//                             {item.name}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//               {user.role === "admin" && (
//                 <Link to="/admin" className={adminButtonClasses}>
//                   Admin Panel
//                 </Link>
//               )}
//             </>
//           ) : (
//             <>
//               <Link to="/login" className={loginClasses}>
//                 Login
//               </Link>
//               <Link to="/signup" className={signupClasses}>
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Mobile Hamburger */}
//       <button
//         className={textColor + " md:hidden"}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={28} /> : <Menu size={28} />}
//       </button>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full right-5 mt-3 w-48 bg-white/95 backdrop-blur-md border border-gray-900 rounded-lg shadow-lg md:hidden z-50">
//           <ul className="flex flex-col items-start p-4 space-y-3">
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.path}
//                   className="cursor-pointer text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//             {/* Mobile Conditional Rendering */}
//             {user ? (
//               <>
//                 <li>
//                   <div
//                     onClick={handleAvatarClick}
//                     className="flex items-center gap-2"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 overflow-hidden">
//                       {user.profilePic ? (
//                         <img
//                           src={`http://localhost:5000${user.profilePic}`}
//                           alt={user.name || "Profile"}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-white">
//                           {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                         </span>
//                       )}
//                     </div>
//                     {isProfileOpen ? (
//                       <ChevronUp size={16} className="text-gray-900" />
//                     ) : (
//                       <ChevronDown size={16} className="text-gray-900" />
//                     )}
//                   </div>
//                 </li>
//                 {isProfileOpen && (
//                   <ul className="flex flex-col items-start pl-4 space-y-3">
//                     {profileMenuItems.map((item) => (
//                       <li key={item.name}>
//                         <button
//                           onClick={() => handleProfileItemClick(item)}
//                           className="w-full text-left text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
//                         >
//                           {item.name}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 {user.role === "admin" && (
//                   <li>
//                     <Link
//                       to="/admin"
//                       className={`${adminButtonClasses} w-full text-center`}
//                       onClick={() => setIsOpen(false)}
//                     >
//                       Admin Panel
//                     </Link>
//                   </li>
//                 )}
//               </>
//             ) : (
//               <>
//                 <li>
//                   <Link
//                     to="/login"
//                     className={`${loginClasses} w-full text-center`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Login
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/signup"
//                     className={`${signupClasses} w-full text-center`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import DocHubLogo from "../../assets/DocHub.jpg";
import toast from "react-hot-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Header - Current user state:", user);
  }, [user]);

  const borderClass =
    location.pathname === "/"
      ? "border border-gray-800"
      : "border border-gray-900";
  const textColor = location.pathname === "/" ? "text-white" : "text-gray-900";

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Doctors", path: "/all-doctors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const profileMenuItems = [
    { name: "My Profile", path: "/bio" },
    { name: "My Appointments", path: "/my-appointments" },
    { name: "Scheduled Appointments", path: "/scheduled-appointments" },
    { name: "Logout", action: "logout" },
  ];

  const loginClasses = `px-4 py-2 border rounded-md transition-all duration-300 transform 
    ${
      location.pathname === "/"
        ? "text-gray-900 bg-white border-white hover:bg-gray-100 hover:scale-105 active:scale-95"
        : "text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-105 active:scale-95"
    }`;

  const signupClasses = `px-4 py-2 rounded-md transition-all duration-300 transform 
    ${
      location.pathname === "/"
        ? "bg-[#f7971e] text-white hover:bg-[#e68614] hover:scale-105 active:scale-95"
        : "bg-gray-900 text-white hover:bg-gray-700 hover:scale-105 active:scale-95"
    }`;

  const adminButtonClasses = `bg-white border border-black text-black py-2 px-4 text-[13px] rounded-2xl cursor-pointer hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300`;

  const handleAvatarClick = () => {
    if (user) {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  const handleProfileItemClick = (item) => {
    if (item.action === "logout") {
      dispatch(logout());
      setIsProfileOpen(false);
      setIsOpen(false);
      navigate("/login");
      toast.success("Logged out successfully", {
        position: "bottom-right",
        duration: 3000,
      });
    } else {
      navigate(item.path);
      setIsProfileOpen(false);
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`relative z-50 mb-[-110px] lg:mt-5 lg:mx-40 flex items-center p-5 justify-between lg:px-10 lg:rounded-[30px] shadow-md
                  bg-white/10 backdrop-blur-md ${borderClass} transition-all duration-300`}
    >
      <Link to="/">
        <img
          src={DocHubLogo}
          alt="DocHub Logo"
          className="h-10 mr-4 rounded-[5px] hover:scale-110 transition-transform duration-300"
        />
      </Link>

      <div className={`hidden md:flex items-center gap-10 ${textColor}`}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`cursor-pointer relative font-medium 
                       hover:text-gray-600 
                       after:block after:absolute after:bottom-0 after:left-0 
                       after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all 
                       after:duration-300 hover:after:w-full`}
          >
            {item.name}
          </Link>
        ))}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative flex items-center gap-2">
                <div
                  onClick={handleAvatarClick}
                  className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 overflow-hidden"
                >
                  {user.profilePic ? (
                    <img
                      src={`http://localhost:5000${user.profilePic}`}
                      alt={user.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                </div>
                {isProfileOpen ? (
                  <ChevronUp size={16} className={textColor} />
                ) : (
                  <ChevronDown size={16} className={textColor} />
                )}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-900 rounded-lg shadow-lg z-50">
                    <ul className="flex flex-col items-start p-4 space-y-3">
                      {profileMenuItems.map((item) => (
                        <li key={item.name}>
                          <button
                            onClick={() => handleProfileItemClick(item)}
                            className="w-full cursor-pointer text-left text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
                          >
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {user.role === "admin" && (
                <Link to="/admin" className={adminButtonClasses}>
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={loginClasses}>
                Login
              </Link>
              <Link to="/signup" className={signupClasses}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <button
        className={textColor + " md:hidden"}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-full right-5 mt-3 w-48 bg-white/95 backdrop-blur-md border border-gray-900 rounded-lg shadow-lg md:hidden z-50">
          <ul className="flex flex-col items-start p-4 space-y-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="cursor-pointer text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <div
                    onClick={handleAvatarClick}
                    className="flex items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300 overflow-hidden">
                      {user.profilePic ? (
                        <img
                          src={`http://localhost:5000${user.profilePic}`}
                          alt={user.name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    {isProfileOpen ? (
                      <ChevronUp size={16} className="text-gray-900" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-900" />
                    )}
                  </div>
                </li>
                {isProfileOpen && (
                  <ul className="flex flex-col items-start pl-4 space-y-3">
                    {profileMenuItems.map((item) => (
                      <li key={item.name}>
                        <button
                          onClick={() => handleProfileItemClick(item)}
                          className="w-full text-left text-gray-900 font-medium hover:text-gray-600 transition transform duration-200 hover:scale-105 active:scale-95"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {user.role === "admin" && (
                  <li>
                    <Link
                      to="/admin"
                      className={`${adminButtonClasses} w-full text-center`}
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`${loginClasses} w-full text-center`}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className={`${signupClasses} w-full text-center`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
