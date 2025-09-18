import React, { useState, useEffect, useRef } from "react";
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
  const dropdownRef = useRef(null); // Ref for handling click outside

  useEffect(() => {
    console.log("Header - Current user state:", user);
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <div
                className="relative flex items-center gap-2"
                ref={dropdownRef}
              >
                <div
                  onClick={handleAvatarClick}
                  onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
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
                  <div
                    className="absolute top-full right-0 mt-3  w-72 bg-gradient-to-br from-white/95 to-gray-100/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl z-50 transform transition-all duration-300 ease-in-out opacity-0 translate-y-2 animate-dropdown"
                    style={{
                      animation: isProfileOpen
                        ? "dropdown-open 0.3s forwards"
                        : "none",
                    }}
                  >
                    <ul className="flex flex-col p-3 space-y-2">
                      {profileMenuItems.map((item) => (
                        <li
                          key={item.name}
                          className="group relative rounded-lg hover:bg-gray-200/50 transition-all duration-200"
                        >
                          <button
                            onClick={() => handleProfileItemClick(item)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleProfileItemClick(item)
                            }
                            role="menuitem"
                            className="w-full text-left px-4 py-2 text-gray-800 font-medium group-hover:text-gray-900 group-hover:scale-105 transition-all duration-200"
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
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-5 mt-3 w-70 bg-gradient-to-br from-white/95 to-gray-100/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl md:hidden z-50 transform transition-all duration-300 ease-in-out"
          ref={dropdownRef}
        >
          <ul className="flex flex-col p-3 space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className="rounded-lg hover:bg-gray-200/50 transition-all duration-200"
              >
                <Link
                  to={item.path}
                  className="block px-4 py-2 text-gray-800 font-medium hover:text-gray-900 hover:scale-105 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li className="rounded-lg hover:bg-gray-200/50 transition-all duration-200">
                  <div
                    onClick={handleAvatarClick}
                    onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    className="flex items-center gap-2 px-4 py-2"
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
                  <ul className="flex flex-col pl-4 space-y-2">
                    {profileMenuItems.map((item) => (
                      <li
                        key={item.name}
                        className="rounded-lg hover:bg-gray-200/50 transition-all duration-200"
                      >
                        <button
                          onClick={() => handleProfileItemClick(item)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleProfileItemClick(item)
                          }
                          role="menuitem"
                          className="w-full text-left px-4 py-2 text-gray-800 font-medium hover:text-gray-900 hover:scale-105 transition-all duration-200"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {user.role === "admin" && (
                  <li className="rounded-lg hover:bg-gray-200/50 transition-all duration-200">
                    <Link
                      to="/admin"
                      className={`${adminButtonClasses} block w-full text-center px-4 py-2`}
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <>
                <li className="rounded-lg hover:bg-gray-200/50 transition-all duration-200">
                  <Link
                    to="/login"
                    className={`${loginClasses} block w-full text-center px-4 py-2`}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="rounded-lg hover:bg-gray-200/50 transition-all duration-200">
                  <Link
                    to="/signup"
                    className={`${signupClasses} block w-full text-center px-4 py-2`}
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

// Add CSS for dropdown animation
const styles = `
  @keyframes dropdown-open {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-dropdown {
    animation: dropdown-open 0.3s ease-in-out forwards;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Header;
