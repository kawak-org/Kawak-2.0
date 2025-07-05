import { useState, useEffect } from 'react';

export interface MetaMaskStatus {
  isConnected: boolean;
  address: string;
  network: string;
  balance: string;
  chainId: number;
  isLoading: boolean;
}

export const useMetaMaskStatus = () => {
  const [status, setStatus] = useState<MetaMaskStatus>({
    isConnected: false,
    address: '',
    network: '',
    balance: '',
    chainId: 0,
    isLoading: true,
  });

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia';
      case 84532:
        return 'Base Sepolia';
      case 8453:
        return 'Base Mainnet';
      case 137:
        return 'Polygon';
      case 80001:
        return 'Mumbai';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  const formatBalance = (balance: string): string => {
    try {
      // Convert hex balance to decimal and format
      const balanceDecimal = parseInt(balance, 16);
      const etherBalance = balanceDecimal / Math.pow(10, 18);
      return etherBalance.toFixed(4);
    } catch (error) {
      return '0.0000';
    }
  };

  const updateStatus = async () => {
    if (typeof window.ethereum === 'undefined') {
      setStatus({
        isConnected: false,
        address: '',
        network: '',
        balance: '',
        chainId: 0,
        isLoading: false,
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdNumber = parseInt(chainId, 16);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });

        setStatus({
          isConnected: true,
          address,
          network: getNetworkName(chainIdNumber),
          balance: formatBalance(balance),
          chainId: chainIdNumber,
          isLoading: false,
        });
      } else {
        setStatus({
          isConnected: false,
          address: '',
          network: '',
          balance: '',
          chainId: 0,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error updating MetaMask status:', error);
      setStatus({
        isConnected: false,
        address: '',
        network: '',
        balance: '',
        chainId: 0,
        isLoading: false,
      });
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return false;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        await updateStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  };

  const switchToBaseSepolia = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }], // Base Sepolia chain ID
      });
      await updateStatus();
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x14a34',
                chainName: 'Base Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org'],
              },
            ],
          });
          await updateStatus();
          return true;
        } catch (addError) {
          console.error('Error adding Base Sepolia:', addError);
          return false;
        }
      }
      console.error('Error switching to Base Sepolia:', switchError);
      return false;
    }
  };

  useEffect(() => {
    updateStatus();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', updateStatus);
      window.ethereum.on('chainChanged', updateStatus);
      window.ethereum.on('connect', updateStatus);
      window.ethereum.on('disconnect', updateStatus);

      return () => {
        window.ethereum.removeListener('accountsChanged', updateStatus);
        window.ethereum.removeListener('chainChanged', updateStatus);
        window.ethereum.removeListener('connect', updateStatus);
        window.ethereum.removeListener('disconnect', updateStatus);
      };
    }
  }, []);

  return {
    ...status,
    connectWallet,
    switchToBaseSepolia,
    updateStatus,
  };
}; 