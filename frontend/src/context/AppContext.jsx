import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [Seller, setSeller] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  // 🔹 Memoized function for getting Seller data
  const getSellerData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/Seller/list`);
      console.log("Fetched Seller Data:", data); // Debugging

      // Check for success and that sellers array exists
      if (data.success && Array.isArray(data.sellers)) {
        setSeller(data.sellers);  // Use 'sellers' key (lowercase) from backend
      } else {
        toast.error(data.message || "Invalid seller data.");
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to fetch sellers");
    }
  }, [backendUrl]);

  // 🔹 Memoized function for getting user profile data
  const loadUserProfileData = useCallback(async () => {
    if (!token) return; // Prevent unnecessary API calls when no token
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, [backendUrl, token]);

  // Fetch seller data once on mount
  useEffect(() => {
    getSellerData();
  }, [getSellerData]);

  // Fetch user profile only when token is available
  useEffect(() => {
    loadUserProfileData();
  }, [loadUserProfileData]);

  const value = {
    Seller,
    getSellerData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
