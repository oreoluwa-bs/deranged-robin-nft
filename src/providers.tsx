"use client";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, hardhat } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, provider, webSocketProvider } = configureChains(
  [hardhat],
  [publicProvider()]
  //   [alchemyProvider({ apiKey: "yourAlchemyApiKey" })]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors() {
    return [
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ];
  },
});

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
