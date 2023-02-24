// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/db";
import { errorToErrorMessage } from "~/utils/format";
import { calculateGuessSimilarity } from "~/utils/nft";

type Data = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      const nft = await POST({
        id: req.query.id as string,
        guess: req.body.prompt,
      });

      res.status(200).json({ message: "success", data: nft });
    } else {
      // Handle any other HTTP method
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}

async function POST(input: { id: string; guess: string }) {
  const n = await prisma.nFT.findUnique({ where: { id: input.id } });

  if (!n) throw new Error("NFT not found");

  const isGuessSimilar = calculateGuessSimilarity(input.guess, n.prompt);

  const nft = await prisma.nFT.update({
    where: { id: input.id },
    data: {
      guessAttempts: { increment: 1 },
      ...(isGuessSimilar && { solvedCount: { increment: 1 } }),
    },
  });

  if (!isGuessSimilar) throw new Error("Guess is not quite right");

  return nft;
}
