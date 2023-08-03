import React, { useState, useContext, useEffect } from "react";
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

  const handleSubmit = async () => {
    console.log(essayEntry);
    if (essayWords < 100) {
      toast.error("essay can't be lesser than a 100 words");
      return;
    } else if (title.length < 2) {
      toast.error("Please add a title to your essay");
      return;
    } else {
      setIsLoading(true);
      if (user.onboarding === false && user.noOfEssays === 0) {
        actor.updateOnboarding(true).then(() => {
          dispatch(setOnboarding(true));
        });
      }
      actor
        .createEssay(
          essayEntry.title,
          essayEntry.topic,
          BigInt(essayWords),
          essayEntry.essayCost,
          essayEntry.text,
          visibility,
          description
        )
        
        .then((d:any) => {
          if (d) {
            // Track Create Essay Event
            trackEvent({
              category: "Post",
              action: `Created an Essay with id ${Number(d)} `,
              documentTitle: "Create Essay Page",
              href: window.location.href,
            });
            handleRemoveFromDraft();
            setIsLoading(false);
            dispatch(setTokenBalance(essayCost));
            dispatch(setnoOfEssays());
            if(visibility) {
            dispatch(addToForge({ ...dispatchField, id: Number(d.ok[0]) - 1 }));
          }
            dispatch(addToMyEssay({ ...dispatchField, id: (Number(d.ok[0]) - 1) }));
            // set essay editor content to initial
            setStateEmpty();
            toast.success("Essay Created");
            dispatch(resetCount());
            localStorage.removeItem("last_essay");
            // console.log("value of d", d)
            navigate(`/forge`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          ErrorHandler(err);
          console.log(err);
        });
    }
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
        navigate("/my-essay/draft");
      })
      .catch((err) => {
        console.log(err);
        setDraftLoading(false);
        ErrorHandler(err);
      });
  };

  const handleRemoveFromDraft = async () => {
    if (editingDraftId) {
      await actor.deleteDraft(BigInt(editingDraftId));
      setEditingDraftId(null);
      return;
    }
    return;
  };

  const handleSaveToDraft = () => {
    if (essayWords < 2) {
      toast.error("Essay to save can't be empty");
      return;
    } else if (title.length < 2) {
      toast.error("Please add a title to your essay");
      return;
    } else if (editingDraftId) {
      handleSaveEditDraft();
      return;
    } else {
      setDraftLoading(true);

      // const text = convertToRaw(editorState?.getCurrentContent());
      // console.log(text)
      actor
        .draftEssay(title, text)
        .then((d) => {
          console.log(d);
          setDraftLoading(false);
          const payload = {
            id: Number(d) - 1,
            text,
            title,
          };
          dispatch(addToMyDraft(payload));
          toast.success("Added to Draft");
          navigate("/my-essay/draft");
        })
        .catch((err) => {
          setDraftLoading(false);
          ErrorHandler(err);
        });
    }
  };
  //track page view
  useEffect(() => {
    const params = {
      documentTitle: "Create Essay Page",
      href: window.location.href,
      customDimensions: false,
    };
    trackPageView(params);
  }, []);


  const convertPdfToHtml = async (event:any) => {
 const formData = new FormData();

 formData.append("pdfFile",event.target.files[0])

    fetch("http://localhost:3000/extract-text",{
      method:"POST",
      body:formData,
    }).then(res => {
   return res.text()
    }).then((data) => {
      setEssay(data)
      convertHTMLtoEditorContent(data)
    })
  }
const handleSetVisibility = (e:any) => {
  setVisibility(e.target.checked)

}

  return (
    <div className="">
      {/* <CustomPrompt
				when={draftLoading || isLoading}
				message='You gonna lose your data, are you sure?'
			/> */}
      <CraftEssayNavbar />
      {/* <div></div> */}
      <div className="flex flex-col items-center justify-center px-2 py-3 mt-20 ">
        {step === 1 ? (
          <>
            {/* Title */}
            <div
              className="flex p-2 flex-col border-inherit border-2 dark:border-[#3e5060] bg-white dark:bg-[#323f4b]  w-[80%]
			 "
            >
              <input
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
                className="text-md py-4 px-5 outline-none border dark:bg-[#323f4b] dark:border-[#3e5060] border-gray-200  dark:text-white text-red.500 rounded-md placeholder:text-xl placeholder:font-bold dark:placeholder:text-white/70 placeholder:text-[#141414A6] w-[100%]"
                placeholder="Enter title here......"
              />
              <TagInput />
              <input
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                className="text-md mt-5 py-4 px-5 outline-none border dark:bg-[#323f4b] dark:border-[#3e5060] border-gray-200  dark:text-white text-red.500 rounded-md placeholder:text-xl placeholder:font-bold dark:placeholder:text-white/70 placeholder:text-[#141414A6] w-[100%]"
                placeholder="Enter a short description of your essay......"
              />
            </div>
            {/* word count */}
            <div className="flex place-content-end gap-3 mt-10 w-[80%]">
              <label className="text-white bg-[#08172E] italic rounded-lg border-inherit border-3 px-2 text-xs  py-1 cursor-pointer" htmlFor="pdf" >upload from pdf
              <input type="file" name="upload" value={pdf} onChange={(e) => {convertPdfToHtml(e)}} style={{"display":"none"}} id="pdf" accept="application/pdf" />
              </label>
              <p className="text-white bg-[#08172E] italic rounded-lg border-inherit border-3 px-2 text-xs  py-1">
                {essayWords} words
              </p>
              {/* <PdfViewer/> */}
            </div>
            {/* Text Editor */}
            <div className="essay-editor-tour w-[80%]">
              <EssayEditor
                handleEditorChange={(html) => {
                  localStorage.setItem("last_essay", html);
                  setEssay(html);
                  dispatch(setEssayCount());
                }}
              />
            </div>
            {/* Footer Buttons */}
            <div className="flex w-[80%] justify-end mt-10">
              <div className="flex items-center gap-3">
                <button
                  disabled={
                    essayWords < 2 && title.length < 2
                      ? true
                      : false || draftLoading
                  }
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

            <div className="flex w-[80%]  justify-end mt-10">
              {isLoading ? (
                <button className="text-primary-dark dark:text-white/90 ">
                  submitting...
                </button>
              ) : (
                <button
                  disabled={essayWords < 100 && title.length < 2 ? true : false}
                  onClick={handleSubmit}
                  className="continue-essay-btn-tour dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white  rounded-sm text-white bg-[#08172E] disabled:bg-slate-300"
                >
                  Submit
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
