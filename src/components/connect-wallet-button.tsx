"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  //   useEnsAvatar,
  //   useEnsName,
} from "wagmi";

export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};

export default function ConnectWalletButton() {
  const isMounted = useIsMounted();
  const { connect, connectors, error } = useConnect();

  const { address, isConnected } = useAccount();
  //   const { data: ensName } = useEnsName({ address });
  //   const { data: ensAvatar } = useEnsAvatar({ address });
  const { disconnect } = useDisconnect();

  const connector = connectors[0];

  if (!isMounted) return null;

  return (
    <>
      {isConnected ? (
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white"
          onClick={() => disconnect()}
        >
          <div className="max-w-[100px] truncate">{address}</div>
          {/* <div>Connected to {connector.name}</div> */}
        </button>
      ) : (
        <button
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white"
          //   disabled={connector.ready !== true}
          onClick={() => connect({ connector })}
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}
