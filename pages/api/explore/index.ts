// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/db";
import { errorToErrorMessage } from "~/utils/format";
import { calculateDifficulty } from "~/utils/nft";

type Data = {
  message: string;
  data: Awaited<ReturnType<typeof GET | typeof POST>> | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    let response = null;
    switch (req.method) {
      case "POST":
        // Process a POST request
        response = await POST(req.body as Parameters<typeof POST>[0]);

        res.status(201).json({ message: "success", data: response });
        break;

      case "GET":
        response = await GET(req.query as unknown as Parameters<typeof GET>[0]);

        // console.log(req.query);
        // console.log(response);

        res.status(200).json({ message: "success", data: response });
        break;

      // Handle any other HTTP method
      default:
        throw new Error("Method not allowed");
        break;
    }
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}

async function POST(input: {
  imageUrl: string;
  creatorAddress: string;
  blockAddress: string;
  transactionAddress: string;
  prompt: string;
  // meta:         {}
}) {
  const post = await prisma.nFT.create({ data: input });

  return post;
}

export async function GET(input: {
  cursor?: string | null;
  limit: number | string;
}) {
  const { cursor, limit = 30 } = input;

  console.log(input);

  const nfts = await prisma.nFT.findMany({
    take: Number(limit) + 1,
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      id: true,
      imageUrl: true,
      blockAddress: true,
      creatorAddress: true,
      guessAttempts: true,
      solvedCount: true,
      meta: true,
    },
  });

  let nextCursor: typeof cursor;

  if (nfts.length > limit) {
    const nextItem = nfts.pop();
    if (nextItem) {
      nextCursor = nextItem.id;
    }
  }

  return {
    nfts: nfts.map((item) => ({
      ...item,
      difficulty: calculateDifficulty(item.guessAttempts, item.solvedCount),
    })),
    nextCursor,
  };
}
