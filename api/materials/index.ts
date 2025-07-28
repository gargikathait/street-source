import { NextApiRequest, NextApiResponse } from "next";
import { MockDatabase } from ../../shared/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const materials = MockDatabase.getAvailableMaterials();
    return res.status(200).json({ success: true, data: materials });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}
