import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { convert } from "html-to-text";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LexicalRichTextEditor from "../../src/RichText/LexicalRichTextEditor";
import AddCommentEditor from "../../src/RichText/AddComment/AddCommentEditor";
import { ChatIcon } from "@heroicons/react/solid";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setEssayToReviewed } from "../../redux/slice/forgeEssaySlice";
import { setMyEssayToReviewed } from "../../redux/slice/myEssaySlice";
import Navbar from "../../components/shared/navbar/Navbar";
import { BiArrowBack } from "react-icons/bi";
import Loader from "../Loaders/Loader";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import CustomPrompt from "../../utils/navigation-block/CustomPrompt";
// import icon from '/assets/avatar.png'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  addAnnotation,
  clearAnnotation,
} from "../../redux/slice/annotationSlice";
import ReviewCommentEditor from "../../src/RichText/ReviewCommentEditor/ReviewCommentEditor";
import ShowComment from "./ShowComment_";
import { useEssayIsCoin, useGetEssayCoin } from "../../functions/contract";

const EssayDetails = () => {
  const { actor } = useContext(UserContext);
  const value = [];
  const [isLoading2, setIsLoading2] = useState(true);
  const [essay, setEssay] = useState(null);
  const [added, setAdded] = useState(false);
  const [reviewSection, setReviewSection] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [noEssay, setNoEssay] = useState(true);
  const [screen, setScreen] = useState(1);
  // const [disableSubmit, setDisableSubmit] = useState(true)
  const { trackEvent } = useMatomo();
  // const [data, setData] = useState<string>('')
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [annotationPosition, setAnnotationPosition] = useState(0);
  const annotations = useAppSelector((state) => state.annotation);
  const [commentStatus, setCommentStatus] = useState("");
  var unserialized: any =
    annotations[annotationPosition] == null
      ? undefined
      : JSON.parse(annotations[annotationPosition]?.quote);

  const { id }: any = useParams();

  let HighlightEssay: string = "";
  let annotation: string = "";

  const { essayIsCoin } = useEssayIsCoin();
  const { getEssayCoin } = useGetEssayCoin();
  const [hasCoin, setHasCoin] = useState<boolean>(false);
  const [coinAddress, setCoinAddress] = useState<string | null>(null);
  const [coinSymbol, setCoinSymbol] = useState<string | null>(null);

  const changeSection = () => {
    setReviewSection(true);
    setScreen(2);
  };

  console.log("typeof", typeof unserialized);

  const handleSubmit = () => {
    setIsLoading(true);

    actor
      .EssayAnnotate(BigInt(id), HighlightEssay, annotation)
      .then((d) => {
        // Track Annotation Event
        trackEvent({
          category: "Annotation",
          action: `Submitted an Annotation for Essay with id ${id}`,
          documentTitle: "Essay Details Page",
          href: window.location.href,
        });
        setIsLoading(false);
        dispatch(setEssayToReviewed(+id));
        dispatch(setMyEssayToReviewed(+id));
        toast.success("Annotation Submitted");
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        // 			toast.error("something went wrong");
      });
  };

  // console.log(essay);

  useEffect(() => {
    const callOnMount = () => {
      actor
        .getessay(BigInt(id))
        .then((d) => {
          if (d) {
            value.push(d[0]);
            setEssay(value);
            setIsLoading2(false);

            dispatch(clearAnnotation());
            const dd = d[0]?.reviews.map((review) => {
              const val = {
                id: Number(review.id),
                user: review.user,
                quote: review.quote,
                comments: review.comments,
                rated: review.rated,
              };

              dispatch(addAnnotation(val));
            });

            console.log("essay", d);
            console.log("review", annotations);
            return;
          }
          setNoEssay(true);
          setIsLoading2(false);
          return null;
        })
        .catch((err) => {
          toast.error("could not get an essay with this id");
        });
    };
    callOnMount();
  }, []);

  useEffect(() => {
    const checkCoin = async () => {
      if (!id) return;
      const isCoin = await essayIsCoin(Number(id) + 1);
      setHasCoin(isCoin);
      if (isCoin) {
        const coin = await getEssayCoin(Number(id) + 1);
        if (coin && coin[0] && coin[0].contract_address) {
          setCoinAddress(coin[0].contract_address);
          setCoinSymbol(coin[0].symbol || null);
        }
      }
    };
    checkCoin();
  }, [id]);

  const handleCarouselChange = (index: number) => {
    setAnnotationPosition(index);
  };

  if (isLoading2) {
    return (
      <div>
        <Navbar />
        <div className='className=" w-full h-screen flex m-auto justify-center items-center mt-[5rem] '>
          <Loader />
        </div>
      </div>
    );
  } else if (isLoading2 && noEssay) {
    return (
      <div className="flex justify-center items-center text-blue-300 font-semibold text-lg mt-5">
        could not find essay with such id
      </div>
    );
  } else {
    return (
      <div>
        {/* <CustomPrompt
          when={isLoading || isLoading3 || isLoading2}
          message="You gonna lose your data, are you sure?"
        /> */}
        <Navbar />
        {screen === 1 ? (
          <div className="relative px-6 mb-8 mt-[6rem]">
            <div className="flex flex-col">
              <div className="mx-4 sm:ml-16 ">
                <div className="flex flex-row gap-6 relative">
                  <div className="xl:mr-16 w-full lg:w-[72%]  mt-8  ">
                    <div
                      onClick={() => navigate(-1)}
                      className="flex flex-row absolute left-[-1.5rem] sm:left-[-3rem] top-[-.2rem] items-center cursor-pointer"
                    >
                      <BiArrowBack className="text-sm dark:text-white" />
                      <p className="text-[#08172E] dark:text-white text-lg font-semibold ml-4 ">
                        Back
                      </p>
                    </div>
                    <h2 className="justify-center dark:text-white m-auto text-3xl font-bold mt-4">
                      {essay[0].title}
                    </h2>
                    <div className="border-b-[1px] bg-gray-400 mt-3 mb-7" />
                    {/* Essay Content - only once */}
                    <LexicalRichTextEditor essay={essay[0].text} />
                    {/* Review/Annotation UI */}
                    {annotations?.length < 1 ? (
                      <div className="w-full flex justify-center items-center mt-4">
                        <button
                          onClick={changeSection}
                          className="py-2 px-14 text-white bg-[#F98E2D] dark:bg-[#627D98] dark:hover:text-white dark:hover:bg-[#9AA5B1] hover:bg-[#F98E2D]/30 hover:text-black"
                        >
                          {isLoading3 ? "just a sec..." : "Add Review"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Carousel
                          showArrows={true}
                          onChange={(e) => handleCarouselChange(e)}
                        >
                          {annotations?.map((review_) => (
                            <ReviewCommentEditor review={review_.comments} />
                          ))}
                        </Carousel>
                        <div className="w-full flex justify-center items-center mt-4">
                          <button
                            onClick={changeSection}
                            className="py-2 px-14 text-white bg-[#F98E2D] dark:bg-[#627D98] dark:hover:text-white dark:hover:bg-[#9AA5B1] hover:bg-[#F98E2D]/30 hover:text-black"
                          >
                            {isLoading3 ? "just a sec..." : "Add Review"}
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Coin Interaction Section - only once, always below review UI */}
                    {hasCoin && coinAddress ? (
                      <>
                        <div className="my-6 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center">
                          <span className="text-green-700 font-semibold mb-2">This essay has a coin!</span>
                          <button
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={() => {
                              navigate('/marketplace', { state: { coinAddress } });
                            }}
                          >
                            View Coin & Trade
                          </button>
                          <a
                            href={`https://testnet.zora.co/coin/bsep:${coinAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-600 underline text-xs"
                          >
                            View on Zora
                          </a>
                        </div>
                        <div className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center shadow-md">
                          <div className="flex items-center mb-2">
                            <img
                              src={essay[0]?.metadata && essay[0]?.metadata.startsWith('http') ? essay[0].metadata : 'kawak_coin.svg'}
                              alt="Coin visual"
                              className="w-14 h-14 rounded-full border-2 border-blue-500 bg-white object-cover mr-3 shadow"
                              onError={e => (e.currentTarget.src = 'kawak_coin.svg')}
                            />
                            <div>
                              <span className="text-blue-700 font-bold text-lg">Reward Pool</span>
                              <span className="ml-2 text-xs text-gray-500" title="Total rewards available for this essay">(info)</span>
                              <div className="text-2xl font-bold text-green-600 mt-1">42 {coinSymbol || ''}</div>
                            </div>
                          </div>
                          <button
                            className="mt-3 px-6 py-2 bg-green-400 text-white rounded font-semibold shadow cursor-not-allowed opacity-60"
                            disabled
                          >
                            Claim Rewards
                          </button>
                          <div className="mt-2 text-xs text-gray-500">Rewards are distributed to contributors and reviewers.</div>
                        </div>
                      </>
                    ) : (
                      <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center">
                        <span className="text-red-700 font-semibold">This essay does not have a coin.</span>
                      </div>
                    )}
                  </div>
                  {/* for mobile view */}
                  {/* ----------------BEGINNING OF MOBILE-------------------------- */}
                  {annotations.length < 1 ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => setShowComment(!showComment)}
                      className="py-2 fixed dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white  top-[4.7rem] sm:top-[4.5rem] lg:hidden right-[1rem] px-8 text-white  bg-[#F98E2D] cursor-pointer"
                    >
                      {screen === 1 ? "View Comment" : "Add Review"}
                    </button>
                  )}

                  {showComment && (
                    <ShowComment
                      screen={screen}
                      annotationPosition={annotationPosition}
                      setShowComment={setShowComment}
                      essay={essay}
                      unserialized={unserialized}
                      changeSection={changeSection}
                    />
                  )}
                  {/* ----------------END OF MOBILE-------------------------- */}

                  {annotations.length < 1 ? (
                    <div className="dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px] hidden lg:flex flex-col h-[37rem] w-[25%] py-8 px-4 mt-[.4rem] ">
                      <div className="flex bg-[#F98E2D]x flex-col">
                        <div className="border-b-[1px] bg-gray-400 my-2" />

                        <div className="flex flex-row justify-between items-center ">
                          <p className="text-gray-400 text-xs">
                            {Number(essay[0].wordCount)} words
                          </p>
                          <p className="text-[#EF4444]  text-sm font-medium ">
                            Not Reviewed
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex  flex-col  my-4">
                        <button
                          className="py-2 w-full text-sm text-center my-2 text-white bg-[#F98E2D] "
                          onClick={changeSection}
                        >
                          Review Now
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px] hidden lg:flex flex-col h-[37rem] w-[25%] py-8 px-4 mt-[.4rem] ">
                      <div className="flebg-[#F98E2D]x flex-col">
                        <div className="flex flex-row justify-between items-center ">
                          <div className="flex flex-row"></div>

                          <div className="flex flex-row justify-center items-center">
                            <img src={`token-icon.png`} alt="token" />
                            <p className="text-[#2F6FED] ml-1 text-base">
                              {" "}
                              {Number(essay[0].essayCost)}
                            </p>
                          </div>
                        </div>

                        <div className="border-b-[1px] bg-gray-400 my-2" />

                        <div className="flex flex-row justify-between items-center ">
                          <p className="text-gray-400 text-xs">
                            {Number(essay[0].wordCount)} words
                          </p>
                          <p className="text-[#08875D]  text-sm font-medium ">
                            Reviewed
                          </p>
                        </div>
                      </div>

                      <div className=" comment-scroll mt-3 overflow-y-scroll h-[20rem]">
                        {typeof unserialized === "object" ? (
                          unserialized?.map((item) => {
                            return (
                              <div
                                key={item.id}
                                className="flex flex-col p-2 my-3 bg-white"
                              >
                                <p className="mt-1 font-medium rounded-md w-fit text-sm px-2 bg-[#FFFF00]/10">
                                  {item.quote}
                                </p>

                                <p className="text-sm mt-2 ">
                                  {item.comments[0].content}
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative px-6 mb-8 mt-[6rem]">
            <div className="flex flex-col">
              <div className="mx-4 sm:ml-16 ">
                {!reviewSection ? (
                  <div className="flex flex-row gap-6 relative">
                    <div className="xl:mr-16 w-full lg:w-[72%]  mt-8 ">
                      <div
                        onClick={() => navigate(-1)}
                        className="flex flex-row absolute left-[-1.5rem] sm:left-[-3rem] top-[-.2rem] items-center cursor-pointer"
                      >
                        <BiArrowBack className="text-sm dark:text-white/90" />
                        <p className=" dark:text-white/90 text-[#08172E] text-lg font-semibold ml-4 ">
                          Back
                        </p>
                      </div>
                      <h2 className=" dark:text-white justify-center m-auto text-3xl font-bold mt-4">
                        {essay[0].title}
                      </h2>
                      <div className="border-b-2 bg-gray-400 mt-3 mb-7" />
                      <LexicalRichTextEditor essay={essay[0].text} />
                      <div className="flex flex-col my-5 space-y-5 justify-center items-center">
                        <div>
                          {/* {essay[0].reviewed === false ? ( */}
                          <button
                            onClick={changeSection}
                            className="py-2 px-14 text-white bg-[#F98E2D] dark:bg-[#627D98] dark:hover:text-white dark:hover:bg-[#9AA5B1] hover:bg-[#F98E2D]/30 hover:text-black"
                          >
                            {isLoading3 ? "just a sec..." : "Review Essay"}
                          </button>
                          {/* ) : (
                          <div className="bg-[#08172E]/20 py-2 px-4 sm:px-14">
                            This essay has been reviewed already
                          </div>
                        )} */}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowComment(!showComment)}
                      className="py-2 fixed top-[4rem] sm:top-[4.5rem] dark:bg-[#627D98] dark:hover:text-white dark:hover:bg-[#9AA5B1] lg:hidden right-[1rem] px-8 text-white  bg-[#F98E2D] cursor-pointer"
                    >
                      Comment
                    </button>
                    {showComment && (
                      <div className="bg-white dark:bg-[#323f4b] fixed w-[70%] sm:w-[40%] top-[6rem] right-0 mt-[1rem] ">
                        <div className=" dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px] h-screen  py-8 px-4 ">
                          <div className="flex-col">
                            <div className="flex flex-row justify-between items-center ">
                              <div className="flex flex-row">
                                <img
                                  className="w-[40px] h-[40px]"
                                  src={essay[0].userDetails.avatar}
                                  alt="avatar"
                                />
                                <span className="ml-3 flex flex-col justify-between ">
                                  <h2 className="dark:text-gray-400 text-[#08172E] font-bold text-sm">
                                    {essay[0].owner}
                                  </h2>

                                  <p className="text-gray-400 text-xs">
                                    Author
                                  </p>
                                </span>
                              </div>

                              <div className="flex flex-row justify-center items-center">
                                <img
                                  className="w-[2rem] "
                                  src={`wood-log.png`}
                                  alt="token"
                                />
                                <p className="text-[#2F6FED] ml-1 text-base">
                                  {Number(essay[0].essayCost)}
                                </p>
                              </div>
                            </div>

                            <div className="border-b-2 bg-gray-400 my-2" />

                            <div className="flex flex-row justify-between items-center ">
                              <p className="text-gray-400 text-xs">
                                {Number(essay[0].wordCount)} words
                              </p>
                              <p className="text-[#EF4444]  text-sm font-medium ">
                                Not Reviewed
                              </p>
                            </div>

                            <div className="flex flex-col mt-3 ">
                              <h4 className="text-[#F98E2D] dark:text-[#F98E2D]/60 text-base font-bold mb-2 ">
                                Description:
                              </h4>
                              <div className="flex flex-row  mb-2">
                                <div className=" w-1 mt-[6px] p-1 h-1 rounded-full  justify-center items-center dark:text-[#F98E2D]/50 bg-[#F98E2D] "></div>
                                <p className="text-[#08172E] dark:text-gray-400  text-xs font-medium ml-2">
                                  {essay[0].description && essay[0].description}
                                </p>
                              </div>
                              {/* <div className="flex flex-row  mb-2">
                              <div className=" w-1 mt-[6px] p-1 h-1 rounded-full justify-center items-center dark:text-[#F98E2D]/50 bg-[#F98E2D] "></div>
                              <p className="text-[#08172E] dark:text-gray-400 text-xs font-medium ml-2">
                                After reading through the essay be sure to give
                                your overall feedback
                              </p>
                            </div> */}
                            </div>
                          </div>

                          {/* <div className='mt-4'>
															<h4 className='text-[#08172E] font-semibold text-sm'>
																Overall Feedback
															</h4>
															<textarea
																placeholder='Enter review'
																style={{ resize: "none" }}
																className='w-[100%] h-[140px] p-3 text-xs mt-2 placeholder:text-xs '
															/>
														</div> */}
                        </div>
                      </div>
                    )}
                    <div className="dark:bg-[#323f4b] bg-[#F98E2D]/10 rounded-[10px] hidden lg:block h-screen w-[28%] py-8 px-4 mt-[1rem] ">
                      <div className=" flex-col">
                        <div className="flex flex-row justify-between items-center ">
                          <div className="flex flex-row">
                            <img
                              className="cursor-pointer dark:bg-[#303c48] w-10 h-10 bg-white rounded-full py-1 px-1"
                              src={essay[0].userDetails.avatar}
                              alt="avatar"
                            />
                            <span className="ml-3 flex flex-col justify-between ">
                              <h2 className=" dark:text-white/60  text-[#08172E] font-bold text-sm">
                                {essay[0].owner}
                              </h2>

                              <p className="text-gray-400 text-xs">Author</p>
                            </span>
                          </div>

                          <div className="flex flex-row justify-center items-center">
                            <img
                              className="w-[2rem] "
                              src={`wood-log.png`}
                              alt="token"
                            />
                            <p className="text-[#2F6FED] ml-1 text-base">
                              {Number(essay[0].essayCost)}
                            </p>
                          </div>
                        </div>

                        <div className="border-b-2 bg-gray-400 my-2" />

                        <div className="flex flex-row justify-between items-center ">
                          <p className="text-gray-400 text-xs">
                            {Number(essay[0].wordCount)} words
                          </p>
                          <p className="text-[#EF4444]  text-sm font-medium ">
                            Not Reviewed
                          </p>
                        </div>

                        <div className="flex flex-col mt-3 ">
                          <h4 className="text-[#F98E2D] text-base font-bold mb-2 ">
                            Description:
                          </h4>
                          <div className="flex flex-row  mb-2">
                            <div className=" w-1 mt-[6px] p-1 h-1 rounded-full  justify-center items-center bg-[#F98E2D] "></div>
                            <p className="dark:text-white/60 text-[#08172E] text-xs font-medium ml-2">
                              {essay[0]?.description && essay[0]?.description}
                            </p>
                          </div>
                          {/* <div className="flex flex-row  mb-2">
                          <div className=" w-1 mt-[6px] p-1 h-1 rounded-full justify-center items-center bg-[#F98E2D] "></div>
                          <p className=" dark:text-white/60 text-[#08172E] text-xs font-medium ml-2">
                            After reading through the essay be sure to give your
                            overall feedback
                          </p>
                        </div> */}
                        </div>
                      </div>

                      {/* <div className='mt-4'>
											<h4 className='text-[#08172E] font-semibold text-sm'>
												Overall Feedback
											</h4>
											<textarea
												placeholder='Enter review'
												style={{ resize: "none" }}
												className='w-[100%] h-[140px] p-3 text-xs mt-2 placeholder:text-xs '
											/>
										</div> */}
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="lg:mr-[22rem]">
                      <h2 className="justify-center dark:text-white/90 m-auto text-3xl font-bold mt-4">
                        {essay[0].title}
                      </h2>
                      <div className="border-b-2 bg-gray-400 mt-[1rem] mb-[.8rem]" />
                      <AddCommentEditor
                        essay={essay[0].text}
                        handleData={(htmlString) => {
                          const data: string = htmlString;

                          HighlightEssay = data;
                        }}
                        commentData={(comment) => {
                          setCommentStatus(comment);
                          annotation = JSON.stringify(comment);
                        }}
                      />
                    </div>
                    <div className=" z-10 fixed bottom-[3rem] right-[7rem]">
                      <button
                        className="py-1 px-7 disabled:bg-slate-300 dark:bg-[#627D98] dark:hover:bg-[#9AA5B1] dark:hover:text-white text-sm text-center text-white bg-[#08172E] hover:bg-primary-light hover:text-black"
                        onClick={handleSubmit}
                        disabled={commentStatus.length > 0 ? false : true}
                      >
                        {isLoading ? "submitting" : "Submit Review"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default EssayDetails;
