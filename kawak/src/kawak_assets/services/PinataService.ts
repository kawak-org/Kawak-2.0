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

      // Use fetch for browser compatibility
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          // Pinata requires API key and secret as headers for file upload
          'pinata_api_key': this.config.apiKey,
          'pinata_secret_api_key': this.config.secretApiKey
          // Do NOT set Content-Type; browser will set it with boundary
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.IpfsHash) {
        const ipfsHash = data.IpfsHash;
        const ipfsUrl = `${this.gatewayUrl}${ipfsHash}`;
        return {
          success: true,
          ipfsHash,
          ipfsUrl
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to get IPFS hash from Pinata response'
        };
      }
    } catch (error: any) {
      console.error('Error uploading to Pinata:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload to IPFS'
      };
    }
  }

  async uploadJSON(metadata: any, name: string) {
    try {
      const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: '55adb1794d0519a83ee6',
          pinata_secret_api_key: '9e867e4d7dbb6c2075122115a17bffb3412653315d5235ff45605899957b00e5',
        },
        body: JSON.stringify({
          pinataMetadata: { name },
          pinataContent: metadata,
        }),
      });
      const data = await response.json();
      if (response.ok && data.IpfsHash) {
        return { success: true, ipfsUrl: `ipfs://${data.IpfsHash}` };
      } else {
        return { success: false, error: data.error || 'Unknown error' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Unknown error' };
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