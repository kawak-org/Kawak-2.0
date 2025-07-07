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
  parseEther
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { pinataService, PinataConfig } from './PinataService';

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

      this.walletClient = createWalletClient({
        account: accountAddress as Hex,
        chain,
        transport: http(rpcEndpoint),
      });

      // Initialize Pinata if config provided
      if (pinataConfig) {
        pinataService.initialize(pinataConfig);
        this.pinataInitialized = true;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Zora service:', error);
      return false;
    }
  }

  async createMetadata(config: ZoraCoinConfig): Promise<ValidMetadataURI> {
    try {
      const creatorAddress = config.payoutRecipient as Address;
      
      let imageUrl: string | undefined;
      
      // Handle image upload to IPFS if Pinata is available
      if (config.image && this.pinataInitialized) {
        try {
          // Validate file first
          const validation = pinataService.validateFile(config.image);
          if (!validation.valid) {
            throw new Error(validation.error);
          }

          // Upload image to IPFS
          const uploadResult = await pinataService.uploadFile(
            config.image, 
            `${config.symbol.toLowerCase()}-coin-image`
          );

          if (uploadResult.success && uploadResult.ipfsUrl) {
            imageUrl = uploadResult.ipfsUrl;
            console.log('Image uploaded to IPFS:', imageUrl);
          } else {
            console.warn('Failed to upload image to IPFS:', uploadResult.error);
          }
        } catch (ipfsError) {
          console.warn('IPFS upload failed:', ipfsError);
        }
      }

      // Create metadata with image URL in description if available
      let description = config.description;
      if (imageUrl) {
        description += `\n\nImage: ${imageUrl}`;
      }

      const metadataBuilder = createMetadataBuilder()
        .withName(config.name)
        .withSymbol(config.symbol)
        .withDescription(description);

      // Add image file to metadata if available (Zora will handle the upload)
      if (config.image) {
        metadataBuilder.withImage(config.image);
      }

      const uploader = createZoraUploaderForCreator(creatorAddress);
      const { createMetadataParameters } = await metadataBuilder.upload(uploader);

      // Validate the metadata
      await validateMetadataURIContent(createMetadataParameters.uri);

      return createMetadataParameters.uri;
    } catch (error) {
      console.error('Error creating metadata:', error);
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