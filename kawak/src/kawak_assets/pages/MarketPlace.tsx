/**
 * MarketPlace Page
 * ----------------
 * This page displays all coins created in the platform, including those minted via ZoraCoinService (through EssayCoinForm and CraftEssay).
 *
 * ZoraCoin Integration:
 *   - Fetches and lists all essay coins, including their metadata, contract address, and owner.
 *   - Allows users to view details of each coin, including a link to view the coin on Zora.
 *   - Coins shown here are created using the workflow in CraftEssay.tsx and EssayCoinForm.tsx, which use ZoraCoinService for deployment.
 *
 * Related files:
 *   - kawak/src/kawak_assets/services/ZoraCoinService.ts
 *   - kawak/src/kawak_assets/components/essay/EssayCoinForm.tsx
 *   - kawak/src/kawak_assets/pages/CraftEssay.tsx
 */
import React, { useState, useEffect } from "react";
import Navbar from "../components/shared/navbar/Navbar";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import MarketCard from "../components/User/MarketCard";
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useMarketPlaceLists, useGetAllEssayCoins } from "../functions/contract";
import { useAppSelector } from "../redux/hooks";
import Loader from "../components/Loaders/Loader";
import { Link } from "react-router-dom";

// Helper to render Principal as string
function principalToString(principal: any): string {
  if (!principal) return '';
  if (typeof principal === 'string') return principal;
  if (typeof principal.toText === 'function') return principal.toText();
  // Dfinity principal objects may have _arr and _isPrincipal
  if (principal._isPrincipal && Array.isArray(principal._arr)) {
    // Try to use @dfinity/principal if available, otherwise fallback
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Principal } = require('@dfinity/principal');
      return Principal.fromUint8Array(Uint8Array.from(principal._arr)).toText();
    } catch {
      return JSON.stringify(principal);
    }
  }
  return JSON.stringify(principal);
}

const CoinsPage = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCoin, setSelectedCoin] = useState<any | null>(null);
  const { getAllEssayCoins } = useGetAllEssayCoins();

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      const result = await getAllEssayCoins();
      setCoins(result);
      setLoading(false);
    };
    fetchCoins();
  }, []);

  const handleOpenModal = (coin: any) => setSelectedCoin(coin);
  const handleCloseModal = () => setSelectedCoin(null);

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="w-full h-screen flex m-auto justify-center items-center mt-[-5rem] ">
          <Loader />
        </div>
      ) : (
        <div className="mx-8 mt-16 mb-8">
          <div className="flex flex-col justify-center items-center mt-[7rem]">
            <h2 className="text-[#08172E] dark:text-white/90 text-3xl font-semibold ">
              Coins
            </h2>
          </div>
          <div className="flex flex-col">
            {coins.length === 0 && (
              <div className="flex w-full h-[70%] flex-col text-bold mt-16 justify-center items-center ">
                <img src={"pana2.png"} alt="" />
                <p className="text-[#141414]/60 dark:text-white/90 my-4 text-center text-base max-w-[650px] ">
                  There are currently no coins available.
                </p>
                <Link to="/forge">
                  <button className="dark:bg-[#627D98] hover:no-underline dark:hover:text-white dark:hover:bg-[#9AA5B1] bg-[#08172E] hover:bg-primary-light hover:text-black text-base py-3 px-10">
                    Back to Forge
                  </button>
                </Link>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mt-8 gap-4">
              {coins.map(([id, coin]) => (
                <div
                  key={id}
                  className="flex flex-col border-l-4 border-blue-500 rounded-lg p-5 bg-white dark:bg-[#23272f] shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden"
                  onClick={() => handleOpenModal({ id, ...coin })}
                >
                  <div className="flex items-center mb-3">
                    <img src="kawak_coin.svg" alt="Coin icon" className="w-8 h-8 mr-3" />
                    <span className="text-lg font-bold text-[#08172E] dark:text-white/90 mr-2 group-hover:text-blue-700">{coin.name}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2">{coin.symbol}</span>
                  </div>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-1">ID:</span>
                    <span className="text-gray-700 dark:text-white/80">{id}</span>
                  </div>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-1">Owner:</span>
                    <span className="text-gray-700 dark:text-white/80">{principalToString(coin.owner)}</span>
                  </div>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-1">Contract:</span>
                    <span className="text-blue-700 dark:text-blue-300 break-all">{coin.contract_address}</span>
                  </div>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-1">Total Supply:</span>
                    <span className="text-gray-700 dark:text-white/80">{coin.total_supply}</span>
                  </div>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-1">Created:</span>
                    <span className="text-gray-700 dark:text-white/80">{new Date(Number(coin.created_at) * 1000).toLocaleString()}</span>
                  </div>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-1">Metadata:</span>
                    <span className="text-gray-700 dark:text-white/80 break-all">{coin.metadata}</span>
                  </div>
                  <div className="absolute right-4 top-4 opacity-10 text-6xl pointer-events-none select-none group-hover:opacity-20 transition">🪙</div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal for coin details */}
          {selectedCoin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-[#23272f] rounded-xl shadow-2xl border-t-4 border-blue-500 p-10 max-w-lg w-full relative animate-fadeIn">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
                {/* Coin Image and Name */}
                <div className="flex items-center mb-4">
                  <img
                    src={selectedCoin.metadata && selectedCoin.metadata.startsWith('http') ? selectedCoin.metadata : 'kawak_coin.svg'}
                    alt="Coin visual"
                    className="w-16 h-16 rounded-full border-2 border-blue-500 bg-white object-cover mr-4 shadow"
                    onError={e => (e.currentTarget.src = 'kawak_coin.svg')}
                  />
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[#08172E] dark:text-white/90 flex items-center">
                      {selectedCoin.name}
                      <span className="text-base bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-3">{selectedCoin.symbol}</span>
                      <span className="ml-3 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-semibold">Base Sepolia</span>
                    </h3>
                    <div className="text-xs text-gray-500">ID: {selectedCoin.id}</div>
                  </div>
                </div>
                {/* Mocked Market Data */}
                <div className="flex flex-row gap-6 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-green-600">$0.023</span>
                    <span className="text-xs text-gray-500">Price</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-blue-600">$1,200</span>
                    <span className="text-xs text-gray-500">Market Cap</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-purple-600">42</span>
                    <span className="text-xs text-gray-500">Holders</span>
                  </div>
                </div>
                {/* Coin Details */}
                <div className="mb-2 flex items-center text-xs text-gray-500">
                  <span className="mr-1">Owner (Principal):</span>
                  <span className="text-gray-700 dark:text-white/80">{principalToString(selectedCoin.owner)}</span>
                </div>
                <div className="mb-2 flex items-center text-xs text-gray-500">
                  <span className="mr-1">Contract Address:</span>
                  <span className="text-blue-700 dark:text-blue-300 break-all">{selectedCoin.contract_address}</span>
                </div>
                <div className="mb-2 flex items-center text-xs text-gray-500">
                  <span className="mr-1">Total Supply:</span>
                  <span className="text-gray-700 dark:text-white/80">{selectedCoin.total_supply}</span>
                </div>
                <div className="mb-2 flex items-center text-xs text-gray-500">
                  <span className="mr-1">Created:</span>
                  <span className="text-gray-700 dark:text-white/80">{new Date(Number(selectedCoin.created_at) * 1000).toLocaleString()}</span>
                </div>
                <div className="mb-4 flex items-center text-xs text-gray-500">
                  <span className="mr-1">Metadata:</span>
                  <span className="text-gray-700 dark:text-white/80 break-all">{selectedCoin.metadata}</span>
                </div>
                {/* Mocked Buy/Sell Actions */}
                <div className="flex flex-row gap-4 mb-4">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold shadow">Buy</button>
                  <button className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold shadow">Sell</button>
                </div>
                <a
                  href={`https://testnet.zora.co/coin/bsep:${selectedCoin.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition text-sm font-semibold"
                >
                  View on Zora
                </a>
                <button
                  className="w-full py-2 mt-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinsPage;
