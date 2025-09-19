import React from "react";
import Logo from '../../assets/DocHub.jpg'
import Carousel from "../home/Carousel";

const Footer = () => {
  return (
    <footer className="bg-[#272b32] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div>
          <Carousel/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* DocHub Brand */}
          <div className="col-span-1 md:col-span-1">
            <img src={Logo} className=" h-15 rounded-[10px] mb-3 " alt="" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted healthcare appointment solution, bridging the gap
              between patients, doctors, and healthcare administrators with
              secure and efficient booking services.
            </p>
          </div>

          {/* For Patients */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              For Patients
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Find Doctors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Book Appointments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  View History
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Payment & Billing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Patient Registration
                </a>
              </li>
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              For Doctors
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Doctor Registration
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Manage Appointments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Patient History
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Earnings Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Availability Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className=" cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              &copy; 2025 DocHub - Healthcare Appointment System. All rights
              reserved.
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-300">Powered by MERN Stack</div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  Secure payments by
                </span>
                <span className="text-blue-400 font-semibold">Stripe</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Built with MongoDB, Express.js, React & Node.js | Secure
              Authentication & Real-time Booking
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
