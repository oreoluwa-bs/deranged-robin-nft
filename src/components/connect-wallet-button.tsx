"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  //   useEnsAvatar,
  //   useEnsName,
} from "wagmi";

export default function ConnectWalletButton() {
  const { connect, connectors, error } = useConnect();

  const { address, isConnected } = useAccount();
  //   const { data: ensName } = useEnsName({ address });
  //   const { data: ensAvatar } = useEnsAvatar({ address });
  const { disconnect } = useDisconnect();

  const connector = connectors[0];

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
