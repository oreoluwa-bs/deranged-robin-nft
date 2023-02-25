import { GET } from "pages/api/explore";
import type { Nft } from "~/types";
// import { fetcher } from "~/utils/fetcher";
import ExploreList from "./explore-list";

export default async function Explore() {
  const initalPost = await GET({ limit: 25 });

  return (
    <main className="min-h-[calc(100vh-170px)]">
      <section className="main-container">
        <div className="py-28 pb-10">
          <h1 className="mb-2 text-3xl font-bold text-white lg:text-5xl">
            Explore
          </h1>
          <p>Guess and win a similar NFT</p>
        </div>
      </section>
      <section className="main-container">
        <ExploreList
          initialData={[
            {
              message: "success",
              data: {
                nfts: initalPost.nfts as Nft[],
                cursor: initalPost.nextCursor ?? undefined,
              },
            },
          ]}
        />
      </section>
    </main>
  );
}
