import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const paymentDetails = req.body;
    const result = MockDatabase.processPayment(paymentDetails);
    return res.status(200).json({ success: true, data: result });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}