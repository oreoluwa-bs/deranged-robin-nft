// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/lib/db";
import { errorToErrorMessage } from "~/utils/format";
import {
  addWordsToDictionary,
  calculateDifficulty,
  cosineSimilarity,
  wordFrequency,
  wordFrequencyToVector,
} from "~/utils/nft";

type Data = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const sentenceOne = "Queen name aint right";
    const sentenceTwo = "Drake is a pretty boi";

    const dic = {
      ...addWordsToDictionary(wordFrequency(sentenceOne)),
      ...addWordsToDictionary(wordFrequency(sentenceTwo)),
    };

    const vec = {
      vectorA: wordFrequencyToVector(wordFrequency(sentenceOne), dic),
      vectorB: wordFrequencyToVector(wordFrequency(sentenceTwo), dic),
    };

    res.status(200).json({
      message: "success",
      data: {
        freq: {
          one: wordFrequency(sentenceOne),
          two: wordFrequency(sentenceTwo),
        },
        dic,
        vec,
        similarity: cosineSimilarity(vec.vectorA, vec.vectorB),
      },
    });
  } catch (error) {
    res.status(500).json({ message: errorToErrorMessage(error), data: null });
  }
}
