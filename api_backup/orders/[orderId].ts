import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  if (req.method === "GET") {
    const order = MockDatabase.getOrder(orderId as string);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    return res.status(200).json({ success: true, data: order });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}