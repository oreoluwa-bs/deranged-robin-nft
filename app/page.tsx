import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-170px)]">
      <section aria-label="hero">
        <div className="main-container py-28">
          <h1 className="text-center text-5xl font-bold text-white lg:text-6xl">
            Turn a phrase to an NFT
            <span className="block text-blue-400">using AI</span>
          </h1>
          <p className="mx-auto mt-10 max-w-lg text-center">
            Make the coolest NFT you could think off from a phrase - Let others
            guess what the phase is.
          </p>
          <div className="text-center">
            <Link
              href="/create"
              className=" mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white"
            >
              Get Started
              <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
// 539.98px
