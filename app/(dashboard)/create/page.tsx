import CreateNFT from "~/components/create/create-nft";
import CreateNFTWrapper from "~/components/create/create-nft-wrapper";

export default function Create() {
  return (
    <main className="min-h-[calc(100vh-170px)]">
      <section className="main-container">
        <div className="mx-auto max-w-screen-lg py-28">
          <CreateNFTWrapper>
            <CreateNFT />
          </CreateNFTWrapper>
        </div>
      </section>
    </main>
  );
}
// 539.98px
