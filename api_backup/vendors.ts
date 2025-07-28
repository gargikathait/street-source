import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const vendorId = req.query.vendorId as string || 'vendor_001';

  if (req.method === "GET") {
    const vendor = MockDatabase.getVendor(vendorId);
    if (!vendor) return res.status(404).json({ success: false, error: "Vendor not found" });
    return res.status(200).json({ success: true, data: vendor });
  }

  if (req.method === "PUT") {
    const updates = req.body;
    const updatedVendor = MockDatabase.updateVendor(vendorId, updates);
    if (!updatedVendor) return res.status(404).json({ success: false, error: "Vendor not found" });
    return res.status(200).json({ success: true, data: updatedVendor });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}