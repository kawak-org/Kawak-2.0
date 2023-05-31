import React, { useState, useContext } from "react";
import { convert } from "html-to-text";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { addNFT } from "../../redux/slice/NFTSlice";

interface Props {
  title: string;
  body: string;
}

function MintEssayModal<Props>({ Modal, title, body }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { trackEvent } = useMatomo();
  // const body = localStorage.getItem("last_essay");
  const text = convert(body, {
    wordwrap: 130,
  });
  const [wordLimit, setWordLimit] = useState(text.slice(0, 300));
  const { actor } = useContext(UserContext);
  const dispatch = useAppDispatch();

  // const { principal } = useContext(UserContext);
  // console.log(principal);
  const handleMint = () => {
    setLoading(true);
    actor
      .mint(title, text)
      .then((d) => {
        Modal(false);
        setLoading(false);
        toast.success("Essay minted successfully");
        // Track Mint Essay Event
        trackEvent({
          category: "Nfts",
          action: `Minted an Essay with id ${Number(d)} `,
          documentTitle: "Mint NFT Modal",
          href: window.location.href,
        });
        navigate("/my-NFTs");
        var data = {
          id: Number(d),
          title,
          content: text,
        };
        dispatch(addNFT(data));
        return;
      })
      .catch((err) => {
        toast.error(err);
        return;
      });
  };
  return (
    <div>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 sm:p-0">
            <div className="relative dark:bg-[#323f4b] bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="dark:bg-[#323f4b] bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex  md:items-center">
                  <div className="flex mt-3 flex-col space-y-2 sm:mt-0  ">
                    <h1
                      className="text-2xl dark:text-white font-bold text-primary"
                      id="modal-title"
                    >
                      Mint Essay as NFT
                    </h1>

                    <div className="flex sm:text-left mt-2">
                      <p className="text-sm dark:text-white text-[#141414]">
                        Do you want to mint the essay you have crafted as an Nft
                        .
                      </p>
                    </div>
                    {/* <input
											className='flex justify-center mt-6 border-cyan-600 shadow-md rounded-md border-2 max-w-lg py-4'
											placeholder='    add your stoic Wallet Id'
										/> */}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 ">
                {loading ? (
                  <p className="dark:text-white/80">minting...</p>
                ) : (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => Modal(false)}
                      className="py-2 px-8  bg-[#141414]/10 text-[#141414] dark:text-white/70 w-full text-sm "
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleMint}
                      className="py-2 px-8 dark:bg-[#425363] bg-[#08172E] text-white w-full text-sm "
                    >
                      Mint
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintEssayModal;
