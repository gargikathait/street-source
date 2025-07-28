import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const orders = MockDatabase.getOrders();
    return res.status(200).json({ success: true, data: orders });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}