import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="main-container flex items-center justify-between py-6 text-sm">
        <div>
          <p className="text-slate-400">
            Powered by{" "}
            <Link href="https://vercel.com" className="hover:text-white">
              Vercel
            </Link>
            ,{" "}
            <Link href="https://vercel.com" className="hover:text-white">
              Replicate
            </Link>{" "}
            and{" "}
            <Link href="https://vercel.com" className="hover:text-white">
              Alchemy
            </Link>
          </p>
        </div>
        <div>
          <p className="text-slate-400">
            Made by{" "}
            <Link href="https://oreoluwabs.com" className="hover:text-white">
              Oreoluwa
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
