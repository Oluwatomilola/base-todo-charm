import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// WalletConnect project ID (powered by Reown)
// For production, get your own at https://cloud.reown.com
const WALLETCONNECT_PROJECT_ID = '3a8170812b534d0ff9d794f19a901d64';

export const config = getDefaultConfig({
  appName: 'Onchain Todo',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
