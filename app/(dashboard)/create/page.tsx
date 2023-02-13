import { HiArrowRight } from "react-icons/hi2";

export default function Create() {
  return (
    <main className="min-h-[calc(100vh-170px)]">
      <section className="main-container">
        <div className="mx-auto max-w-screen-lg py-28">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 bg-black px-4 py-5 backdrop-blur-md">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white">
                  Mint
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white">
                  Share
                </button>
              </div>
            </div>
            <div className="max-w-sdm">
              <form>
                <div>
                  <textarea className="min-h-[150px] w-full rounded-lg bg-slate-50/10" />
                </div>
                <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white">
                  Generate
                  <HiArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
// 539.98px
