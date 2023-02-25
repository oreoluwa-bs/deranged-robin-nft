import Image from "next/image";
// import { Rammetto_One } from "@next/font/google";
import Link from "next/link";
import ConnectWalletButton from "~/components/connect-wallet-button";

// const permanentMarker = Rammetto_One({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-marker",
// });

export default function Navbar() {
  return (
    <header>
      <div className="main-container flex items-center justify-between py-6">
        <Link href="/" className="inline-flex items-center gap-2 font-bold">
          <Image
            src="/a-deranged-robin.png"
            alt="DERANGED ROBIN NFT"
            width={48}
            height={48}
            priority
          />
          <span className={`hidden text-base md:inline-block `}>
            DERANGED ROBIN NFT
          </span>
        </Link>

        <div className="flex items-center gap-5 lg:gap-10">
          <nav className="inline-flex items-center gap-5 lg:gap-8">
            <ul>
              <li>
                <Link href="/explore" className="text-slate-400">
                  Explore
                </Link>
              </li>
            </ul>
          </nav>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
