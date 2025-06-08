/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import axios from 'axios';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	// Global states
	const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
	const [appointments, setAppointments] = useState([]);
	const [sellers, setSellers] = useState([]);
	const [buyers, setBuyers] = useState([]);
	const [dashData, setDashData] = useState(null);
	const [topCategories, setTopCategories] = useState([]);

	// States for chart usage
	const [completedAppointments, setCompletedAppointments] = useState(0);
	const [cancelledAppointments, setCancelledAppointments] = useState(0);
	const [totalAppointments, setTotalAppointments] = useState(0);

	// ----------------- Seller Management -----------------

	const getAllSeller = async () => {
		try {
			const { data } = await axios.get(`${backendUrl}/api/admin/all-Seller`, {
				headers: { aToken },
			});
			if (data.success) {
				setSellers(data.Seller || []);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error fetching sellers:', error);
			toast.error(error.response?.data?.message || 'Failed to fetch sellers');
		}
	};

	const getSellerById = async (sellerId) => {
		try {
			const { data } = await axios.get(
				`${backendUrl}/api/admin/seller-profile/${sellerId}`,
				{
					headers: { aToken },
				}
			);
			return data;
		} catch (error) {
			console.error('Error fetching seller by ID:', error);
			toast.error(error.response?.data?.message || 'Failed to fetch seller');
			return null;
		}
	};

	const updateSeller = async (sellerId, formData) => {
		try {
			const { data } = await axios.put(
				`${backendUrl}/api/admin/seller-profile/${sellerId}`,
				formData,
				{
					headers: {
						aToken,
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			return data;
		} catch (error) {
			console.error('Error updating seller:', error);
			toast.error(error.response?.data?.message || 'Failed to update seller');
			return { success: false };
		}
	};

	const deleteSeller = async (sellerId) => {
		try {
			const { data } = await axios.delete(
				`${backendUrl}/api/admin/seller-profile/${sellerId}`,
				{
					headers: { aToken },
				}
			);
			if (data.success) {
				toast.success('Seller deleted successfully');
				setSellers((prev) => prev.filter((s) => s._id !== sellerId));
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error deleting seller:', error);
			toast.error(error.response?.data?.message || 'Failed to delete seller');
		}
	};

	const changeAvailability = async (sellerId) => {
		try {
			const { data } = await axios.post(
				`${backendUrl}/api/admin/change-availability`,
				{ sellerId },
				{ headers: { aToken } }
			);
			if (data.success) {
				toast.success(data.message);
				setSellers((prev) =>
					prev.map((seller) =>
						seller._id === sellerId
							? { ...seller, available: !seller.available }
							: seller
					)
				);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error changing availability:', error);
			toast.error(
				error.response?.data?.message || 'Failed to update availability'
			);
		}
	};

	// ----------------- Buyer Management -----------------

	const getAllBuyers = async () => {
		try {
			const { data } = await axios.get(`${backendUrl}/api/admin/all-buyers`, {
				headers: { aToken },
			});
			if (data.success) {
				setBuyers(data.buyers || []);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error fetching buyers:', error);
			toast.error(error.response?.data?.message || 'Failed to fetch buyers');
		}
	};

	const getBuyerById = async (buyerId) => {
		try {
			const { data } = await axios.get(
				`${backendUrl}/api/admin/buyer-profile/${buyerId}`,
				{
					headers: { aToken },
				}
			);
			return data;
		} catch (error) {
			console.error('Error fetching buyer by ID:', error);
			toast.error(error.response?.data?.message || 'Failed to fetch buyer');
			return null;
		}
	};

	const updateBuyer = async (buyerId, formData) => {
		try {
			const { data } = await axios.put(
				`${backendUrl}/api/admin/buyer-profile/${buyerId}`,
				formData,
				{
					headers: {
						aToken,
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			return data;
		} catch (error) {
			console.error('Error updating buyer:', error);
			toast.error(error.response?.data?.message || 'Failed to update buyer');
			return { success: false };
		}
	};

	const deleteBuyer = async (buyerId) => {
		try {
			const { data } = await axios.delete(
				`${backendUrl}/api/admin/buyer-profile/${buyerId}`,
				{
					headers: { aToken },
				}
			);
			if (data.success) {
				toast.success('Buyer deleted successfully');
				setBuyers((prev) => prev.filter((b) => b._id !== buyerId));
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error deleting buyer:', error);
			toast.error(error.response?.data?.message || 'Failed to delete buyer');
		}
	};

	// ----------------- Appointment Management -----------------

	const getAllAppointments = async () => {
		try {
			const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
				headers: { aToken },
			});
			if (data.success) {
				setAppointments([...data.appointments].reverse());
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error fetching appointments:', error);
			toast.error(
				error.response?.data?.message || 'Failed to fetch appointments'
			);
		}
	};

	const cancelAppointment = async (appointmentId) => {
		try {
			const { data } = await axios.post(
				`${backendUrl}/api/admin/cancel-appointment`,
				{ appointmentId },
				{ headers: { aToken } }
			);
			if (data.success) {
				toast.success(data.message);
				setAppointments((prev) =>
					prev.filter((appointment) => appointment._id !== appointmentId)
				);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error canceling appointment:', error);
			toast.error(
				error.response?.data?.message || 'Failed to cancel appointment'
			);
		}
	};

	// ----------------- Dashboard Data (for Charts) -----------------

	const getDashData = async () => {
		try {
			const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
				headers: { aToken },
			});
		//	console.log('Dashboard Data:', data);

			if (data.success) {
				const dash = data.dashData;
				setDashData(dash);

				// Set chart values
				setCompletedAppointments(dash.completedAppointments || 0);
				setCancelledAppointments(dash.cancelledAppointments || 0);
				setTotalAppointments(dash.appointments || 0);
				setTopCategories(dash.topCategories || []);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
			toast.error(
				error.response?.data?.message || 'Failed to fetch dashboard data'
			);
		}
	};

	// ----------------- Context Value -----------------

	const value = {
		aToken,
		setAToken,

		// Sellers
		sellers,
		getAllSeller,
		getSellerById,
		updateSeller,
		deleteSeller,
		changeAvailability,

		// Buyers
		buyers,
		getAllBuyers,
		getBuyerById,
		updateBuyer,
		deleteBuyer,

		// Appointments
		appointments,
		getAllAppointments,
		cancelAppointment,

		// Dashboard
		dashData,
		getDashData,
		completedAppointments,
		cancelledAppointments,
		totalAppointments,
    topCategories,
	};

	return (
		<AdminContext.Provider value={value}>{children}</AdminContext.Provider>
	);
};

export default AdminContextProvider;
