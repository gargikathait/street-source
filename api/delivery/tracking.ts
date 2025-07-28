import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderId = req.query.orderId as string;

  if (req.method === "GET") {
    const tracking = MockDatabase.getDeliveryTracking(orderId);
    return res.status(200).json({ success: true, data: tracking });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}
