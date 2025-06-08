import express from 'express';
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addSeller,
  allSeller,
  adminDashboard,
  getSellerById,
  updateSeller,
  deleteSeller,
  getAllBuyers,
  getBuyerById,
  deleteBuyer,
  updateBuyer,
} from '../controllers/adminController.js';

import { changeAvailablity } from '../controllers/SellerController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();


// =================== Admin Auth Routes ===================
adminRouter.post("/login", loginAdmin);


// =================== Seller Management ===================
adminRouter.post("/add-seller", authAdmin, upload.single('image'), addSeller);
adminRouter.get("/all-seller", authAdmin, allSeller);
adminRouter.get("/seller-profile/:id", authAdmin, getSellerById);
adminRouter.put("/seller-profile/:id", authAdmin, upload.single('image'), updateSeller);
adminRouter.delete("/seller-profile/:id", authAdmin, deleteSeller);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);


// =================== Appointment Management ===================
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);


// =================== Dashboard ===================
adminRouter.get("/dashboard", authAdmin, adminDashboard);


// =================== Buyer Management ===================
adminRouter.get("/all-buyers", authAdmin, getAllBuyers);
adminRouter.get("/buyer-profile/:id", authAdmin, getBuyerById);
adminRouter.put("/buyer-profile/:id", authAdmin, upload.single('image'), updateBuyer);
adminRouter.delete("/buyer-profile/:id", authAdmin, deleteBuyer);


export default adminRouter;
