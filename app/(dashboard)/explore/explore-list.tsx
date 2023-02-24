"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import { useEnsName, useNetwork } from "wagmi";
import type { Nft } from "~/types";
import { fetcher } from "~/utils/fetcher";
import { errorToErrorMessage } from "~/utils/format";

interface RootObject {
  message: string;
  data: {
    nfts: Nft[];
    cursor: string | undefined;
  };
}

const getKey = (pageIndex: number, previousPageData: RootObject) => {
  // reached the end
  if (previousPageData && !previousPageData.data.cursor) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/api/explore?limit=25`;

  // add the cursor to the API endpoint
  return `/api/explore?cursor=${previousPageData.data.cursor}&limit=25`;
};

interface ExploreListProps {
  initialData?: RootObject[];
}

export default function ExploreList({ initialData }: ExploreListProps) {
  const { data, size, setSize } = useSWRInfinite<RootObject>(getKey, fetcher, {
    fallbackData: initialData,
  });

  return (
    <div>
      {data?.map((item, ind) => {
        return (
          <ul
            key={ind}
            className="grid grid-cols-[repeat(auto-fill,_minmax(min(300px,_100%),_1fr))] gap-5"
          >
            {item.data.nfts.map((nft) => {
              return (
                <li key={nft.id}>
                  <PostCard nft={nft} />
                </li>
              );
            })}
          </ul>
        );
      })}

      {data?.[data.length - 1].data.cursor ? (
        <div>
          <button
            className="mx-auto mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white lg:w-[unset]"
            onClick={() => setSize(size + 1)}
          >
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PostCard({ nft }: { nft: Nft }) {
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const { chain } = useNetwork();
  const router = useRouter();

  const ensName = useEnsName({
    address: nft.creatorAddress as `0x${string}`,
  });

  const blockexplorer = chain?.blockExplorers?.default;

  const blockAddressUrl = blockexplorer
    ? `${blockexplorer.url}/address/${nft.creatorAddress}`
    : "";

  function getDifficultyColor(color: typeof nft.difficulty) {
    let textColor = "text-white";
    switch (color) {
      case "Very Easy":
      case "Easy":
        textColor = "text-green-400";
        break;

      case "Medium":
        textColor = "text-yellow-400";
        break;

      case "Hard":
      case "Very Hard":
        textColor = "text-red-400";
        break;

      default:
        break;
    }

    return textColor;
  }

  const difficultyColor = getDifficultyColor(nft.difficulty);
  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
        <span
          className={`absolute top-4 left-4 z-10 rounded-lg border-white bg-black px-2 py-2  text-sm ${difficultyColor} `}
        >
          {nft.difficulty}
        </span>
        <div className="relative aspect-[1/0.85] w-full">
          <Image src={nft.imageUrl} alt="" fill className="object-cover" />
        </div>
        <div className="bg-black py-4 px-4">
          <div className="min-w-0">
            <Link href={blockAddressUrl} className="block truncate text-sm">
              {ensName.data ?? nft.creatorAddress}
            </Link>
          </div>
          <div className="mt-5 flex items-center justify-end">
            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-2 py-1 text-sm font-medium text-white"
              onClick={() => setIsGuessModalOpen(true)}
            >
              Guess the prompt
            </button>
          </div>
        </div>
      </div>

      <GuessNFT
        isOpen={isGuessModalOpen}
        closeModal={() => setIsGuessModalOpen(false)}
        onSuccess={(data) => {
          //   console.log(data);
          toast.success("Guess the prompt", {
            description: "You win!!! 🚀",
            important: true,
            action: {
              label: "Mint NFT",
              onClick() {
                router.push(`/create?prompt=${data.prompt}`);
              },
            },
          });

          setTimeout(() => {
            router.push(`/create?prompt=${data.prompt}`);
          }, 600);
        }}
        nft={nft}
      />
    </>
  );
}

function GuessNFT({
  isOpen,
  closeModal,
  onSuccess,
  nft,
}: {
  isOpen: boolean;
  closeModal: () => void;
  nft: Nft;
  onSuccess: (data: Nft & { prompt: string }) => void;
}) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/explore/${nft.id}/guess`,
    (url: string, { arg }: any) => {
      return fetcher(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
    {
      onSuccess(data) {
        onSuccess(data.data);
      },
      onError(err) {
        toast.error("Guess the prompt", {
          description: errorToErrorMessage(err),
          important: true,
        });
      },
    }
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!e.target) return;

    const formdata = new FormData(e.target as HTMLFormElement);
    const fields = Object.fromEntries(formdata) as {
      guess: string;
    };

    // console.log(fields);

    await trigger(fields);
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-black  p-6 text-left align-middle text-white shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Guess the prompt
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Guess the prompt and win a similar NFT
                  </p>
                </div>

                <div className="mt-4">
                  <div className="relative aspect-[1/0.85] w-full overflow-hidden rounded-lg">
                    <Image
                      src={nft.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* {error?.message ? (
                  <div className="mt-10">
                    <div
                      role="alert"
                      className="rounded-md bg-red-500 px-4 py-2"
                    >
                      {error.message}
                    </div>
                  </div>
                ) : null} */}
                <form onSubmit={onSubmit} className="mt-4">
                  <div className="grid gap-2">
                    <div>
                      <textarea
                        name="guess"
                        id="guess"
                        className="min-h-[80px] w-full rounded-lg bg-slate-50/10 px-2 py-2"
                        placeholder="Enter your guess and win a similar NFT"
                        required
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white  disabled:cursor-not-allowed"
                        disabled={isMutating}
                      >
                        Take a guess
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
