import React, { useState } from 'react';
import { useMetaMaskStatus } from '../hooks/useMetaMaskStatus';
import { FaWallet, FaEthereum } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

const MetaMaskStatus: React.FC = () => {
  const {
    isConnected,
    address,
    network,
    balance,
    chainId,
    isLoading,
    connectWallet,
    switchToBaseSepolia,
  } = useMetaMaskStatus();

  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'bg-blue-500';
      case 11155111:
        return 'bg-purple-500';
      case 84532:
        return 'bg-orange-500';
      case 8453:
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="flex items-center space-x-2 px-3 py-2 bg-[#F98E2D] hover:bg-[#F98E2D]/90 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <FaWallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Network Selector */}
      <div className="relative">
        <button
          onClick={() => setShowNetworkMenu(!showNetworkMenu)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${getNetworkColor(chainId)}`}
        >
          <FaEthereum className="w-4 h-4" />
          <span>{network}</span>
          <IoIosArrowDown className="w-3 h-3" />
        </button>

        {showNetworkMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]">
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">Switch Network</div>
              <button
                onClick={() => {
                  switchToBaseSepolia();
                  setShowNetworkMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Base Sepolia</span>
              </button>
              <button
                onClick={() => {
                  // Add other network switching logic here
                  setShowNetworkMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center space-x-2"
              >
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Sepolia</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Balance */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <FaEthereum className="w-4 h-4 text-[#F98E2D]" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {balance} ETH
        </span>
      </div>

      {/* Address */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <FaWallet className="w-4 h-4 text-[#F98E2D]" />
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {formatAddress(address)}
        </span>
      </div>
    </div>
  );
};

export default MetaMaskStatus; 