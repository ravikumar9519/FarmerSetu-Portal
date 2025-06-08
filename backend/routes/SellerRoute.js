import express from 'express';
import {
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
  getSellerProfileById, // <-- Make sure this is imported
} from '../controllers/SellerController.js';

import authSeller from '../middleware/authSeller.js';

const SellerRouter = express.Router();

SellerRouter.post("/login", loginSeller);
SellerRouter.post("/cancel-appointment", authSeller, appointmentCancel);
SellerRouter.get("/appointments", authSeller, appointmentsSeller);
SellerRouter.get("/list", SellerList);
SellerRouter.post("/change-availability", authSeller, changeAvailablity);
SellerRouter.post("/complete-appointment", authSeller, appointmentComplete);
SellerRouter.get("/profile", authSeller, SellerProfile);
SellerRouter.post("/update-profile", authSeller, updateSellerProfile);

// Existing dashboard routes
SellerRouter.get("/dashboard", authSeller, SellerDashboard);
SellerRouter.get("/dashboard/:id", authSeller, getSellerDashboardById);

// **Add this to fix 404 on /profile/:id**
SellerRouter.get("/profile/:id", authSeller, getSellerProfileById);

export default SellerRouter;
