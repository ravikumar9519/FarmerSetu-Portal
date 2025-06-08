import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import SellerModel from "../models/SellerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";
import Razorpay from "razorpay";

// Initialize payment gateways
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Register user API
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing Details" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Please enter a valid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Please enter a strong password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Login user API
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get profile API
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Update profile API
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender)
      return res.json({ success: false, message: "Data Missing" });

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      await userModel.findByIdAndUpdate(userId, { image: uploadResult.secure_url });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Book appointment API
const bookAppointment = async (req, res) => {
  try {
    const { userId, SelId, slotDate, slotTime } = req.body;

    const seller = await SellerModel.findById(SelId).select("-password");
    if (!seller) return res.json({ success: false, message: "Seller not found" });
    if (!seller.available) return res.json({ success: false, message: "Seller Not Available" });

    let slotsBooked = seller.slots_booked || {};

    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot Not Available" });
    } else {
      slotsBooked[slotDate] = slotsBooked[slotDate] || [];
      slotsBooked[slotDate].push(slotTime);
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });

    const appointmentData = {
      userId,
      SelId,
      userData: user.toObject(),
      SelData: (() => {
        const selCopy = seller.toObject();
        delete selCopy.slots_booked;
        return selCopy;
      })(),
      amount: seller.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await SellerModel.findByIdAndUpdate(SelId, { slots_booked: slotsBooked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel appointment API
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.json({ success: false, message: "Appointment not found" });

    if (appointment.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const seller = await SellerModel.findById(appointment.SelId);
    let slotsBooked = seller.slots_booked || {};

    if (slotsBooked[appointment.slotDate]) {
      slotsBooked[appointment.slotDate] = slotsBooked[appointment.slotDate].filter(
        (slot) => slot !== appointment.slotTime
      );
    }

    await SellerModel.findByIdAndUpdate(appointment.SelId, { slots_booked: slotsBooked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// List user appointments API
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Razorpay payment order creation
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.cancelled)
      return res.json({ success: false, message: "Appointment Cancelled or not found" });

    const options = {
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Razorpay payment verification
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe payment session creation
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const origin = req.headers.origin;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.cancelled)
      return res.json({ success: false, message: "Appointment Cancelled or not found" });

    const currency = process.env.CURRENCY.toLowerCase();

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Appointment Fees" },
            unit_amount: appointment.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/verify?success=true&appointmentId=${appointment._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointment._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe payment verification
const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;

    if (success === "true") {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
      return res.json({ success: true, message: "Payment Successful" });
    }

    res.json({ success: false, message: "Payment Failed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
};
