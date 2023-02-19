"use client";

import Image from "next/image";
import { useState } from "react";
import { IoImagesOutline } from "react-icons/io5";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import derangedRobinContractJSON from "artifacts/contracts/DerangedRobin.sol/DerangedRobin.json";
import { Prediction } from "~/types";
import GenerateNFTForm from "./generate-nft-form";

export default function CreateNFT() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predictionURI, setPredictionURI] = useState<string>();
  const { address, isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: derangedRobinContractJSON.abi,
    functionName: "safeMint",
    args: [address, predictionURI],
    enabled: Boolean(predictionURI && address),
  });

  const { data, write } = useContractWrite(config);

  const isPredicting = prediction
    ? prediction.status !== "succeeded" && prediction.status !== "failed"
    : false;

  function mintNFT(_pred: Prediction) {
    // Transfer image from replicate to web3 storage
    // Mint
    // write?.();
    // Open share modal
  }

  function shareToExplore(_pred: Prediction) {
    // Add to DB
  }

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white/5">
        {prediction?.status === "succeeded" ? (
          <Image
            src={prediction.output[0]}
            alt={prediction.input.prompt}
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
            disabled={isPredicting}
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
            disabled={isPredicting}
            onClick={() => {
              if (!prediction) return;
              shareToExplore(prediction);
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
  );
}
