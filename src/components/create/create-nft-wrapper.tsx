"use client";
import { useEffect, useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { useAccount } from "wagmi";
import ConnectWalletButton from "~/components/connect-wallet-button";

export default function CreateNFTWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div>
      {mounted ? (
        <Child>{children}</Child>
      ) : (
        <div className="flex items-center justify-center text-center">
          <CgSpinnerTwo className="animate-spin text-4xl" />
        </div>
      )}
    </div>
  );
}
// 539.98px

function Child({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <>
      {!address ? (
        <div className="flex items-center justify-center text-center">
          <div className="text-center">
            <p>To continue please connect your wallet</p>
            <div className="mt-5 flex items-center justify-center text-center">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
