import { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";

import "../styles/globals.css";

import { CHAIN_ID } from "../utils/constants";
import { Header } from "../components/Header";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, goerli, polygonMumbai } from "wagmi/chains";
import {
  ConnectKitProvider,
  getDefaultClient,
  ConnectKitButton,
} from "connectkit";
import { siweClient } from "../utils/siweClient";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { infuraId } from "../constants/env";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, polygonMumbai],
  [infuraProvider({ apiKey: infuraId }), publicProvider()]
);

const walletConnectV2 = new WalletConnectConnector({
  chains,
  options: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
});

const metamask = new MetaMaskConnector({ chains });

const client = createClient(
  getDefaultClient({
    appName: "Chaos Wallet",
    infuraId,
    chains,
    connectors: [metamask, walletConnectV2],
  })
);

export default function MyApp({ Component, pageProps }: any) {
  return (
    <WagmiConfig client={client}>
      <siweClient.Provider>
        <ConnectKitProvider options={{ initialChainId: 0 }}>
          <main className={`sm:p-4 lg:p-20 `}>
            <script>{`/*


┌─┐┬ ┬┌─┐┌─┐┌─┐  ┬ ┬┌─┐┬  ┬  ┌─┐┌┬┐
│  ├─┤├─┤│ │└─┐  │││├─┤│  │  ├┤  │ 
└─┘┴ ┴┴ ┴└─┘└─┘  └┴┘┴ ┴┴─┘┴─┘└─┘ ┴ 


        */`}</script>
            <NextNProgress
              color={"rgba(0,0,0,.5)"}
              startPosition={0.125}
              stopDelayMs={200}
              height={2}
              showOnShallow
              options={{ showSpinner: false }}
            />
            <Header />
            <Toaster />
            <Component {...pageProps} />
          </main>
        </ConnectKitProvider>
      </siweClient.Provider>
    </WagmiConfig>
  );
}
