/**
 * ZoraCoinService
 * ----------------
 * This service provides integration with the Zora protocol for creating and managing custom coins (ERC-20 tokens) on the Zora network.
 * It handles:
 *   - Initialization of Zora and Pinata (for IPFS image/metadata uploads)
 *   - Metadata creation and upload to IPFS
 *   - Coin deployment to the Zora blockchain
 *
 * Integration Points in the Codebase:
 *   - EssayCoinForm.tsx: Provides the UI and logic for users to configure and create a Zora coin for their essay.
 *   - CraftEssay.tsx: Handles the workflow for essay submission and triggers coin creation via EssayCoinForm.
 *   - MarketPlace.tsx: Displays all created coins, including those deployed via ZoraCoinService.
 *
 * Main API:
 *   - initialize(accountAddress, rpcUrl?, pinataConfig?)
 *   - createMetadata(config)
 *   - createCoin(config)
 *
 * Related files:
 *   - kawak/src/kawak_assets/components/essay/EssayCoinForm.tsx
 *   - kawak/src/kawak_assets/pages/CraftEssay.tsx
 *   - kawak/src/kawak_assets/pages/MarketPlace.tsx
 */
import { 
  createCoin, 
  DeployCurrency, 
  InitialPurchaseCurrency, 
  ValidMetadataURI,
  createMetadataBuilder,
  createZoraUploaderForCreator,
  validateMetadataURIContent
} from "@zoralabs/coins-sdk";
import { 
  Hex, 
  createWalletClient, 
  createPublicClient, 
  http, 
  Address,
  parseEther,
  custom
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { pinataService, PinataConfig } from './PinataService';

declare global {
  interface Window {
    ZORA_API_KEY?: string;
  }
}

export interface ZoraCoinConfig {
  name: string;
  symbol: string;
  description: string;
  image?: File;
  payoutRecipient: string;
  platformReferrer?: string;
  currency: 'ZORA' | 'ETH';
  initialPurchase?: {
    enabled: boolean;
    amount: string;
  };
  chainId?: number;
}

export interface ZoraCoinResult {
  success: boolean;
  hash?: string;
  address?: string;
  error?: string;
}

class ZoraCoinService {
  private publicClient: any;
  private walletClient: any;
  private isInitialized = false;
  private pinataInitialized = false;

  async initialize(accountAddress: string, rpcUrl?: string, pinataConfig?: PinataConfig) {
    try {
      const chain = process.env.NODE_ENV === 'production' ? base : baseSepolia;
      const rpcEndpoint = rpcUrl || (process.env.NODE_ENV === 'production' 
        ? 'https://mainnet.base.org' 
        : 'https://sepolia.base.org');

      this.publicClient = createPublicClient({
        chain,
        transport: http(rpcEndpoint),
      });

      // Use MetaMask (window.ethereum) for signing if available
      const hasMetaMask = typeof window !== 'undefined' && (window as any).ethereum;
      this.walletClient = createWalletClient({
        account: accountAddress as Hex,
        chain,
        transport: hasMetaMask
          ? custom((window as any).ethereum)
          : http(rpcEndpoint),
      });

      // Hardcode Pinata API credentials for testing
      const pinataConfig = {
        apiKey: '55adb1794d0519a83ee6',
        secretApiKey: '9e867e4d7dbb6c2075122115a17bffb3412653315d5235ff45605899957b00e5',
      };
      console.log('[ZoraCoinService] Pinata config for initialization (hardcoded):', pinataConfig);
      pinataService.initialize(pinataConfig);
      this.pinataInitialized = true;
      console.log('[ZoraCoinService] Pinata initialized successfully.');

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Zora service:', error);
      return false;
    }
  }

  async createMetadata(config: ZoraCoinConfig): Promise<ValidMetadataURI> {
    try {
      let imageUrl: string | undefined;

      // 1. Upload image to IPFS via Pinata
      if (config.image && this.pinataInitialized) {
        console.log('[ZoraCoinService] Validating image file for IPFS upload...');
        const validation = pinataService.validateFile(config.image);
        if (!validation.valid) {
          console.error('[ZoraCoinService] Image validation failed:', validation.error);
          throw new Error(validation.error);
        }
        console.log('[ZoraCoinService] Uploading image to IPFS via Pinata...');
        const uploadResult = await pinataService.uploadFile(
          config.image,
          `${config.symbol.toLowerCase()}-coin-image`
        );
        if (uploadResult.success && uploadResult.ipfsUrl) {
          imageUrl = uploadResult.ipfsUrl;
          console.log('[ZoraCoinService] Image uploaded to IPFS:', imageUrl);
        } else {
          console.error('[ZoraCoinService] Failed to upload image to IPFS:', uploadResult.error);
          throw new Error(uploadResult.error || "Failed to upload image to IPFS");
        }
      } else {
        console.log('[ZoraCoinService] No image provided or Pinata not initialized, skipping image upload.');
      }

      // 2. Build metadata object
      const metadata = {
        name: config.name,
        symbol: config.symbol,
        description: config.description,
        image: imageUrl,
      };
      console.log('[ZoraCoinService] Built metadata object:', metadata);

      // 3. Upload metadata JSON to IPFS via Pinata
      console.log('[ZoraCoinService] Uploading metadata JSON to IPFS via Pinata...');
      const metadataUpload = await pinataService.uploadJSON(metadata, `${config.symbol.toLowerCase()}-coin-metadata`);
      if (!metadataUpload.success || !metadataUpload.ipfsUrl) {
        console.error('[ZoraCoinService] Failed to upload metadata to IPFS:', metadataUpload.error);
        throw new Error(metadataUpload.error || "Failed to upload metadata to IPFS");
      }
      console.log('[ZoraCoinService] Metadata uploaded to IPFS:', metadataUpload.ipfsUrl);

      // 4. Return the IPFS URI
      console.log('[ZoraCoinService] Returning metadata IPFS URI:', metadataUpload.ipfsUrl);
      return metadataUpload.ipfsUrl as ValidMetadataURI;
    } catch (error) {
      console.error('[ZoraCoinService] Error creating metadata:', error);
      throw new Error('Failed to create metadata');
    }
  }

  async createCoin(config: ZoraCoinConfig): Promise<ZoraCoinResult> {
    try {
      if (!this.isInitialized) {
        throw new Error('Zora service not initialized');
      }

      // Create metadata
      const metadataURI = await this.createMetadata(config);

      // Prepare coin parameters
      const coinParams = {
        name: config.name,
        symbol: config.symbol,
        uri: metadataURI,
        payoutRecipient: config.payoutRecipient as Address,
        platformReferrer: config.platformReferrer as Address | undefined,
        chainId: config.chainId || base.id,
        currency: config.currency === 'ZORA' ? DeployCurrency.ZORA : DeployCurrency.ETH,
        ...(config.initialPurchase?.enabled && {
          initialPurchase: {
            currency: InitialPurchaseCurrency.ETH,
            amount: parseEther(config.initialPurchase.amount),
          },
        }),
      };

      // Create the coin
      const result = await createCoin(coinParams, this.walletClient, this.publicClient, {
        gasMultiplier: 120, // Add 20% buffer to gas
      });

      return {
        success: true,
        hash: result.hash,
        address: result.address,
      };
    } catch (error) {
      console.error('Error creating Zora coin:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      // Basic Ethereum address validation
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } catch (error) {
      return false;
    }
  }

  async getChainInfo() {
    return {
      chainId: process.env.NODE_ENV === 'production' ? base.id : baseSepolia.id,
      chainName: process.env.NODE_ENV === 'production' ? 'Base Mainnet' : 'Base Sepolia',
      isTestnet: process.env.NODE_ENV !== 'production',
    };
  }

  // Helper method to upload additional metadata to IPFS
  async uploadMetadataToIPFS(metadata: any, name: string): Promise<string | null> {
    if (!this.pinataInitialized) {
      console.warn('Pinata not initialized, cannot upload metadata to IPFS');
      return null;
    }

    try {
      const result = await pinataService.uploadJSON(metadata, name);
      if (result.success && result.ipfsUrl) {
        return result.ipfsUrl;
      }
      return null;
    } catch (error) {
      console.error('Failed to upload metadata to IPFS:', error);
      return null;
    }
  }
}

export const zoraCoinService = new ZoraCoinService(); 