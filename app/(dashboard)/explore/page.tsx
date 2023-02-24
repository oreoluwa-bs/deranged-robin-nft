import type { Nft } from "~/types";
import { fetcher } from "~/utils/fetcher";
import ExploreList from "./explore-list";

export default async function Explore() {
  const initalPosts: {
    message: string;
    data: {
      nfts: Nft[];
      cursor: string | undefined;
    };
  } = await fetcher(`${process.env.NEXT_PUBLIC_SITE_URL}/api/explore?limit=25`);
  return (
    <main className="min-h-[calc(100vh-170px)]">
      <section className="main-container">
        <div className="py-28">
          <h1 className="mb-2 text-3xl font-bold text-white lg:text-5xl">
            Explore
          </h1>
          <p>Guess and win a similar NFT</p>
        </div>
      </section>
      <section className="main-container">
        <ExploreList initialData={[initalPosts]} />
      </section>
    </main>
  );
}
