import axios from 'axios';
import FormData from 'form-data';

export interface PinataConfig {
  apiKey: string;
  secretApiKey: string;
  gatewayUrl?: string;
}

export interface PinataUploadResult {
  success: boolean;
  ipfsHash?: string;
  ipfsUrl?: string;
  error?: string;
}

class PinataService {
  private config: PinataConfig | null = null;
  private gatewayUrl: string = 'https://gateway.pinata.cloud/ipfs/';

  initialize(config: PinataConfig) {
    this.config = config;
    this.gatewayUrl = config.gatewayUrl || 'https://gateway.pinata.cloud/ipfs/';
  }

  async uploadFile(file: File, name?: string): Promise<PinataUploadResult> {
    if (!this.config) {
      return {
        success: false,
        error: 'Pinata service not initialized. Please provide API credentials.'
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', file, name || file.name);

      // Add metadata
      const metadata = JSON.stringify({
        name: name || file.name,
        description: `EssayCoin image uploaded via Kawak platform`,
        attributes: {
          platform: 'Kawak',
          type: 'essay-coin-image',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            ...formData.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      if (response.data && response.data.IpfsHash) {
        const ipfsHash = response.data.IpfsHash;
        const ipfsUrl = `${this.gatewayUrl}${ipfsHash}`;
        
        return {
          success: true,
          ipfsHash,
          ipfsUrl
        };
      } else {
        return {
          success: false,
          error: 'Failed to get IPFS hash from Pinata response'
        };
      }
    } catch (error: any) {
      console.error('Error uploading to Pinata:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to upload to IPFS'
      };
    }
  }

  async uploadJSON(metadata: any, name: string): Promise<PinataUploadResult> {
    if (!this.config) {
      return {
        success: false,
        error: 'Pinata service not initialized. Please provide API credentials.'
      };
    }

    try {
      const formData = new FormData();
      
      // Create a JSON blob
      const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: 'application/json'
      });
      
      formData.append('file', jsonBlob, `${name}.json`);

      // Add metadata
      const pinataMetadata = JSON.stringify({
        name: `${name}.json`,
        description: `EssayCoin metadata for ${name}`,
        attributes: {
          platform: 'Kawak',
          type: 'essay-coin-metadata',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', pinataMetadata);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      if (response.data && response.data.IpfsHash) {
        const ipfsHash = response.data.IpfsHash;
        const ipfsUrl = `${this.gatewayUrl}${ipfsHash}`;
        
        return {
          success: true,
          ipfsHash,
          ipfsUrl
        };
      } else {
        return {
          success: false,
          error: 'Failed to get IPFS hash from Pinata response'
        };
      }
    } catch (error: any) {
      console.error('Error uploading JSON to Pinata:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to upload JSON to IPFS'
      };
    }
  }

  getGatewayUrl(ipfsHash: string): string {
    return `${this.gatewayUrl}${ipfsHash}`;
  }

  // Helper method to validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 10MB'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are supported'
      };
    }

    return { valid: true };
  }
}

export const pinataService = new PinataService(); 