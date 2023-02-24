"use client";

import Image from "next/image";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { useEnsName, useNetwork } from "wagmi";
import type { Nft } from "~/types";
import { fetcher } from "~/utils/fetcher";

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
  const { chain } = useNetwork();

  const ensName = useEnsName({
    address: nft.creatorAddress as `0x${string}`,
  });

  const blockexplorer = chain?.blockExplorers?.default;

  const blockAddressUrl = blockexplorer
    ? `${blockexplorer.url}/address/${nft.creatorAddress}`
    : "";

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="relative aspect-[1/0.85] w-full">
        <Image src={nft.imageUrl} alt="" fill className="object-cover" />
      </div>
      <div className="bg-black py-4 px-4">
        <div>
          <Link href={blockAddressUrl} className=" text-sm">
            {ensName.data ?? nft.creatorAddress}
          </Link>
        </div>
        <div className="mt-5 flex items-center justify-end">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-2 py-1 text-sm font-medium text-white">
            Guess the prompt
          </button>
        </div>
      </div>
    </div>
  );
}
