// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
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
      const response = await GET(req.query as { id: string });

      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error.detail);
      }

      const prediction = await response.json();
      res.status(200).json({ message: "success", data: prediction });
    } else {
      // Handle any other HTTP method
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}

async function GET(input: { id: string }) {
  return fetch(`https://api.replicate.com/v1/predictions/${input.id}`, {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
}
