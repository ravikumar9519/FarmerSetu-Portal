import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';

import appointmentModel from '../models/appointmentModel.js';
import SellerModel from '../models/SellerModel.js';
import userModel from '../models/userModel.js';

/* --------------------------- ADMIN AUTH --------------------------- */
const loginAdmin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign(email + password, process.env.JWT_SECRET);
			res.json({ success: true, token });
		} else {
			res.json({ success: false, message: 'Invalid credentials' });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

/* --------------------------- APPOINTMENT APIs --------------------------- */
const appointmentsAdmin = async (req, res) => {
	try {
		const appointments = await appointmentModel.find({});
		res.json({ success: true, appointments });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};
const appointmentCancel = async (req, res) => {
	try {
		const { appointmentId } = req.body;
		await appointmentModel.findByIdAndUpdate(appointmentId, {
			cancelled: true,
		});
		res.json({ success: true, message: 'Appointment Cancelled' });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

/* --------------------------- SELLER APIs --------------------------- */
const addSeller = async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			speciality,
			degree,
			experience,
			about,
			fees,
			address,
		} = req.body;
		const imageFile = req.file;

		if (
			!name ||
			!email ||
			!password ||
			!speciality ||
			!degree ||
			!experience ||
			!about ||
			!fees ||
			!address
		) {
			return res.json({ success: false, message: 'Missing Details' });
		}

		if (!validator.isEmail(email)) {
			return res.json({
				success: false,
				message: 'Please enter a valid email',
			});
		}

		if (password.length < 8) {
			return res.json({
				success: false,
				message: 'Please enter a strong password',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
			resource_type: 'image',
		});
		const imageUrl = imageUpload.secure_url;

		const SellerData = {
			name,
			email,
			image: imageUrl,
			password: hashedPassword,
			speciality,
			degree,
			experience,
			about,
			fees,
			address: JSON.parse(address),
			date: Date.now(),
		};

		const newSeller = new SellerModel(SellerData);
		await newSeller.save();
		res.json({ success: true, message: 'Seller Added' });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const allSeller = async (req, res) => {
	try {
		const Seller = await SellerModel.find({}).select('-password');
		res.json({ success: true, Seller });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const getSellerById = async (req, res) => {
	try {
		const sellerId = req.params.id;
		const seller = await SellerModel.findById(sellerId).select('-password');

		if (!seller) {
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });
		}

		res.json({ success: true, seller });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const updateSeller = async (req, res) => {
	try {
		const sellerId = req.params.id;
		const {
			name,
			email,
			speciality,
			degree,
			experience,
			about,
			fees,
			address,
		} = req.body;

		let parsedAddress = address;
		if (address && typeof address === 'string') {
			try {
				parsedAddress = JSON.parse(address);
			} catch (err) {
				return res
					.status(400)
					.json({ success: false, message: 'Invalid address format' });
			}
		}

		const seller = await SellerModel.findById(sellerId);
		if (!seller) {
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });
		}

		if (name) seller.name = name;
		if (email) seller.email = email;
		if (speciality) seller.speciality = speciality;
		if (degree) seller.degree = degree;
		if (experience) seller.experience = experience;
		if (about) seller.about = about;
		if (fees) seller.fees = fees;
		if (parsedAddress) seller.address = parsedAddress;

		if (req.file) {
			const imageUpload = await cloudinary.uploader.upload(req.file.path, {
				resource_type: 'image',
			});
			seller.image = imageUpload.secure_url;
		}

		const updatedSeller = await seller.save();
		res.status(200).json({ success: true, seller: updatedSeller });
	} catch (error) {
		console.error('Update Seller Error:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const deleteSeller = async (req, res) => {
	try {
		const sellerId = req.params.id;
		const deletedSeller = await SellerModel.findByIdAndDelete(sellerId);
		if (!deletedSeller) {
			return res
				.status(404)
				.json({ success: false, message: 'Seller not found' });
		}

		res
			.status(200)
			.json({ success: true, message: 'Seller deleted successfully' });
	} catch (error) {
		console.error('Delete Seller Error:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

/* --------------------------- BUYER APIs --------------------------- */
const getAllBuyers = async (req, res) => {
	try {
		const buyers = await userModel.find({}).select('-password');
		res.json({ success: true, buyers });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const getBuyerById = async (req, res) => {
	try {
		const buyer = await userModel.findById(req.params.id).select('-password');
		if (!buyer) {
			return res
				.status(404)
				.json({ success: false, message: 'Buyer not found' });
		}
		res.json({ success: true, buyer });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const deleteBuyer = async (req, res) => {
	try {
		const buyerId = req.params.id;
		const deletedBuyer = await userModel.findByIdAndDelete(buyerId);
		if (!deletedBuyer) {
			return res
				.status(404)
				.json({ success: false, message: 'Buyer not found' });
		}

		res
			.status(200)
			.json({ success: true, message: 'Buyer deleted successfully' });
	} catch (error) {
		console.error('Delete Buyer Error:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const updateBuyer = async (req, res) => {
	try {
		const buyerId = req.params.id;
		const { name, email, phone, gender, dob } = req.body;
		let address = req.body.address;

		if (address && typeof address === 'string') {
			try {
				address = JSON.parse(address);
			} catch (err) {
				return res
					.status(400)
					.json({ success: false, message: 'Invalid address format' });
			}
		}

		const buyer = await userModel.findById(buyerId);
		if (!buyer) {
			return res
				.status(404)
				.json({ success: false, message: 'Buyer not found' });
		}

		if (name) buyer.name = name;
		if (email) buyer.email = email;
		if (phone) buyer.phone = phone;
		if (gender) buyer.gender = gender;
		if (dob) buyer.dob = dob;
		if (address) buyer.address = address;

		if (req.file) {
			buyer.image = req.file.path;
		}

		const updatedBuyer = await buyer.save();
		res.status(200).json({ success: true, buyer: updatedBuyer });
	} catch (error) {
		console.error('Update Buyer Error:', error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

/* --------------------------- DASHBOARD --------------------------- */
const adminDashboard = async (req, res) => {
	try {
		// Parallel queries for performance
		//logger.info('Fetching admin dashboard data...');
		const [
			totalSellers,
			totalBuyers,
			totalAppointments,
			completedAppointments,
			cancelledAppointments,
			latestAppointments,
			topCategoriesAggregation,
		] = await Promise.all([
			SellerModel.countDocuments(),
			userModel.countDocuments(),
			appointmentModel.countDocuments(),
			appointmentModel.countDocuments({ isCompleted: true }),
			appointmentModel.countDocuments({ cancelled: true }),
			appointmentModel.find({}).sort({ date: -1 }).limit(10),
			// Aggregate top categories based on seller speciality
			appointmentModel.aggregate([
				{
					$match: {
						isCompleted: true,
						SelId: { $regex: /^[0-9a-fA-F]{24}$/ }, // Filter valid ObjectId strings
					},
				},
				{
					$addFields: {
						SelObjectId: { $toObjectId: '$SelId' }, // Create a new ObjectId field for lookup
					},
				},
				{
					$lookup: {
						from: 'sellers', // ✅ Correct collection name
						localField: 'SelObjectId',
						foreignField: '_id',
						as: 'seller',
					},
				},
				{
					$unwind: {
						path: '$seller',
						preserveNullAndEmptyArrays: false, // Skip if no match in sellers
					},
				},
				{
					$group: {
						_id: '$seller.speciality', // Group by seller speciality
						count: { $sum: 1 },
					},
				},
				{
					$project: {
						category: '$_id',
						count: 1,
						_id: 0,
					},
				},
				{
					$sort: {
						count: -1,
						category: 1,
					},
				},
				{
					$limit: 5,
				},
			]),
		]);

		const dashData = {
			sellers: totalSellers,
			buyers: totalBuyers,
			appointments: totalAppointments,
			completedAppointments,
			cancelledAppointments,
			latestAppointments,
			topCategories: topCategoriesAggregation,
		};

		res.status(200).json({ success: true, dashData });
	} catch (error) {
		console.error('Admin Dashboard Error:', error);
		res
			.status(500)
			.json({ success: false, message: 'Failed to fetch dashboard data' });
	}
};

/* --------------------------- EXPORTS --------------------------- */
export {
	loginAdmin,
	appointmentsAdmin,
	appointmentCancel,
	addSeller,
	allSeller,
	getSellerById,
	updateSeller,
	deleteSeller,
	getAllBuyers,
	getBuyerById,
	updateBuyer,
	deleteBuyer,
	adminDashboard,
};
