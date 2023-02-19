// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage } from "web3.storage";
import {
  errorToErrorMessage,
  makeGatewayURI,
  makeGatewayURL,
} from "~/utils/format";

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY! });

type Data = {
  message: string;
  data: {
    imageURI: string;
    imageURL: string;
  } | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      const cid = await POST(req.body);

      if (!cid) {
        throw new Error("Error generating CID");
      }

      res.status(201).json({
        message: "success",
        data: {
          imageURI: makeGatewayURI(cid, `NFT-${req.body.filename}`),
          imageURL: makeGatewayURL(cid, `NFT-${req.body.filename}`), // http accessible
        }, // stores uri
      });
    } else {
      // Handle any other HTTP method
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}

async function POST(input: { url: string; filename: string }) {
  const imageFile = await fetch(input.url);
  const contentType = imageFile.headers.get("Content-Type");
  const blob = await imageFile.blob();
  const file = new File([blob], input.filename, {
    type: contentType ?? undefined,
  });

  // FETCH
  return client.put([file], {
    name: `NFT-${input.filename}`,
    maxRetries: 3,
  });
}
