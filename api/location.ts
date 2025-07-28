import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { lat, lng } = req.query;
    const locationData = MockDatabase.getLocationDetails({ lat, lng });
    return res.status(200).json({ success: true, data: locationData });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}