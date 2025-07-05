import React, { useState } from 'react';
import { generateSeedPhrase, validateAndFixSeedPhrase } from '../utils/CryptoUtils';
import MetaMaskService from '../services/MetaMaskService';

const SignatureTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testSignature = async () => {
    setIsLoading(true);
    setTestResult('Testing Ethereum address...');
    
    try {
      const ethereumAddress = await MetaMaskService.getEthereumAddress();
      
      setTestResult(`Ethereum address: ${ethereumAddress}\n`);
      
      const seedPhrase = await generateSeedPhrase(ethereumAddress);
      setTestResult(prev => prev + `Seed phrase: ${seedPhrase}\n`);
      
      const validSeedPhrase = validateAndFixSeedPhrase(seedPhrase);
      setTestResult(prev => prev + `Validated seed phrase: ${validSeedPhrase}\n`);
      
      setTestResult(prev => prev + '✅ Ethereum address test passed!');
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-4">Ethereum Address Test</h3>
      <button 
        onClick={testSignature}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Testing...' : 'Test Ethereum Address'}
      </button>
      <pre className="mt-4 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap">
        {testResult}
      </pre>
    </div>
  );
};

export default SignatureTest; 