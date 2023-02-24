// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { throws } from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/db";
import { errorToErrorMessage } from "~/utils/format";

type Data = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      // Process a POST request
      const nft = await GET(req.query as { id: string });

      res.status(200).json({ message: "success", data: nft });
    } else {
      // Handle any other HTTP method
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}

async function GET(input: { id: string }) {
  const nft = await prisma.nFT.findUnique({ where: { id: input.id } });

  if (!nft) throw new Error("");

  return nft;
}
