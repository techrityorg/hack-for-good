import './App.css';
//wallet import
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  trustWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { Main } from './pages/main';
import './index.css'
import { publicProvider } from 'wagmi/providers/public';
import { polygon, polygonMumbai } from 'wagmi/chains'

const projectId = "274de4271228fdd69013c56274f0e688";
const { chains, publicClient } = configureChains(
  [polygon, polygonMumbai],
  [
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
    ]
  },
  {
    groupName: 'Others',
    wallets: [
      coinbaseWallet({ chains, 
        appName: 'Spacetar | A Community Empowering Mental Well-Being' }),
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
]);


const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

// window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  return (
    <>
<WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
      theme={lightTheme({
        accentColor: '#1570ef',
        accentColorForeground: 'white',
        borderRadius: 'small',
        fontStack: 'system',
        overlayBlur: 'small'
      },
      )}
      chains={chains}>
        <Main />
      </RainbowKitProvider>
      </WagmiConfig>

    </>
  );
}

export default App;
