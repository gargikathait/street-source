import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const newOrder = req.body;
    const createdOrder = MockDatabase.createOrder(newOrder);
    return res.status(201).json({ success: true, data: createdOrder });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}