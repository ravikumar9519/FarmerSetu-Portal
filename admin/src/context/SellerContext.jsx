/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const SellerContext = createContext();

const SellerContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Existing functions for logged-in seller
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/appointments`, {
        headers: { dtoken: dToken },
      });
      if (data.success) setAppointments(data.appointments.reverse());
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/profile`, {
        headers: { dtoken: dToken },
      });
      if (data.success) setProfileData(data.profileData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/Seller/cancel-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/Seller/complete-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/dashboard`, {
        headers: { dtoken: dToken },
      });
      if (data.success) setDashData(data.dashData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // For Admin - fetch seller profile by id
  const getProfileDataById = async (sellerId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/profile/${sellerId}`, {
        headers: { dtoken: dToken },
      });
      if (data.success) {
        return data.seller || null;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  // For Admin - fetch dashboard data by seller id
  const getDashDataById = async (sellerId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/dashboard/${sellerId}`, {
        headers: { dtoken: dToken },
      });
      if (data.success) {
        return data.dashData || null;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    getProfileDataById,
    getDashDataById,
  };

  return (
    <SellerContext.Provider value={value}>
      {props.children}
    </SellerContext.Provider>
  );
};

export default SellerContextProvider;
