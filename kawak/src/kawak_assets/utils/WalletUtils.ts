// Wallet utility functions for better error handling

export interface WalletConnectionStatus {
  connected: boolean;
  error?: string;
  provider?: string;
}

export class WalletUtils {
  /**
   * Check if any wallet provider is available
   */
  static async checkWalletAvailability(): Promise<WalletConnectionStatus> {
    try {
      // Check for MetaMask
      if (typeof window.ethereum !== "undefined") {
        const isConnected = window.ethereum.isConnected();
        return {
          connected: isConnected,
          provider: "MetaMask",
          error: isConnected ? undefined : "MetaMask not connected"
        };
      }

      return {
        connected: false,
        error: "No wallet provider found"
      };
    } catch (error) {
      return {
        connected: false,
        error: `Wallet check failed: ${error.message}`
      };
    }
  }

  /**
   * Handle wallet connection errors gracefully
   */
  static handleWalletError(error: any): string {
    console.error("Wallet error:", error);

    if (error.code === 4001) {
      return "User rejected the wallet connection request";
    }
    
    if (error.code === -32002) {
      return "Wallet connection request already pending. Please check your wallet.";
    }
    
    if (error.message?.includes("Receiving end does not exist")) {
      return "Wallet connection lost. Please refresh the page and try again.";
    }
    
    if (error.message?.includes("isDefaultWallet")) {
      return "Wallet provider error. Please try refreshing the page.";
    }

    return error.message || "Unknown wallet error occurred";
  }
} 