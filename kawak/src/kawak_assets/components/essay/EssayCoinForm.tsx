/**
 * EssayCoinForm
 * -------------
 * This React component provides a form UI for users to configure and create a custom Zora coin (ERC-20 token) for their essay.
 * It integrates with ZoraCoinService to:
 *   - Collect coin details (name, symbol, description, image, payout recipient, etc.)
 *   - Validate user input and image uploads
 *   - Initialize ZoraCoinService and trigger coin creation on the Zora network
 *   - Upload metadata and images to IPFS via Pinata
 *   - Expose imperative methods for parent components (e.g., CraftEssay) to trigger coin creation
 *
 * Integration Points:
 *   - Used in CraftEssay.tsx to allow users to mint a coin when submitting an essay
 *   - Coin creation results are displayed and can be tracked in MarketPlace.tsx
 *
 * Related files:
 *   - kawak/src/kawak_assets/services/ZoraCoinService.ts
 *   - kawak/src/kawak_assets/pages/CraftEssay.tsx
 *   - kawak/src/kawak_assets/pages/MarketPlace.tsx
 */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-hot-toast';
import { zoraCoinService, ZoraCoinConfig } from '../../services/ZoraCoinService';
import { useAppSelector } from '../../redux/hooks';
import { useMetaMaskStatus } from '../../hooks/useMetaMaskStatus';
import { useCreateEssayCoin } from '../../functions/contract';
import { PinataConfig } from '../../services/PinataService';

interface EssayCoinFormProps {
  essayId: number;
  essayTitle: string;
  onCoinCreated?: (coinAddress: string) => void;
  isDisabled?: boolean;
  pinataConfig?: PinataConfig;
}

const EssayCoinForm = forwardRef<any, EssayCoinFormProps>(({
  essayId,
  essayTitle,
  onCoinCreated,
  isDisabled = false,
  pinataConfig
}, ref) => {
  const user = useAppSelector((state) => state.profile);
  const { address, isConnected } = useMetaMaskStatus();
  const { createEssayCoin } = useCreateEssayCoin();
  
  const [formData, setFormData] = useState<ZoraCoinConfig>({
    name: '',
    symbol: '',
    description: '',
    payoutRecipient: '',
    currency: 'ETH',
    initialPurchase: {
      enabled: false,
      amount: '0.01'
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploadStatus, setImageUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [autoCreateAttempted, setAutoCreateAttempted] = useState(false);

  // Auto-populate form with essay data
  useEffect(() => {
    if (essayTitle) {
      console.log("📝 Auto-populating form with essay title:", essayTitle);
      setFormData(prev => ({
        ...prev,
        name: `${essayTitle} Coin`,
        symbol: essayTitle.substring(0, 3).toUpperCase() + 'C',
        description: `A coin representing the essay: ${essayTitle}`,
        payoutRecipient: address || ''
      }));
    }
  }, [essayTitle, address]);

  // Auto-create coin when essay is submitted and we have saved configuration
  useEffect(() => {
    if (essayId > 0 && !autoCreateAttempted) {
      console.log("🪙 Essay submitted with ID:", essayId, "- checking for saved coin configuration");
      const savedConfig = localStorage.getItem(`essayCoinConfig_${essayId}`);
      if (savedConfig) {
        console.log("🪙 Found saved configuration, attempting auto-creation");
        setAutoCreateAttempted(true);
        try {
          const config = JSON.parse(savedConfig);
          console.log("🪙 Loaded saved configuration:", config);
          
          // Update form data with saved config
          setFormData(config);
          setIsSaved(true);
          
          // Auto-create the coin
          setTimeout(() => {
            console.log("🪙 Starting auto-creation of coin...");
            createCoinAutomatically(config);
          }, 1000);
        } catch (error) {
          console.error("❌ Error loading saved configuration:", error);
        }
      } else {
        console.log("ℹ️ No saved configuration found for essay ID:", essayId);
      }
    }
  }, [essayId, autoCreateAttempted]);

  const handleInputChange = (field: keyof ZoraCoinConfig, value: any) => {
    console.log(`📝 Updating form field '${field}':`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("🖼️ Image selected:", file.name, "Size:", file.size, "Type:", file.type);
      
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (file.size > maxSize) {
        console.error("❌ File too large:", file.size, "bytes");
        toast.error('File size must be less than 10MB');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        console.error("❌ Invalid file type:", file.type);
        toast.error('Only JPEG, PNG, GIF, and WebP images are supported');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        console.log("🖼️ Image preview generated");
      };
      reader.readAsDataURL(file);
      setImageUploadStatus('idle');
    }
  };

  const validateForm = (): string | null => {
    console.log("🔍 Validating form data...");
    
    if (!formData.name.trim()) return 'Coin name is required';
    if (!formData.symbol.trim()) return 'Coin symbol is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.payoutRecipient.trim()) return 'Payout recipient is required';
    
    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(formData.payoutRecipient)) {
      return 'Invalid Ethereum address';
    }
    
    if (formData.initialPurchase?.enabled && !formData.initialPurchase.amount) {
      return 'Initial purchase amount is required when enabled';
    }

    // Require image file
    if (!imageFile) {
      return 'Coin image is required';
    }

    console.log("✅ Form validation passed");
    return null;
  };

  const createCoinAutomatically = async (config: any) => {
    console.log("🤖 Auto-creating coin with config:", config);
    await createCoinInternal(config, true);
  };

  const createCoin = async () => {
    console.log("🪙 Manual coin creation initiated");
    await createCoinInternal(formData, false);
  };

  const createCoinInternal = async (coinConfig: any, isAutoCreate: boolean = false, overrideEssayId?: number) => {
    if (!isConnected || !address) {
      console.error("❌ MetaMask not connected");
      toast.error('Please connect your MetaMask wallet first');
      return;
    }

    const finalEssayId = overrideEssayId !== undefined ? overrideEssayId : essayId;
    if (finalEssayId === 0 && !isAutoCreate) {
      console.error("❌ Essay not submitted yet");
      toast.error('Please submit your essay first before creating the EssayCoin');
      return;
    }

    setIsLoading(true);
    try {
      console.log("[EssayCoin] Initializing Zora service...");
      const initialized = await zoraCoinService.initialize(address, undefined, pinataConfig);
      if (!initialized) {
        toast.error('Failed to initialize Zora service');
        console.error('[EssayCoin] Failed to initialize Zora service');
        setIsLoading(false);
        return;
      }
      console.log("[EssayCoin] Zora service initialized.");
      // 1. Deploy coin to Zora
      const configWithImage = { ...coinConfig, image: imageFile };
      const result = await zoraCoinService.createCoin(configWithImage);
      console.log("[EssayCoin] Zora deployment result:", result);
      if (result && result.address) {
        console.log("[EssayCoin] Coin deployed to Zora successfully. Address:", result.address);
        const totalSupply = coinConfig.initialPurchase?.enabled && coinConfig.initialPurchase.amount
          ? Number(coinConfig.initialPurchase.amount)
          : 0;
        const metadata = coinConfig.description || '';
        console.log("[EssayCoin] Saving coin configuration to canister/backend with params:", {
          essayId: finalEssayId,
          contract_address: result.address,
          name: coinConfig.name,
          symbol: coinConfig.symbol,
          totalSupply,
          metadata
        });
        const saveResult = await createEssayCoin(
          finalEssayId,
          result.address, // contract_address
          coinConfig.name,
          coinConfig.symbol,
          totalSupply,
          metadata
        );
        console.log("[EssayCoin] Canister/backend save result:", saveResult);
        if (saveResult) {
          toast.success("Coin deployed and configuration saved!");
          if (onCoinCreated) onCoinCreated(result.address);
        } else {
          console.error("[EssayCoin] Coin deployed but failed to save configuration.");
          toast.error("Coin deployed but failed to save configuration.");
        }
      } else {
        console.error("[EssayCoin] Coin deployment failed, not saving config.", result?.error);
        toast.error("Coin deployment failed, not saving config.");
      }
    } catch (error) {
      console.error("[EssayCoin] Error deploying coin or saving config:", error);
      toast.error("Error deploying coin or saving config.");
    } finally {
      setIsLoading(false);
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getConfig: () => formData,
    createCoinWithEssayId: async (newEssayId: number) => {
      // Use the current formData and newEssayId to create the coin
      await createCoinInternal({ ...formData }, false, newEssayId);
    }
  }));

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              MetaMask Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Please connect your MetaMask wallet to create an EssayCoin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create EssayCoin</h3>
          <p className="text-sm text-gray-600">Integrate with Zora Coin to create a token for your essay</p>
          {pinataConfig && (
            <p className="text-xs text-green-600 mt-1">✓ IPFS storage enabled via Pinata</p>
          )}
        </div>
        {isSaved && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Configuration Saved
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coin Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., My Essay Coin"
              disabled={isDisabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symbol *
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., MEC"
              maxLength={5}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your coin..."
            disabled={isDisabled}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coin Image <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isDisabled}
                required
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-12 h-12 rounded-full object-cover border"
                />
              )}
            </div>
            {imageFile && (
              <div className="text-sm text-gray-600">
                <p>File: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                {pinataConfig && (
                  <p className="text-green-600">✓ Will be uploaded to IPFS via Pinata</p>
                )}
              </div>
            )}
            {!imageFile && (
              <div className="text-sm text-red-500">Coin image is required</div>
            )}
          </div>
        </div>

        {/* Payout Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payout Recipient (Ethereum Address) *
          </label>
          <input
            type="text"
            value={formData.payoutRecipient}
            onChange={(e) => handleInputChange('payoutRecipient', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0x..."
            disabled={isDisabled}
          />
          <p className="text-xs text-gray-500 mt-1">
            This address will receive all trading fees and revenue from the coin
          </p>
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trading Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isDisabled}
          >
            <option value="ETH">ETH</option>
            <option value="ZORA">ZORA</option>
          </select>
        </div>

        {/* Initial Purchase */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="initialPurchase"
              checked={formData.initialPurchase?.enabled}
              onChange={(e) => handleInputChange('initialPurchase', {
                ...formData.initialPurchase,
                enabled: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isDisabled}
            />
            <label htmlFor="initialPurchase" className="ml-2 block text-sm text-gray-900">
              Enable Initial Purchase
            </label>
          </div>
          
          {formData.initialPurchase?.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Purchase Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.initialPurchase.amount}
                onChange={(e) => handleInputChange('initialPurchase', {
                  ...formData.initialPurchase,
                  amount: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.01"
                disabled={isDisabled}
              />
              <p className="text-xs text-gray-500 mt-1">
                Amount of ETH to purchase initially when the coin is created
              </p>
            </div>
          )}
        </div>

        {/* Network Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Network Information</h4>
          <div className="text-sm text-gray-600">
            <p>Network: {process.env.NODE_ENV === 'production' ? 'Base Mainnet' : 'Base Sepolia'}</p>
            <p>Connected Address: {address}</p>
            {pinataConfig && (
              <p className="text-green-600">Storage: IPFS via Pinata</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={createCoin}
            disabled={isDisabled || isLoading || !isSaved || essayId === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create EssayCoin'
            )}
          </button>
        </div>

        {!isSaved && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
            <p>💡 Save your configuration first, then create the coin. This ensures your settings are preserved.</p>
          </div>
        )}

        {essayId === 0 && (
          <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md p-3">
            <p>📝 Submit your essay first to enable EssayCoin creation. You can configure the coin settings now.</p>
          </div>
        )}

        {autoCreateAttempted && (
          <div className="text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-md p-3">
            <p>🤖 Auto-creation attempted. Check console for detailed logs.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default EssayCoinForm; 