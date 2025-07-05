// Add a type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

class MetaMaskService {
  async isMetaMaskInstalled() {
    const isInstalled = typeof window.ethereum !== "undefined"
    return isInstalled
  }

  async getEthereumAddress() {
    console.log("Getting Ethereum address...")
    
    // Check if MetaMask is installed
    if (!(await this.isMetaMaskInstalled())) {
      console.error("MetaMask is not installed")
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
    }

    try {
      // Check if ethereum provider is connected
      if (!window.ethereum.isConnected()) {
        console.log("MetaMask is not connected, attempting to connect...")
        // Try to connect
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      }

      let accounts = await window.ethereum.request({ method: "eth_accounts" })

      // If accounts are empty, prompt user to unlock MetaMask
      if (accounts.length === 0) {
        console.log("No accounts found, requesting accounts...")
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
      }

      if (accounts.length === 0) {
        console.error("No accounts available")
        throw new Error("MetaMask is locked or no accounts available. Please unlock MetaMask and try again.")
      }

      console.log("Ethereum address:", accounts[0])
      return accounts[0] // Returns the first account
    } catch (error) {
      console.error("Error getting Ethereum address:", error)
      
      // Handle specific error cases
      if (error.code === 4001) {
        throw new Error("User rejected the connection request")
      } else if (error.code === -32002) {
        throw new Error("MetaMask connection request already pending. Please check MetaMask.")
      } else if (error.message?.includes("Receiving end does not exist")) {
        throw new Error("MetaMask connection lost. Please refresh the page and try again.")
      } else {
        throw new Error(`MetaMask error: ${error.message || "Unknown error"}`)
      }
    }
  }

  async signMessage(message) {
    console.log("Signing message...")
    
    if (!(await this.isMetaMaskInstalled())) {
      console.error("MetaMask is not installed")
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
    }

    try {
      const ethereumAddress = await this.getEthereumAddress()

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, ethereumAddress],
      })

      // Validate signature format
      if (!signature || typeof signature !== 'string' || !signature.startsWith('0x')) {
        throw new Error("Invalid signature format received from MetaMask")
      }

      console.log("Signature received:", signature)
      return signature
    } catch (error) {
      console.error("MetaMask signing error:", error)
      if (error.code === 4001) {
        throw new Error("User rejected the signature request")
      } else if (error.message?.includes("Receiving end does not exist")) {
        throw new Error("MetaMask connection lost. Please refresh the page and try again.")
      }
      throw error
    }
  }

  // Add method to check connection status
  async checkConnection() {
    try {
      if (!(await this.isMetaMaskInstalled())) {
        return { connected: false, error: "MetaMask not installed" }
      }
      
      const isConnected = window.ethereum.isConnected()
      return { connected: isConnected, error: null }
    } catch (error) {
      return { connected: false, error: error.message }
    }
  }
}

export default new MetaMaskService()
