import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import SellerModel from '../models/SellerModel.js';
import appointmentModel from '../models/appointmentModel.js';

// Seller Login
const loginSeller = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await SellerModel.findOne({ email });

		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: '7d',
			});
			return res.json({ success: true, token });
		} else {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get Appointments for Seller
const appointmentsSeller = async (req, res) => {
	try {
		const SelId = req.userId;
		if (!SelId) {
			return res
				.status(400)
				.json({ success: false, message: 'Seller ID missing' });
		}

		const appointments = await appointmentModel.find({ SelId });
		res.json({ success: true, appointments });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Cancel Appointment
const appointmentCancel = async (req, res) => {
	try {
		const SelId = req.userId;
		const { appointmentId } = req.body;

		if (!appointmentId || !SelId) {
			return res
				.status(400)
				.json({
					success: false,
					message: 'Appointment ID or Seller ID missing',
				});
		}

		const appointmentData = await appointmentModel.findById(appointmentId);
		if (
			appointmentData &&
			appointmentData.SelId.toString() === SelId.toString()
		) {
			await appointmentModel.findByIdAndUpdate(appointmentId, {
				cancelled: true,
			});
			return res.json({ success: true, message: 'Appointment Cancelled' });
		}

		return res
			.status(403)
			.json({ success: false, message: 'Unauthorized or Invalid Request' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Complete Appointment
const appointmentComplete = async (req, res) => {
	try {
		const SelId = req.userId;
		const { appointmentId } = req.body;

		if (!appointmentId || !SelId) {
			return res
				.status(400)
				.json({
					success: false,
					message: 'Appointment ID or Seller ID missing',
				});
		}

		const appointmentData = await appointmentModel.findById(appointmentId);
		if (
			appointmentData &&
			appointmentData.SelId.toString() === SelId.toString()
		) {
			await appointmentModel.findByIdAndUpdate(appointmentId, {
				isCompleted: true,
			});
			return res.json({ success: true, message: 'Appointment Completed' });
		}

		return res
			.status(403)
			.json({ success: false, message: 'Unauthorized or Invalid Request' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// All Sellers List
const SellerList = async (req, res) => {
	try {
		const sellers = await SellerModel.find({}).select(['-password', '-email']);
		res.json({ success: true, sellers });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Change Availability
const changeAvailablity = async (req, res) => {
	try {
		const SelId = req.userId || req.body.SelId;
		if (!SelId) {
			return res
				.status(400)
				.json({ success: false, message: 'Seller ID missing' });
		}

		const seller = await SellerModel.findById(SelId);
		if (!seller) {
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });
		}

		seller.available = !seller.available;
		await seller.save();

		res.json({
			success: true,
			message: 'Availability Changed',
			available: seller.available,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Seller Profile
const SellerProfile = async (req, res) => {
	try {
		const SelId = req.userId;
		if (!SelId) {
			return res
				.status(400)
				.json({ success: false, message: 'Seller ID missing' });
		}

		const profileData = await SellerModel.findById(SelId).select('-password');
		if (!profileData) {
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });
		}

		res.json({ success: true, profileData });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Update Seller Profile
const updateSellerProfile = async (req, res) => {
	try {
		const SelId = req.userId;
		if (!SelId) {
			return res
				.status(400)
				.json({ success: false, message: 'Seller ID missing' });
		}

		const { fees, address, available } = req.body;

		await SellerModel.findByIdAndUpdate(SelId, { fees, address, available });
		res.json({ success: true, message: 'Profile Updated' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Seller Dashboard
const SellerDashboard = async (req, res) => {
	try {
		const SelId = req.userId;
		if (!SelId) {
			return res
				.status(400)
				.json({ success: false, message: 'Seller ID missing' });
		}

		const appointments = await appointmentModel
			.find({ SelId })
			.populate('userId');

		let earnings = 0;
		const buyerset = new Set();

		appointments.forEach((item) => {
			if (item?.isCompleted || item?.payment) earnings += item.amount || 0;

			if (item?.userId) {
				const buyerId =
					typeof item.userId === 'object' ? item.userId._id : item.userId;
				if (buyerId) buyerset.add(buyerId.toString());
			}
		});

		const dashData = {
			earnings,
			appointments: appointments.length,
			buyers: buyerset.size,
			latestAppointments: appointments.slice(-5).reverse(),
		};

		res.json({ success: true, dashData });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Dashboard by Seller ID (admin)
const getSellerDashboardById = async (req, res) => {
	try {
		const sellerId = req.params.id;

		if (!sellerId.match(/^[0-9a-fA-F]{24}$/)) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid Seller ID format' });
		}

		const seller = await SellerModel.findById(sellerId);
		if (!seller)
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });

		const appointments = await appointmentModel
			.find({ SelId: sellerId })
			.populate('userId');

		let earnings = 0;
		const buyerset = new Set();

		appointments.forEach((item) => {
			if (item?.isCompleted || item?.payment) earnings += item.amount || 0;

			if (item?.userId) {
				const buyerId =
					typeof item.userId === 'object' ? item.userId._id : item.userId;
				if (buyerId) buyerset.add(buyerId.toString());
			}
		});

		const dashData = {
			earnings,
			appointments: appointments.length,
			buyers: buyerset.size,
			latestAppointments: appointments.slice(-5).reverse(),
		};

		res.json({ success: true, dashData });
	} catch (error) {
		console.error('getSellerDashboardById error:', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

// Get Seller Profile by ID (admin)
const getSellerProfileById = async (req, res) => {
	try {
		const sellerId = req.params.id;

		if (!sellerId.match(/^[0-9a-fA-F]{24}$/)) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid Seller ID format' });
		}

		const seller = await SellerModel.findById(sellerId).select('-password');
		if (!seller) {
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });
		}

		res.json({ success: true, seller });
	} catch (error) {
		console.error('getSellerProfileById error:', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

export {
	loginSeller,
	appointmentsSeller,
	appointmentCancel,
	SellerList,
	changeAvailablity,
	appointmentComplete,
	SellerDashboard,
	SellerProfile,
	updateSellerProfile,
	getSellerDashboardById,
	getSellerProfileById,
};
