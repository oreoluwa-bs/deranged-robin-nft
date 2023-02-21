"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const { connect, connectors, error } = useConnect();

  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setIsOpen(false);
    },
  });
  //   const { data: ensName } = useEnsName({ address });
  //   const { data: ensAvatar } = useEnsAvatar({ address });
  const { disconnect } = useDisconnect();

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
          onClick={() => setIsOpen(true)}
        >
          Connect Wallet
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black  p-6 text-left align-middle text-white shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Connect your wallet
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm ">Pick a provider</p>
                  </div>

                  <div className="mt-4">
                    <ul className="grid gap-4">
                      {connectors.map((connector) => {
                        return (
                          <li key={connector.id}>
                            <button
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white"
                              //   disabled={connector.ready !== true}
                              onClick={() => connect({ connector })}
                            >
                              {connector.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
