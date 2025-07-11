# KawaK 

![Layer 1 (2)](https://github.com/kawak-org/Kawak-2.0/assets/33438220/272fc5cf-b714-4304-b800-c3e338fb6665)

KawaK is a free meritocratic tool where good feedback on peers’ articles  is rewarded by matching writers with others who provide the same quality of feedback. KawaK hopes to y that values the development of thought, writing and expression by providing a tool that is accessible to anyone.
We aim to leverage NFTs so that writers have proof of ownership of their work, should plagiarism issues arise. Tokenization will also play a key role and thanks to the Zora protocol we are able to use ERC standards and design an  ERC‑20 social token for KawaK posts alongside the zora ecosystem. 
[Check it out!](https://3ysab-rqaaa-aaaan-qaewq-cai.ic0.app)

In it's current state users earn the Wood token by providing feedback to others, which they can then spend to highlight work of their own. 

## feature set
- Rewarded feedback: Crafts written by all will be displayed on The Forge. Providing kawak wood (built on zora protocol) will unlock feedback and interaction. Test your writing in the heat of criticism.
- Tribunal: Settle Disagreements 
Pillars of the community
- Article as Coin: Sell as traditional 
book/article.
Auction as singular copy



## What's next? 🏗️

- Feedback functionality for larger sections of code. 
- Marketplace for Authors to publish their work
- Conversion into a DAO
- Tribunal metrics: Meritocratic calculated average linked to User in order to determine the range of features that are accessible to them + reward 
- Referral: Referral mechanism rewarding those who have invited good actors.
- NFT marketplace: Nft marketplace for minted articles
- Restricted article/books: Essay’s coins can be used as requirements to view the written piece of works.



## ZoraCoin Integration 🚀

KawaK integrates with the [Zora Protocol](https://zora.co/) to allow users to mint custom ERC-20 coins for their essays. This enables essay creators to launch their own tokens, with metadata and images stored on IPFS via Pinata.

**Integration Workflow:**
- Users configure and mint a coin for their essay using a dedicated form.
- Metadata and images are uploaded to IPFS.
- The coin is deployed to the Zora blockchain and associated with the essay.
- All created coins are displayed in the Marketplace.

**Main Integration Points:**
- `kawak/src/kawak_assets/services/ZoraCoinService.ts` – Core service for Zora coin creation and metadata handling.
- `kawak/src/kawak_assets/components/essay/EssayCoinForm.tsx` – React form for configuring and minting coins.
- `kawak/src/kawak_assets/pages/CraftEssay.tsx` – Page for essay creation and coin minting workflow.
- `kawak/src/kawak_assets/pages/MarketPlace.tsx` – Displays all minted coins and their details.

See the top of each file for detailed documentation on how ZoraCoin is integrated and used in the platform.

## Contributing 🌱

Pull requests are more than welcome! For major changes/suggestions, please open an issue first. 

Or drop us a message at contact@kawak.org 


## License 📄

[MIT](https://choosealicense.com/licenses/mit/)
