import { PinataConfig } from '../services/PinataService';

// Pinata IPFS Configuration
// Get your API keys from: https://app.pinata.cloud/developers/api-keys
export const pinataConfig: PinataConfig = {
  apiKey: process.env.REACT_APP_PINATA_API_KEY || '',
  secretApiKey: process.env.REACT_APP_PINATA_SECRET_API_KEY || '',
  gatewayUrl: 'https://gateway.pinata.cloud/ipfs/'
};

// Check if Pinata is configured
export const isPinataConfigured = (): boolean => {
  return !!(pinataConfig.apiKey && pinataConfig.secretApiKey);
};

// Get Pinata config if available
export const getPinataConfig = (): PinataConfig | undefined => {
  return isPinataConfigured() ? pinataConfig : undefined;
}; 