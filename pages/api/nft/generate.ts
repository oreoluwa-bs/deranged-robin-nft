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
    if (req.method === "POST") {
      // Process a POST request
      const response = await POST(req.body);

      if (response.status !== 201) {
        const error = await response.json();
        throw new Error(error.detail);
      }

      const prediction = await response.json();
      res.status(201).json({ message: "success", data: prediction });
    } else {
      // Handle any other HTTP method
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}

async function POST(input: { prompt: string; width: string; height: string }) {
  return fetch("https://api.replicate.com/v1/predictions", {
    body: JSON.stringify({
      version:
        "854e266e6660b98e601f310a5dc0cac633b826ba9514e5f2f3d47e856646f516",
      input: {
        prompt: input.prompt,
        image_dimensions: `${input.width}x${input.height}`,
      },
    }),
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}
