import { createBrowserRouter } from "react-router-dom";

import Home from "../Pages/Home";
import Main from "../Layout/Main";
import SignIn from "../Pages/SignIn";

import Dashboard from "../Layout/Dashboard";
import SignUpFlow from "../Components/SharedComponets/SignUpFlow";
import ServicesPage from "../Pages/ServicesPage";
import Profile from "../Pages/Profile";
import AddServiceForm from "../Pages/ServiceProviders/AddService";
import MyServices from "../Pages/ServiceProviders/MyServices";
import CategoriesManagement from "../Pages/Admin/CategoriesManagement";
import AllUsers from "../Pages/Admin/AllUsers";
import ServicesManagement from "../Pages/Admin/ServicesManagement";
import BookingPage from "../Pages/BookingPage";
import Payments from "../Pages/Payments";
import MyBookings from "../Pages/RecieveProviders/MyBookings";
import Bookings from "../Pages/ServiceProviders/Bookings";
import MyReviews from "../Pages/RecieveProviders/MyReviews";
import WithdrawalRequest from "../Pages/ServiceProviders/WithdrawalRequest";
import AdminWithdrawals from "../Pages/Admin/AdminWithdrawals";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },

      {
        path: "/booking/:serviceId",
        element: <BookingPage />,
      },
      {
        path: "/payment",
        element: <Payments />,
      },
      // {
      //   path: "/payment/success",
      //   element: <PaymentSuccess />,
      // },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      //reciever routes
      {
        path: "/dashboard/my-bookings",
        element: <MyBookings />,
      },
      {
        path: "/dashboard/my-reviews",
        element: <MyReviews />,
      },

      //provider routes
      {
        path: "/dashboard/addServices",
        element: <AddServiceForm />,
      },
      {
        path: "/dashboard/booking-requests",
        element: <Bookings />,
      },
      {
        path: "/dashboard/my-services",
        element: <MyServices />,
      },
      {
        path: "/dashboard/blance-withdrawal",
        element: <WithdrawalRequest />,
      },

      //admin routes
      {
        path: "/dashboard/manage-categories",
        element: <CategoriesManagement />,
      },
      {
        path: "/dashboard/all-users",
        element: <AllUsers />,
      },
      {
        path: "/dashboard/manage-services",
        element: <ServicesManagement />,
      },
      {
        path: "/dashboard/withdrawal-management",
        element: <AdminWithdrawals />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUpFlow />,
  },
]);
