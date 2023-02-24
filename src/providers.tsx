"use client";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

const { chains, provider, webSocketProvider } = configureChains(
  [process.env.NODE_ENV !== "production" ? goerli : mainnet],
  [
    publicProvider(),
    alchemyProvider({
      apiKey:
        process.env.NODE_ENV !== "production"
          ? process.env.ALCHEMY_GOERLI_API_KEY!
          : process.env.ALCHEMY_API_KEY!,
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors() {
    return [
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "DerangedNFT",
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),

      // new WalletConnectConnector({
      //   chains,
      //   options: {
      //     qrcode: true,
      //   },
      // }),
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
