import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaTools,
  FaCalendarAlt,
  FaClipboardList,
  FaStar,
  FaSearch,
  FaCreditCard,
  FaList,
  FaDollarSign,
  FaClipboardCheck,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { FcMenu } from "react-icons/fc";
import useAuth from "../hooks/useAuth";
import UseAdmin from "../hooks/useAdmin";
import UseProvider from "../hooks/UseProvider";

const Dashboard = () => {
  const { user, logOut } = useAuth();
  const [isAdmin] = UseAdmin();
  const [isProvider] = UseProvider();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // console.log(isProvider);

  // Admin Dashboard Links
  const adminLinks = [
    {
      name: "Admin Profile",
      path: "/dashboard/profile",
      icon: <FaUser />,
    },
    {
      name: "User Management",
      path: "/dashboard/all-users",
      icon: <FaUsers />,
    },
    {
      name: "Category Management",
      path: "/dashboard/manage-categories",
      icon: <FaList />,
    },
    {
      name: "Services Management",
      path: "/dashboard/manage-services",
      icon: <FaDollarSign />,
    },
    {
      name: "Withdrawal Management",
      path: "/dashboard/withdrawal-management",
      icon: <FaDollarSign />,
    },
  ];

  // Service Provider Dashboard Links
  const providerLinks = [
    {
      name: "Provider Profile",
      path: "/dashboard/profile",
      icon: <FaUser />,
    },
    { name: "My Services", path: "/dashboard/my-services", icon: <FaTools /> },
    {
      name: "Add Services",
      path: "/dashboard/addServices",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Booking Requests",
      path: "/dashboard/booking-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Balance & Withdrawal",
      path: "/dashboard/blance-withdrawal",
      icon: <FaClipboardCheck />,
    },
  ];

  // Regular User (Receiver) Dashboard Links
  const receiverLinks = [
    { name: "User Profile", path: "/dashboard/profile", icon: <FaUser /> },
    {
      name: "Search Services",
      path: "/dashboard/search-services",
      icon: <FaSearch />,
    },
    {
      name: "My Bookings",
      path: "/dashboard/my-bookings",
      icon: <FaClipboardList />,
    },
    {
      name: "Payment Methods",
      path: "/dashboard/payment-methods",
      icon: <FaCreditCard />,
    },
    { name: "My Reviews", path: "/dashboard/my-reviews", icon: <FaStar /> },
  ];

  // Determine which links to show based on role
  const roleLinks = isAdmin
    ? adminLinks
    : isProvider
    ? providerLinks
    : receiverLinks;
  const linksToShow = [...roleLinks];

  const handleLogOut = () => {
    logOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`flex flex-col w-full md:w-64 px-2 py-4 ${
          isSidebarOpen ? "block" : "hidden md:block"
        }`}
        style={{ backgroundColor: "#68b5c2" }}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full border-4 border-white"
            src={user?.photoURL || "https://via.placeholder.com/40"}
            alt="user avatar"
          />
          <h4 className="mx-2 mt-2 font-medium text-white">
            {user?.displayName || "User"}
            {isAdmin && " (Admin)"}
            {isProvider && " (Provider)"}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-white">
            {user?.email}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="mt-8">
          <ul className="flex flex-col gap-3">
            {linksToShow.map((link, index) => (
              <NavLink
                to={link.path}
                key={index}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 transition-all duration-200 ease-in-out rounded-lg hover:bg-white hover:text-[#68b5c2] ${
                    isActive ? "bg-white text-[#68b5c2]" : "text-white"
                  }`
                }
              >
                <span className="inline-flex items-center justify-center w-8 h-8 mr-2">
                  {link.icon}
                </span>
                <span className="text-sm font-medium">{link.name}</span>
              </NavLink>
            ))}

            {/* Divider */}
            <div className="border-t border-white/20 my-4"></div>

            {/* Home Link */}
            <li>
              <NavLink
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-center gap-2 p-2 text-white hover:bg-white hover:text-[#68b5c2] rounded-lg transition-colors duration-200"
              >
                <FaHome />
                Home
              </NavLink>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center justify-center gap-2 p-2 text-white hover:bg-white hover:text-[#68b5c2] rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white"
        style={{ backgroundColor: "#68b5c2" }}
      >
        <FcMenu size={24} />
      </button>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
