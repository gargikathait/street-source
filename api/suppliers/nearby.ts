import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const location = req.query.location as string;

  if (req.method === "GET") {
    if (!location) return res.status(400).json({ error: "Location is required" });
    const suppliers = MockDatabase.getNearbySuppliers(location);
    return res.status(200).json({ success: true, data: suppliers });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}