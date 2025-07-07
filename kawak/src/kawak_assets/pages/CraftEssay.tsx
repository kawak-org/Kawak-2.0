import React, { useState, useContext, useEffect, useRef } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import EssayEditor from "../components/essay/EssayEditor";
// import { SearchOptionProps } from "../components/common/Search";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useHTMLtoTextConverter } from "../utils/htmlToText";
import { ShepherdTourContext } from "react-shepherd";
// import MintEssayModal from "../components/mint/MintEssayModal";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  setnoOfEssays,
  setOnboarding,
  setTokenBalance,
} from "../redux/slice/profileSlice";
import { resetCount, setEssayCount } from "../redux/slice/countSlice";
import CraftEssayNavbar from "../components/shared/navbar/CraftEssayNavbar";
import { addToForge } from "../redux/slice/forgeEssaySlice";
import { addToMyEssay } from "../redux/slice/myEssaySlice";
import ErrorHandler from "../utils/ErrorHandler";
// import { BackspaceIcon } from "@heroicons/react/solid";
import PreviewEssay from "../components/essay/PreviewEssay";
import EssayCoinForm from "../components/essay/EssayCoinForm";
import { getPinataConfig } from "../config/pinata";
import { EssayEditorContext } from "../context/EssayEditorContext";
// import CustomPrompt from "../utils/navigation-block/CustomPrompt";
import { addToMyDraft, updateDraftItem } from "../redux/slice/draftSlice";
import TagInput from "../components/Tag/TagInput";
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules
// const topics: SearchOptionProps[] = [
// 	{ id: 1, name: "Select topic", disabled: true },
// 	{ id: 2, name: "Development" },
// 	{ id: 3, name: "Design" },
// 	{ id: 4, name: "Nature" },
// ];

const CraftEssay = () => {
  const navigate = useNavigate();
  const { trackEvent, trackPageView } = useMatomo();
  // const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [minCost, setMinCost] = useState(0);
  const [createdEssayId, setCreatedEssayId] = useState<number>(0);
  const [essayCoinConfig, setEssayCoinConfig] = useState<any>(null);
  const [coinCreationStatus, setCoinCreationStatus] = useState<string>('');
  const coinFormRef = useRef<any>(null);

  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useAppSelector((state) => state.profile);
  const tags = useAppSelector((state) => state.essayTags);
  const dispatch = useAppDispatch();
  const essayWords = useAppSelector((state) => state.essay.words);
  const [pdf, setPdf] = useState("")



  const {
    essay,
    setEssay,
    setStateEmpty,
    step,
    setStep,
    title,
    setTitle,
    essayCost,
    setEssayCost,
    editingDraftId,
    setEditingDraftId,
    convertHTMLtoEditorContent,
    visibility, 
    setVisibility,
    description,
    setDescription
  } = useContext(EssayEditorContext);

  const { actor } = useContext(UserContext);
  const essayEntry = {
    title: title,
    topic: tags.map((tag) => tag.text),
    essayCost: BigInt(essayCost),
    text: localStorage.getItem("last_essay"),
  };

  const dispatchField = {
    id:undefined,
    title,
    tags: tags.map((tag) => tag.text),
    essayCost,
    text: localStorage.getItem("last_essay"),
    wordCount: essayWords,
    owner: user.username,
    reviewed: false,
    reviewTimes: 0,
    avatar: user.avatar,
    public:visibility,
    description
  };

  const handleSubmitAndCreateCoin = async () => {
    console.log("🚀 Starting combined essay submission and coin creation process...");
    
    if (essayWords < 100) {
      toast.error("essay can't be lesser than a 100 words");
      return;
    } else if (title.length < 2) {
      toast.error("Please add a title to your essay");
      return;
    }

    // 1. Get coin config from EssayCoinForm
    if (!coinFormRef.current || !coinFormRef.current.getConfig) {
      toast.error("Coin configuration is not available");
      return;
    }
    const coinConfig = coinFormRef.current.getConfig();
    if (!coinConfig) {
      toast.error("Please fill out the coin configuration");
      return;
    }

    setIsLoading(true);
    setCoinCreationStatus('Submitting essay...');
    
    try {
      console.log("📝 Step 1: Updating onboarding status if needed");
      if (user.onboarding === false && user.noOfEssays === 0) {
        console.log("🔄 Updating user onboarding status");
        await actor.updateOnboarding(true);
        dispatch(setOnboarding(true));
      }

      console.log("📝 Step 2: Creating essay on blockchain");
      console.log("Essay details:", {
        title: essayEntry.title,
        topic: essayEntry.topic,
        wordCount: essayWords,
        cost: essayCost,
        visibility,
        description
      });

      const essayResult = await actor.createEssay(
        essayEntry.title,
        essayEntry.topic,
        BigInt(essayWords),
        essayEntry.essayCost,
        essayEntry.text,
        visibility,
        description
      );

      if (essayResult && 'ok' in essayResult) {
        const essayId = Number(essayResult.ok[0]);
        console.log("✅ Essay created successfully with ID:", essayId);
        setCreatedEssayId(essayId);
        setCoinCreationStatus('Essay submitted! Creating coin...');

        // Track Create Essay Event
        trackEvent({
          category: "Post",
          action: `Created an Essay with id ${essayId}`,
          documentTitle: "Create Essay Page",
          href: window.location.href,
        });

        // Update Redux state
        handleRemoveFromDraft();
        dispatch(setTokenBalance(essayCost));
        dispatch(setnoOfEssays());
        if(visibility) {
          dispatch(addToForge({ ...dispatchField, id: essayId - 1 }));
        }
        dispatch(addToMyEssay({ ...dispatchField, id: essayId - 1 }));

        // 2. Immediately create the coin with the config and essayId
        setCoinCreationStatus('Creating coin...');
        if (coinFormRef.current && coinFormRef.current.createCoinWithEssayId) {
          await coinFormRef.current.createCoinWithEssayId(essayId);
        } else {
          toast.error("Coin creation function not available");
        }
        setCoinCreationStatus('Essay and coin created successfully!');
        setStateEmpty();
        toast.success("Essay and Coin Created Successfully!");
        dispatch(resetCount());
        localStorage.removeItem("last_essay");
        
        // Navigate after a short delay to allow coin creation to complete
        setTimeout(() => {
          navigate(`/forge`);
        }, 2000);
        
      } else if (essayResult && 'err' in essayResult) {
        throw new Error(`Essay creation failed: ${essayResult.err}`);
      } else {
        throw new Error("Essay creation returned unexpected result");
      }
    } catch (err) {
      console.error("❌ Error in combined submission process:", err);
      setIsLoading(false);
      setCoinCreationStatus('Error occurred during submission');
      ErrorHandler(err);
    }
  };

  const handleCoinCreated = (coinAddress: string) => {
    console.log("🎉 Coin created successfully! Address:", coinAddress);
    setCoinCreationStatus(`Coin created! Address: ${coinAddress}`);
    toast.success(`EssayCoin created successfully! Address: ${coinAddress}`);
    setEssayCoinConfig(null); // Clear saved config
  };

  const countWordsAndSetToken = () => {
    const text = useHTMLtoTextConverter(essay);
    const noOfWords: number = text.split(" ").length;
    const lowestToken = Math.round((noOfWords * 1) / 100);
    setEssayCost(lowestToken);
    setMinCost(lowestToken);
  };

  // fetch is user is onboarded on page mount, if not, show tour
  const tour = useContext(ShepherdTourContext);
  // console.log(tour);
  // if (step === 1 && essay == "" && user.onboarding === false) {
  // 	tour?.show("intro2", true);
  // } else if (step === 2 && title == "" && user.onboarding === false) {
  // 	tour?.show("intro4", true);
  // }

  //DRAFT ENDPOINTS

  const text = localStorage.getItem("last_essay");
  const handleSaveEditDraft = () => {
    // edit a draft that has been created vbefore and save it again
    setDraftLoading(true);
    actor
      .editDraft(BigInt(editingDraftId), title, text)
      .then(() => {
        dispatch(updateDraftItem({ id: editingDraftId, text, title }));
        // Track Edit Draft Event
        trackEvent({
          category: "Essay",
          action: "Edited A Drafted Content",
          documentTitle: "Create Essay Page",
          href: window.location.href,
        });
        setDraftLoading(false);
        toast.success("Drafted Essay Updated");
      })
      .catch((err) => {
        setDraftLoading(false);
        ErrorHandler(err);
      });
  };

  const handleRemoveFromDraft = async () => {
    if (editingDraftId !== 0) {
      dispatch(updateDraftItem({ id: editingDraftId, text: "", title: "" }));
      setEditingDraftId(0);
    }
  };

  const handleSaveToDraft = () => {
    console.log("💾 Saving essay to draft...");
    setDraftLoading(true);
    actor
      .draftEssay(title, text)
      .then((d: any) => {
        console.log("✅ Draft saved successfully, ID:", d);
        dispatch(
          addToMyDraft({
            id: Number(d),
            title,
            text,
          })
        );
        // Track Save Draft Event
        trackEvent({
          category: "Essay",
          action: "Saved A Drafted Content",
          documentTitle: "Create Essay Page",
          href: window.location.href,
        });
        setDraftLoading(false);
        toast.success("Draft Saved");
      })
      .catch((err) => {
        console.error("❌ Error saving draft:", err);
        setDraftLoading(false);
        ErrorHandler(err);
      });
  };

  const convertPdfToHtml = async (event:any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('pdf', file);
      const response = await fetch('/api/convert-pdf', {
        method: 'POST',
        body: formData,
      });
      const html = await response.text();
      setPdf(html);
    }
  };

const handleSetVisibility = (e:any) => {
  setVisibility(e.target.checked);
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CraftEssayNavbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        {step === 1 ? (
          <>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Create Your Essay
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your essay title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Brief description of your essay..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <TagInput />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <EssayEditor
                  handleEditorChange={(html) => {
                    localStorage.setItem("last_essay", html);
                    setEssay(html);
                    dispatch(setEssayCount());
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  disabled={draftLoading}
                  onClick={handleSaveToDraft}
                  className=" continue-essay-btn-tour border-black border-1px rounded-sm bg-white text-[#08172E] disabled:bg-slate-300 "
                >
                  {draftLoading ? "saving" : "Save to Draft"}
                </button>
                <button
                  disabled={
                    (essayWords < 100 && title.length < 2 && tags.length < 1) ||
                    (tags.length < 1 && essayWords < 100) ||
                    (title.length < 2 && essayWords < 100)
                      ? true
                      : false || draftLoading
                  }
                  onClick={() => {
                    setStep(2), countWordsAndSetToken();
                  }}
                  className=" continue-essay-btn-tour rounded-sm dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white  text-white bg-[#08172E] disabled:bg-slate-300 "
                >
                  Preview Essay
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Preview Essay */
          /* title and token */
          <>
            <div className="flex justify-between items-center mt-5  w-[80%]">
              <p className="font-bold sm:3xl md:text-4xl dark:text-white ">
                {title}
              </p>
              <div className="flex gap-4 items-center dark:text-white">
              <p>Public</p>
              <Toggle
               checked={visibility}
               onChange={(e) => handleSetVisibility(e)} />

                   <p>Tokens</p>
                <input
                  className="py-1 px-1 w-12 h-6 rounded-sm dark:bg-[#323f4b] dark:text-white dark:border-[#3e5060] border-[#141414A6] border-1"
                  type="number"
                  min={minCost}
                  value={essayCost}
                  name="essayCost"
                  onChange={(e: any) => setEssayCost(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-[#1414141A] h-1 w-[80%] my-10" />
            {/* Preview Essay */}
            <div className="w-[80%]">
              <PreviewEssay />
            </div>

            {/* EssayCoin Form */}
            <div className="w-[80%] mt-8">
              {essayCoinConfig && createdEssayId === 0 && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      EssayCoin configuration saved! Will be created after essay submission.
                    </span>
                  </div>
                </div>
              )}
              <EssayCoinForm 
                ref={coinFormRef}
                essayId={createdEssayId}
                essayTitle={title}
                onCoinCreated={handleCoinCreated}
                isDisabled={false}
                pinataConfig={getPinataConfig()}
              />
            </div>

            {/* Status Display */}
            {coinCreationStatus && (
              <div className="w-[80%] mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {coinCreationStatus}
                  </span>
                </div>
              </div>
            )}

            <div className="flex w-[80%]  justify-end mt-10">
              {isLoading ? (
                <button className="text-primary-dark dark:text-white/90 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Submitting and Creating Coin...</span>
                </button>
              ) : (
                <button
                  disabled={essayWords < 100 && title.length < 2 ? true : false}
                  onClick={handleSubmitAndCreateCoin}
                  className="continue-essay-btn-tour dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white  rounded-sm text-white bg-[#08172E] disabled:bg-slate-300 px-6 py-2"
                >
                  Submit and Create Coin
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CraftEssay;

{
  /* 
<div>
			<CraftEssayNavbar />
			<div className=' bg-[rgba(8, 23, 46, 0.05)] px-2 py-3 mt-20'>
				<div></div>
				{step === 1 ? (
					<div className=' flex justify-end '>
			
						<button
							disabled={essayWords < 100 ? true : false}
							onClick={() => {
								setStep(2), countWordsAndSetToken();
							}}
							className='continue-essay-btn-tour text-white bg-[#08172E] disabled:bg-slate-300'
						>
							Continue
						</button>
					</div>
				) : (
					<div className='flex my-4 items-center justify-between'>
						<div>
							<BackspaceIcon
								className='w-6 h-6 text-primary-dark'
								onClick={() => setStep(1)}
							/>
						</div>
						<div className='flex gap-3'>
							 <button
								onClick={() => setModalIsOpen(true)}
								className='text-[#08172E] border border-[#08172E]'
							>
								Mint Essay
							</button> 

							{isLoading ? (
								<button className='text-primary-dark'>submitting...</button>
							) : (
								<button
									onClick={handleSubmit}
									className='essay-submit-tour text-white bg-[#08172E]'
								>
									Submit
								</button>
							)}
						</div>
					</div>
				)}
			</div>
			{step === 1 ? (
				<div className='essay-editor-tour'>
					<EssayEditor
						handleEditorChange={(html) => {
							localStorage.setItem("last_essay", html);
							setEssay(html);
							dispatch(setEssayCount());
						}}
					/>
				</div>
			) : (
				<div>
					<form
						key='from'
						className='bg-white border border-gray-300 px-5 py-3'
					>
						<div key='mid' className='flex gap-3 mb-2'>
							<div key='form-field' className='essay-title-tour form-field'>
								<label htmlFor=' essayTitle'>Title</label>
								<input
									type='text'
									value={title}
									name='title'
									onChange={(e: any) => setTitle(e.target.value)}
								/>
							</div>

							<div className='essay-token-tour form-field'>
								<label htmlFor='tokenCost'>Token</label>
								<input
									type='number'
									min={minCost}
									value={essayCost}
									name='essayCost'
									onChange={(e: any) => setEssayCost(e.target.value)}
								/>
							</div>
						</div>
					</form>
				</div>
			)}
			{modalIsOpen && (
				<MintEssayModal body={essay} title={title} Modal={setModalIsOpen} />
			)}
		</div>
			*/
}
