"use client";

import Image from "next/image";
import { useState } from "react";
import { IoImagesOutline } from "react-icons/io5";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import derangedRobinContractJSON from "artifacts/contracts/DerangedRobin.sol/DerangedRobin.json";
import { Prediction } from "~/types";
import GenerateNFTForm from "./generate-nft-form";
import { getFileExtension } from "~/utils/format";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

export default function CreateNFT() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const [predictionURI, setPredictionURI] = useState<string>();
  const { address } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: derangedRobinContractJSON.abi,
    functionName: "safeMint",
    args: [address, predictionURI],
    enabled: Boolean(predictionURI && address),
  });

  const mintContract = useContractWrite(config);

  const {
    isLoading: isMinting,
    isSuccess,
    data,
  } = useWaitForTransaction({
    hash: mintContract.data?.hash,
    onSuccess(data) {
      // Open share modal
    },
  });

  const isPredicting = prediction
    ? prediction.status !== "succeeded" && prediction.status !== "failed"
    : false;

  async function mintNFT(_pred: Prediction) {
    // Transfer image from replicate to web3 storage
    const response = await fetch("/api/nft/generated/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: _pred.output[0],
        filename: `${_pred.id}.${getFileExtension(_pred.output[0])}`,
      }),
    });

    const {
      data: { imageURI, imageURL },
    } = await response.json();
    // console.log({ imageURI, imageURL });
    setPredictionURI(imageURL);

    // Mint;
    mintContract.write?.();
  }

  function shareToExplore(
    _pred: Prediction,
    data: TransactionReceipt,
    uri: string
  ) {
    // Add to DB
  }

  return (
    <div>
      {error?.message ? (
        <div className="mb-10">
          <div role="alert" className="rounded-md bg-red-500 px-4 py-2">
            {error?.message}
          </div>
        </div>
      ) : null}

      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50/5">
          {prediction?.status === "succeeded" ? (
            <Image
              src={prediction.output[0]}
              // src={predictionURI}
              alt={prediction.input.prompt}
              priority
              className="h-full w-full object-contain"
              fill
            />
          ) : null}

          {!prediction ? (
            <div className="flex h-full w-full items-center justify-center text-xl sm:text-2xl lg:text-3xl">
              <IoImagesOutline />
            </div>
          ) : null}

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 bg-black px-4 py-5 backdrop-blur-md">
            {/* Mint NFT */}
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white disabled:cursor-not-allowed"
              disabled={isPredicting || isMinting}
              onClick={() => {
                if (!prediction) return;
                mintNFT(prediction);
              }}
            >
              Mint
            </button>

            {/* Opens popup that pushes to explore */}
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white disabled:cursor-not-allowed"
              disabled={isPredicting || isMinting}
              onClick={() => {
                if (!prediction || !data || !predictionURI) return;
                shareToExplore(prediction, data, predictionURI);
              }}
            >
              Share
            </button>
          </div>
        </div>
        <div className="max-w-sdm">
          <GenerateNFTForm
            existingPrediction={prediction}
            onSuccess={(p) => setPrediction(p)}
          />
        </div>
      </div>
    </div>
  );
}
