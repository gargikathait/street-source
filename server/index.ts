import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGetVendors,
  handleGetVendor,
  handleGetAnalytics,
  handleCreateVendor,
  handleUpdateVendor
} from "./routes/vendors";
import * as apiRoutes from "./routes/api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Legacy Vendor API routes
  app.get("/api/vendors", handleGetVendors);
  app.get("/api/vendors/:id", handleGetVendor);
  app.post("/api/vendors", handleCreateVendor);
  app.put("/api/vendors/:id", handleUpdateVendor);
  app.get("/api/analytics", handleGetAnalytics);

  // New comprehensive API routes
  // Vendor Profile
  app.get('/api/vendor/profile/:vendorId?', apiRoutes.getVendorProfile);
  app.put('/api/vendor/profile/:vendorId?', apiRoutes.updateVendorProfile);

  // Location & Suppliers
  app.get('/api/suppliers/nearby', apiRoutes.getNearbySuppliers);
  app.get('/api/location', apiRoutes.getUserLocation);

  // Raw Materials
  app.get('/api/materials', apiRoutes.getRawMaterials);

  // Orders
  app.post('/api/orders', apiRoutes.createOrder);
  app.get('/api/orders/:vendorId?', apiRoutes.getOrders);
  app.put('/api/orders/:orderId/status', apiRoutes.updateOrderStatus);

  // Delivery Tracking
  app.get('/api/tracking/:orderId', apiRoutes.getTrackingInfo);

  // Payments
  app.post('/api/payments/process', apiRoutes.processPayment);

  // Analytics
  app.get('/api/analytics/vendor/:vendorId?', apiRoutes.getVendorAnalytics);

  // Notifications
  app.get('/api/notifications/:vendorId?', apiRoutes.getNotifications);

  return app;
}
