// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { Provider, useSelector } from "react-redux";
// import { Toaster } from "react-hot-toast";
// import { store } from "./redux/store";
// import UserLayout from "./layout/UserLayout";
// import Home from "./components/home/Home";
// import AllDoctors from "./components/pages/AllDoctors";
// import DoctorDetails from "./components/pages/DoctorDetails";
// import Login from "./components/auth/Login";
// import SignUp from "./components/auth/SignUp";
// import Bio from "./components/pages/Bio";
// import AdminDashboard from "./components/admin/AdminDashboard";
// import Appointments from "./components/pages/Appointments";
// import ScheduledAppointments from "./components/pages/ScheduledAppointments";

// // Protected Route for Admin
// const ProtectedAdminRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.auth);
//   if (!user || user.role !== "admin") {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// // Protected Route for Auth Pages (Login/SignUp)
// const ProtectedAuthRoute = ({ children }) => {
//   const { token } = useSelector((state) => state.auth);
//   if (token) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <Toaster
//         position="bottom-right"
//         toastOptions={{
//           duration: 3000,
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
//           success: {
//             duration: 3000,
//             iconTheme: {
//               primary: "#F7971E",
//               secondary: "#fff",
//             },
//           },
//           error: {
//             duration: 4000,
//             iconTheme: {
//               primary: "#DC2626",
//               secondary: "#fff",
//             },
//           },
//           info: {
//             duration: 4000,
//             iconTheme: {
//               primary: "#F7971E",
//               secondary: "#fff",
//             },
//           },
//           className: "toast-slide-in",
//         }}
//       />
//       <Routes>
//         <Route path="/" element={<UserLayout />}>
//           <Route index element={<Home />} />
//           <Route path="all-doctors" element={<AllDoctors />} />
//           <Route path="/doc-bio/:id" element={<DoctorDetails />} />
//           <Route path="bio" element={<Bio />} />
//           <Route path="/my-appointments" element={<Appointments />} />
//           <Route
//             path="/scheduled-appointments"
//             element={<ScheduledAppointments />}
//           />
//           <Route
//             path="login"
//             element={
//               <ProtectedAuthRoute>
//                 <Login />
//               </ProtectedAuthRoute>
//             }
//           />
//           <Route
//             path="signup"
//             element={
//               <ProtectedAuthRoute>
//                 <SignUp />
//               </ProtectedAuthRoute>
//             }
//           />
//           <Route
//             path="admin"
//             element={
//               <ProtectedAdminRoute>
//                 <AdminDashboard />
//               </ProtectedAdminRoute>
//             }
//           />
//         </Route>
//       </Routes>
//     </Provider>
//   );
// };

// export default App;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import UserLayout from "./layout/UserLayout";
import Home from "./components/home/Home";
import AllDoctors from "./components/pages/AllDoctors";
import DoctorDetails from "./components/pages/DoctorDetails";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Bio from "./components/pages/Bio";
import AdminDashboard from "./components/admin/AdminDashboard";
import Appointments from "./components/pages/Appointments";
import ScheduledAppointments from "./components/pages/ScheduledAppointments";

// Protected Route for Admin
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protected Route for Auth Pages (Login/SignUp)
const ProtectedAuthRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (token && user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <Toaster
        position="bottom-right"
        toastOptions={{
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
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#F7971E",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#DC2626",
              secondary: "#fff",
            },
          },
          info: {
            duration: 4000,
            iconTheme: {
              primary: "#F7971E",
              secondary: "#fff",
            },
          },
          className: "toast-slide-in",
        }}
      />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="all-doctors" element={<AllDoctors />} />
          <Route path="/doc-bio/:id" element={<DoctorDetails />} />
          <Route path="bio" element={<Bio />} />
          <Route path="/my-appointments" element={<Appointments />} />
          <Route
            path="/scheduled-appointments"
            element={<ScheduledAppointments />}
          />
          <Route
            path="login"
            element={
              <ProtectedAuthRoute>
                <Login />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="signup"
            element={
              <ProtectedAuthRoute>
                <SignUp />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Route>
      </Routes>
    </Provider>
  );
};

export default App;
