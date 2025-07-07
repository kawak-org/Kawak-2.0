# Pinata IPFS Setup for EssayCoin

This guide explains how to set up Pinata IPFS integration for uploading EssayCoin images and metadata.

## What is Pinata?

Pinata is a service that makes it easy to upload files to IPFS (InterPlanetary File System), providing decentralized storage for your EssayCoin images and metadata.

## Setup Instructions

### 1. Create a Pinata Account

1. Go to [Pinata Cloud](https://app.pinata.cloud/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Keys

1. Log in to your Pinata account
2. Go to the [API Keys section](https://app.pinata.cloud/developers/api-keys)
3. Click "New Key"
4. Give your key a name (e.g., "Kawak EssayCoin")
5. Select the permissions you need:
   - `pinFileToIPFS` - for uploading files
   - `pinJSONToIPFS` - for uploading metadata
6. Click "Create"
7. Copy both the **API Key** and **Secret API Key**

### 3. Configure Environment Variables

Create or update your `.env` file in the project root:

```env
# Pinata IPFS Configuration
REACT_APP_PINATA_API_KEY=your_api_key_here
REACT_APP_PINATA_SECRET_API_KEY=your_secret_api_key_here
```

### 4. Restart Your Development Server

After adding the environment variables, restart your development server:

```bash
npm start
```

## Features

With Pinata configured, your EssayCoin will have:

- **Decentralized Image Storage**: Coin images are stored on IPFS via Pinata
- **Permanent URLs**: Images get permanent IPFS URLs that won't break
- **Metadata Storage**: Additional metadata can be stored on IPFS
- **Fallback Support**: If Pinata is not configured, the system falls back to Zora's uploader

## Usage

Once configured, the EssayCoin form will automatically:

1. Upload images to IPFS when creating a coin
2. Use IPFS URLs in the coin metadata
3. Show "IPFS storage enabled" indicator in the UI
4. Display upload status and file information

## Benefits

- **Decentralized**: Images are stored on IPFS, not centralized servers
- **Permanent**: IPFS URLs are permanent and won't break
- **Cost-effective**: Pinata provides free storage for reasonable usage
- **Fast**: Images load quickly from IPFS gateways
- **Reliable**: Multiple IPFS gateways ensure availability

## Troubleshooting

### API Key Issues
- Ensure both API key and secret key are correct
- Check that the keys have the necessary permissions
- Verify the keys are active in your Pinata dashboard

### Upload Failures
- Check file size (max 10MB)
- Ensure file type is supported (JPEG, PNG, GIF, WebP)
- Verify network connectivity
- Check browser console for error messages

### Environment Variables
- Make sure `.env` file is in the project root
- Restart the development server after adding variables
- Check that variable names start with `REACT_APP_`

## Security Notes

- Never commit your API keys to version control
- Use environment variables for all sensitive data
- Consider using different keys for development and production
- Monitor your Pinata usage to avoid unexpected charges

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Pinata API keys are working
3. Test with a simple image upload first
4. Check the Pinata documentation for API limits and requirements 