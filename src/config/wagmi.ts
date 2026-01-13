import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// WalletConnect project ID (powered by Reown)
const WALLETCONNECT_PROJECT_ID = '6b74931a5a85eee46c23ef4393ae2585';

export const config = getDefaultConfig({
  appName: 'Onchain Todo',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
