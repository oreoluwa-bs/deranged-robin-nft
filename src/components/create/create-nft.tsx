"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { SendTransactionResult } from "@wagmi/core";

export default function CreateNFT() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrepareMintModalOpen, setIsPrepareMintModalOpen] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predictionURI, setPredictionURI] = useState<string>();
  const [mintContract, setMintContract] =
    useState<SendTransactionResult | null>(null);
  const { address } = useAccount();

  const {
    config,
    error,
    isSuccess: isDonePreparing,
    status,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: derangedRobinContractJSON.abi,
    functionName: "safeMint",
    args: [address, predictionURI],
    enabled: Boolean(predictionURI && address),
  });

  const {
    isLoading: isMinting,
    isSuccess,
    data,
    error: trnError,
  } = useWaitForTransaction({
    hash: mintContract?.hash,
    onSuccess(data) {
      setIsPrepareMintModalOpen(false);

      // TOAST
      setTimeout(() => {
        // Open share modal
        setIsShareModalOpen(true);
      }, 1000);
    },
    onError(err) {
      // TOAST
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

    // Trigger mint
    setIsPrepareMintModalOpen(true);
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
            {/* <button
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white disabled:cursor-not-allowed"
              disabled={isPredicting || isMinting}
              onClick={() => {
                if (!prediction || !data || !predictionURI) return;
                // shareToExplore(prediction, data, predictionURI);
                setIsShareModalOpen(true);
              }}
            >
              Share
            </button> */}
          </div>
        </div>
        <div className="max-w-sdm">
          <GenerateNFTForm
            existingPrediction={prediction}
            onSuccess={(p) => setPrediction(p)}
          />
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        closeModal={() => setIsShareModalOpen(false)}
        data={{
          transactionReceipt: data!,
          prediction: prediction!,
          url: predictionURI!,
          address: address!,
        }}
      />

      <PrepareToMint
        isOpen={isPrepareMintModalOpen}
        closeModal={() => setIsPrepareMintModalOpen(false)}
        config={config}
        enableMint={isDonePreparing}
        onSuccess={(data) => {
          setMintContract(data);
        }}
      />
    </div>
  );
}

function ShareModal({
  isOpen,
  closeModal,
  data,
}: {
  isOpen: boolean;
  closeModal: () => void;
  data: {
    transactionReceipt: TransactionReceipt;
    url: string;
    prediction: Prediction;
    address: string;
  };
}) {
  async function shareToExplore(
    _pred: Prediction,
    data: TransactionReceipt,
    url: string,
    address: string
  ) {
    // Add to DB

    try {
      const response = await fetch("/api/explore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: url,
          creatorAddress: address,
          blockAddress: data.blockHash,
          transactionAddress: data.transactionHash,
          prompt: _pred.input.prompt,
        }),
      });

      const result = await response.json();

      if (response.status !== 201) {
        throw new Error(result.message);
      }

      // toast
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black  p-6 text-left align-middle text-white shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Share your NFT
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm ">
                    Let others try to guess what the NFT prompt was
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white  disabled:cursor-not-allowed"
                    onClick={() => {
                      shareToExplore(
                        data.prediction,
                        data.transactionReceipt,
                        data.url,
                        data.address
                      );
                    }}
                  >
                    Share
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function PrepareToMint({
  isOpen,
  closeModal,
  config,
  onSuccess,
  enableMint,
}: {
  isOpen: boolean;
  closeModal: () => void;
  config: any;
  enableMint: boolean;
  onSuccess: (data: SendTransactionResult) => void;
}) {
  const mintContract = useContractWrite(config);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black  p-6 text-left align-middle text-white shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  {!enableMint
                    ? "Preparing your transaction"
                    : "Let's get minty"}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {!enableMint
                      ? "Hold on we are preparing your transaction"
                      : "You're good to go"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white  disabled:cursor-not-allowed"
                    onClick={async () => {
                      try {
                        const res = await mintContract.writeAsync?.();

                        if (res) {
                          onSuccess(res);
                        }
                      } catch (error) {}
                    }}
                    disabled={!enableMint}
                  >
                    Mint my NFT
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
